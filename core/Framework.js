/**
 *
 */
class Framework {

    /**
     * Application bootstrap.
     *
     * @param settings
     */
    constructor(config) {
        window.classes = window.classes || {};
        this.config = config;
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

                this.errorHandler(exception);
            });

        $(window).on('hashchange', () => {
            this.navigate(new Route(window.location.hash));
        });
    };

    /**
     * Performs loading of modules.
     *
     * @returns {*}
     */
    loadModules() {
        var defer = $.Deferred();

        var moduleCount = Object.keys(this.config.modules).length;
        var currentCount = 0;

        for (var moduleName in this.config.modules) {
            var moduleClassName = Util.capitalize(moduleName) + 'Module';

            $.ajax({
                url: 'module/' + moduleName + '/' + moduleClassName + '.js',
                success: (source, textStatus, jqXHR) => {
                    var moduleClass = window.classes[moduleClassName];

                    if (typeof moduleClass !== 'undefined') {
                        var module = new moduleClass(this);

                        this.modules[moduleName] = module;

                        this.config['modules'][moduleName] = module.settings;
                        // this.config['modules'].splice(this.config['modules'][moduleName], 1);

                        if (jqXHR.status !== 200) {
                            defer.reject(jqXHR, textStatus, 'Error loading ' + moduleClassName);
                        }

                        if (currentCount == moduleCount) {
                            defer.resolve();
                        }
                    }


                },
                error: (jqXHR, textStatus, errorThrown) => {
                    defer.reject(jqXHR, textStatus, errorThrown);
                }
            });
            currentCount++;
        }

        return defer.promise();
    }

    /**
     * Navigate to state.
     *
     * @param {Route} route
     */
    navigate(route) {
        this.loadController(route)
            .fail((jqXHR, textStatus, errorThrown) => {

                let exception = AjaxException.create(errorThrown)
                    .setJqXHR(jqXHR)
                    .setTextStatus(textStatus)
                    .setErrorThrown(errorThrown)
                    .setRoute(route);

                this.errorHandler(exception);
                return null;
            })
            .done((template) => {
                let controllerClass = window.classes[route.controllerClassName];

                if (typeof controllerClass == 'undefined') {
                    this.notification('error', 'State controller missing' + route.controllerClassName);
                }

                var controller = new controllerClass(this);

                controller.template = template;
                controller.route = route;

                controller.preRender()
                    .always(() => {
                        // call resign of previous controller
                        if (typeof this.current.controller !== 'undefined') {
                            this.current.controller.destructor();
                        }

                        let view = $(this.config.viewSelector);

                        view.html(controller.template);
                        view.attr('class', route.pathname.replace('/', '-') + '-page');

                        this.current.assign = controller.postRender();
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
                    this.notification('error', 'File ' + viewFile + ' is not template');
                    defer.reject();
                }

                defer.resolve(template);
            })
            .fail(() => {
                this.notification('error', 'Error loading ' + viewFile);
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
            this.notification('error', 'Unable to load: ' + href);
            defer.reject(event);
        };

        $('head').append($(link));

        return defer.promise();
    }

    /**
     * Execute a module hook. This function will run methods name hookName in all modules.
     *
     * @param {String} hookName
     */
    hook(hookName) {
        for (let i in this.modules) {
            let module = this.modules[i];

            if (typeof module[hookName] === 'function') {
                try {
                    module[hookName]();
                } catch (exception) {
                    this.notification('error', exception, 'Exception');
                }
            }
        }
    }

    errorHandler(exception) {
        exception.processError();

        this.notification('error', exception.getTitle(), exception.getMessage());

        console.log(exception);
    }

    /**
     * Raise notification to user.
     *
     * @param {String} type      Possible values: 'error', 'warning', 'success', 'info'
     * @param {String} title
     * @param {String} message
     */
    notification(type, title, message) {
        if (typeof window.toastr == 'object' && typeof window['toastr'][type] == 'function') {

            if (!this.isDebug() && type === 'error') {
                return false;
            }

            window['toastr'][type](title, message);
        }
    }

    /**
     * Returns true if application is in debug mode.
     *
     * @returns {Boolean}
     */
    isDebug() {
        return location.pathname.indexOf('index-dev.html') > 0
    }

}