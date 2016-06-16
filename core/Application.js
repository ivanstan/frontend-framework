class Application {

    constructor(settings) {
        this.settings = settings;
        this.modules = {};
        this.current = {};

        this.loadModules()
            .done(() => {
                $(window).trigger('hashchange');
            })
            .fail((jqXHR, textStatus, errorThrown) => {

                let exception = AjaxException.create('Error loading modules')
                    .setJqXHR(jqXHR)
                    .setTextStatus(textStatus)
                    .setErrorThrown(errorThrown);

                Application.errorHandler(exception);
            });

        $(window).on('hashchange', () => {
            this.navigate(new Route(window.location.hash));
        });
    };

    loadModules() {
        var defer = $.Deferred();

        for (var i in this.settings.modules) {
            var moduleName = this.settings.modules[i];
            var moduleClassName = Util.capitalize(moduleName) + 'Module';

            $.ajax({
                url: 'module/' + moduleName + '/' + moduleClassName + '.js',
                success: (source, textStatus, jqXHR) => {
                    var moduleClass = window.classes[moduleClassName];

                    if (typeof moduleClass !== 'undefined') {
                        var module = new moduleClass();

                        this.modules[moduleName] = module;

                        this.settings['modules'][moduleName] = module.settings;
                        this.settings['modules'].splice(this.settings['modules'].indexOf(moduleName), 1);

                        if (jqXHR.status !== 200) {
                            defer.reject(jqXHR, textStatus, 'Error loading ' + moduleClassName);
                        }

                        if (i == this.settings.modules.length) {
                            defer.resolve();
                        }
                    }


                },
                error: (jqXHR, textStatus, errorThrown) => {
                    defer.reject(jqXHR, textStatus, errorThrown);
                }
            });
        }

        return defer.promise();
    }

    navigate(route) {
        this.loadController(route)
            .fail((jqXHR, textStatus, errorThrown) => {

                let exception = AjaxException.create(errorThrown)
                    .setJqXHR(jqXHR)
                    .setTextStatus(textStatus)
                    .setErrorThrown(errorThrown)
                    .setRoute(route);

                Application.errorHandler(exception);
                return null;
            })
            .done((template) => {
                let controllerClass = window.classes[route.controllerClassName];

                if (typeof controllerClass == 'undefined') {
                    Util.notification('error', 'State controller missing' + route.controllerClassName);
                }

                var controller = new controllerClass();

                controller.settings = this.settings;
                controller.template = template;
                controller.route = route;

                controller.async(controller.deferred)
                    .always(() => {
                        // call resign of previous controller
                        if (typeof this.current.controller !== 'undefined') {
                            this.current.controller.resign();
                        }

                        let view = $(this.settings.viewSelector);

                        view.html(controller.template);
                        view.attr('class', route.pathname.replace('/', '-') + '-page');

                        this.current.assign = controller.assign();
                        this.current.controller = controller;
                        this.hook('postRender');
                    });


                return route;
            });
    }

    loadController(route) {
        var defer = $.Deferred(),
            viewFile = 'module/' + route.module + '/view/' + route.controller + '.html';

        this.importHtml(viewFile)
            .done((link) => {
                var template = Util.link2html(link);

                if (template == false) {
                    Util.notification('error', 'File ' + viewFile + ' is not template');
                    defer.reject();
                }

                defer.resolve(template);
            })
            .fail(() => {
                Util.notification('error', 'Error loading ' + viewFile);
            });

        return defer.promise();
    }

    importHtml(href) {
        var defer = $.Deferred(),
            link = $('head [href="' + href + '"]');

        // ToDo: Check if this if can be avoided
        if (link.length > 0) {
            defer.resolve(link);
            return defer.promise();
        }

        var link = document.createElement('link');
        link.rel = 'import';
        link.href = href;
        link.setAttribute('async', '');
        link.onload = (event) => {
            defer.resolve($(link));
        };
        link.onerror = (event) => {
            Util.notification('error', 'Unable to load: ' + href);
            defer.reject(event);
        };

        $('head').append($(link));

        return defer.promise();
    }

    hook(hookName) {
        for (let i in this.modules) {
            let module = this.modules[i];

            if (typeof module[hookName] === 'function') {
                try {
                    module[hookName]();
                } catch (exception) {
                    Util.notification('error', exception, 'Exception');
                }
            }
        }
    }

    static errorHandler(exception) {
        exception.processError();

        Util.notification('error', exception.getTitle(), exception.getMessage());

        console.log(exception);
    }

}