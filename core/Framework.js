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
        this.config    = config;
        this.routes    = {
            '/': {
                controller: 'default',
                module    : 'default'
            }
        };
        this.route     = {};

        _current.set(this, {});
        _modules.set(this, {});

        this.loadModules()
            .done(() => {
                this.store = Redux.createStore(() => {
                    this.changeState();
                });

                this.store.subscribe((a, s, d) => {
                    let state = this.store.getState();
                    let route =  new Route(window.location.hash, {}, this.routes);
                    this.navigate(route);
                });

                $(window).on('hashchange', () => {
                    this.store.dispatch({ type: 'INCREMENT' });


                });

                $(window).trigger('hashchange');
            })
            .fail((message) => {
                this.notification('error', message);
            });
    };

    changeState(state, action) {
        if (typeof state === 'undefined') {
            return {};
        }

        return state;
    }

    /**
     * Performs loading of modules.
     *
     * @returns {*}
     */
    loadModules() {
        let defer        = $.Deferred(),
            modules      = _modules.get(this),
            moduleCount  = Object.keys(this.config.modules).length,
            currentCount = 0;

        for (let moduleName in this.config.modules) {
            if (!this.config.modules.hasOwnProperty(moduleName)) continue;

            let moduleClassName = `${Util.capitalize(moduleName)}Module`;

            $.ajax({
                url    : `module/${moduleName}/${moduleClassName}.js`,
                success: (source, textStatus, jqXHR) => {
                    if (jqXHR.status !== 200) {
                        defer.reject(`Error loading: ${moduleClassName}`);
                    }

                    let moduleClass = window.classes[moduleClassName];
                    if (typeof moduleClass === 'undefined') {
                        defer.reject(`Invalid module class: ${moduleClass}`);
                        return false;
                    }

                    let module = new moduleClass(this);
                    this.config['modules'][moduleName] = module.settings;

                    if (typeof module.routes == 'object') {
                        for (let i in module.routes) {
                            module.routes[i]['module'] = moduleName;
                        }
                        this.routes = $.extend(this.routes, module.routes);
                    }

                    modules[moduleName] = module;
                    _modules.set(this, modules);

                    if (currentCount == moduleCount) {
                        defer.resolve();
                    }
                },
                error  : (jqXHR, textStatus, errorThrown) => {
                    defer.reject(textStatus);
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
        this.route  = route;
        let current = _current.get(this);

        // call resign of previous controller
        let destructorDefer = $.Deferred(),
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
                        .fail((errorText) => {
                            this.notification('error', errorText);
                            return null;
                        })
                        .done((template) => {
                            let controllerClass = window.classes[route.controllerClassName];

                            if (typeof controllerClass == 'undefined') {
                                this.notification('error', `State controller missing ${route.controllerClassName}`);
                            }

                            let controller = new controllerClass(this);

                            controller.template = template;
                            controller.route    = route;

                            let preRenderDefer = new $.Deferred();
                            controller.preRender(preRenderDefer)
                                .always(() => {
                                    let view = $(this.config.viewSelector);

                                    view.html(controller.template);
                                    view.attr('class', route.cssNamespace);

                                    let postRenderDefer = new $.Deferred();
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
        let defer = $.Deferred();

        if (Util.isChrome()) {
            this.loadView(route.viewFile)
                .done((link) => {

                    if (typeof link[0].import != 'undefined') {
                        let template = Util.link2html(link);

                        if (template == false) {
                            return defer.reject(`File ${route.viewFile} is not template`).promise();
                        }

                        return defer.resolve(template);
                    }
                })
                .fail(() => {
                    defer.reject(`Error loading ${route.viewFile}`);
                });

            return defer.promise();
        }

        // Polyfile for browser that partialy support html imports
        $.get(route.viewFile, (template) => {
            let templateHtml = '';

            $($(template)).each((index, element) => {
                switch (element.tagName) {
                    case 'TEMPLATE':
                        templateHtml = element.innerHTML;
                        break;
                }
            });

            if (typeof window.classes[route.controllerClassName] != 'undefined') {
                return defer.resolve(templateHtml).promise();
            }

            $.getScript(route.controllerFile, () => {
                return defer.resolve(templateHtml);
            });
        });

        return defer.promise();
    }

    loadView(href) {
        let defer = $.Deferred(),
            link  = $(`head [href='${href}']`);

        // ToDo: Check if this if can be avoided
        if (link.length > 0) {
            defer.resolve(link);
            return defer.promise();
        }

        link      = document.createElement('link');
        link.rel  = 'import';
        link.href = href;
        link.setAttribute('async', '');
        link.onload  = (event) => {
            defer.resolve($(link));
        };
        link.onerror = (event) => {

            if (this.debug) {
                console.log(event);
            }

            this.notification('error', `Unable to load: ${href}`);
            defer.reject(event);
        };

        setTimeout(() => {
            $('head').append($(link));
        }, 0);

        return defer.promise();
    }

    /**
     * Execute a module hook. This function will run methods name hookName in all modules.
     *
     * @param {String} hookName
     */
    hook(hookName) {
        let deferredArray = [],
            modules       = _modules.get(this);

        for (let i in modules) {
            if (!modules.hasOwnProperty(i)) continue;

            let module = modules[i];
            let defer  = $.Deferred();
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
    notification(type, message, title = null) {

        if (!this.debug() && type === 'error') {
            return void(0);
        }

        if (typeof window.Notification != 'undefined' && Notification.permission !== 'denied') {

            if (Notification.permission === 'granted') {
                let notification = new Notification(message);
                return void(0);
            }

            if (Notification.permission !== 'denied') {
                Notification.requestPermission(function (permission) {

                    // Whatever the user answers, we make sure we store the information
                    if (!('permission' in Notification)) {
                        Notification.permission = permission;
                    }

                    // If the user is okay, let's create a notification
                    if (permission === 'granted') {
                        let notification = new Notification(message);
                    }
                });
                return void(0);
            }

        }

        if (typeof window.toastr == 'object' && typeof window['toastr'][type] == 'function') {
            window['toastr'][type](message, title);
            return void(0);
        }

        console.log(message);

        return void(0);
    }

    /**
     * Returns true if application is in debug mode.
     *
     * @returns {Boolean}
     */
    debug() {
        return location.pathname.indexOf('index-dev.html') > 0;
    }

    getPartial(url) {
        let defer = $.Deferred();

        $.ajax({
            url    : url,
            success: (data) => {
                defer.resolve(data);
            },
            error  : () => {
                defer.reject();
            }
        });

        return defer.promise();
    }

}