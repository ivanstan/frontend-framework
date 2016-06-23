/**
 *
 *
 */
let _current = new WeakMap();
let _modules = new WeakMap();

class Framework {

    /**
     * Application bootstrap.
     *
     * @param config
     */
    constructor(config) {
        window.classes = window.classes || {};
        this.config = config;

        _current.set(this, {});
        _modules.set(this, {});

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
        var modules = _modules.get(this);

        var moduleCount = Object.keys(this.config.modules).length;
        var currentCount = 0;

        for (var moduleName in this.config.modules) {
            if (!this.config.modules.hasOwnProperty(moduleName)) continue;

            var moduleClassName = `${Util.capitalize(moduleName)}Module`;

            $.ajax({
                url: `module/${moduleName}/${moduleClassName}.js`,
                success: (source, textStatus, jqXHR) => {
                    var moduleClass = window.classes[moduleClassName];

                    if (typeof moduleClass !== 'undefined') {
                        var module = new moduleClass(this);

                        modules[moduleName] = module;
                        _modules.set(this, modules);
                        this.config['modules'][moduleName] = module.settings;

                        if (jqXHR.status !== 200) {
                            defer.reject(jqXHR, textStatus, `Error loading ${moduleClassName}`);
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
        this.route = route;
        var current = _current.get(this);

        // call resign of previous controller
        var destructorDefer = $.Deferred(),
            destructorPromise;

        if (typeof current.destructor === 'function') {
            destructorPromise = current.destructor(destructorDefer);
        } else {
            destructorDefer.resolve();
            destructorPromise = destructorDefer.promise();
        }

        destructorPromise.always(() => {
            this.hook('preRender')
                .always(() => {
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
                                this.notification('error', `State controller missing ${route.controllerClassName}`);
                            }

                            var controller = new controllerClass(this);

                            controller.template = template;
                            controller.route = route;

                            var preRenderDefer = new $.Deferred();
                            controller.preRender(preRenderDefer)
                                .always(() => {
                                    let view = $(this.config.viewSelector);

                                    view.html(controller.template);
                                    view.attr('class', route.pathname.replace('/', '-') + '-page');

                                    var postRenderDefer = new $.Deferred();
                                    controller.postRender(postRenderDefer)
                                        .always(() => {
                                            _current.set(this, controller);
                                            this.hook('postRender').always(() => {

                                            });
                                        });
                                });


                            return route;
                        });
                });
        });
    }

    loadController(route) {
        var defer = $.Deferred(),
            viewFile = `module/${route.module}/view/${route.controller}.html`;

        this.importHtml(viewFile)
            .done((link) => {
                var template = Util.link2html(link);

                if (template == false) {
                    this.notification('error', `File ${viewFile} is not template`);
                    defer.reject();
                }

                defer.resolve(template);
            })
            .fail(() => {
                this.notification('error', `Error loading ${viewFile}`);
            });

        return defer.promise();
    }

    importHtml(href) {
        var defer = $.Deferred(),
            link = $(`head [href="${href}"]`);

        // ToDo: Check if this if can be avoided
        if (link.length > 0) {
            defer.resolve(link);
            return defer.promise();
        }

        link = document.createElement('link');
        link.rel = 'import';
        link.href = href;
        link.setAttribute('async', '');
        link.onload = (event) => {
            defer.resolve($(link));
        };
        link.onerror = (event) => {
            this.notification('error', `Unable to load: ${href}`);
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
        var deferredArray = [],
            modules = _modules.get(this);

        for (let i in modules) {
            if (!modules.hasOwnProperty(i)) continue;

            let module = modules[i];
            var defer = $.Deferred();
            deferredArray.push(defer);

            if (typeof module[hookName] === 'function') {
                try {
                    module[hookName](defer);
                } catch (exception) {
                    this.notification('error', exception, 'Exception');
                }
            }
        }

        return $.when.apply($, deferredArray).promise();
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