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
                $(window).trigger('hashchange');
            })
            .fail((message) => {
                this.notification('error', message);
            });

        $(window).on('hashchange', () => {
            this.navigate(new Route(window.location.hash, {}, this.routes));
        });
    };

    /**
     * Performs loading of modules.
     *
     * @returns {*}
     */
    loadModules() {
        var defer   = $.Deferred();
        var modules = _modules.get(this);

        var moduleCount  = Object.keys(this.config.modules).length;
        var currentCount = 0;

        for (var moduleName in this.config.modules) {
            if (!this.config.modules.hasOwnProperty(moduleName)) continue;

            var moduleClassName = `${Util.capitalize(moduleName)}Module`;

            $.ajax({
                url    : `module/${moduleName}/${moduleClassName}.js`,
                success: (source, textStatus, jqXHR) => {
                    if (jqXHR.status !== 200) {
                        defer.reject(`Error loading: ${moduleClassName}`);
                    }

                    var moduleClass = window.classes[moduleClassName];
                    if (typeof moduleClass === 'undefined') {
                        defer.reject(`Invalid module class: ${moduleClass}`);
                        return false;
                    }

                    var module                         = new moduleClass(this);
                    this.config['modules'][moduleName] = module.settings;

                    if (typeof module.routes == 'object') {
                        for (var i in module.routes) {
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
                        .fail((errorText) => {
                            this.notification('error', errorText);
                            return null;
                        })
                        .done((template) => {
                            let controllerClass = window.classes[route.controllerClassName];

                            if (typeof controllerClass == 'undefined') {
                                this.notification('error', `State controller missing ${route.controllerClassName}`);
                            }

                            var controller = new controllerClass(this);

                            controller.template = template;
                            controller.route    = route;

                            var preRenderDefer = new $.Deferred();
                            controller.preRender(preRenderDefer)
                                .always(() => {
                                    let view = $(this.config.viewSelector);

                                    view.html(controller.template);
                                    view.attr('class', route.cssNamespace);

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
        var defer = $.Deferred();

        if (Util.isChrome()) {
            this.loadView(route.viewFile)
                .done((link) => {

                    if (typeof link[0].import != 'undefined') {
                        var template = Util.link2html(link);

                        if (template == false) {
                            return defer.reject(`File ${route.viewFile} is not template`).promise();
                        }

                        return defer.resolve(template).promise();
                    }
                })
                .fail(() => {
                    defer.reject(`Error loading ${route.viewFile}`);
                });
        }

        // Polyfile for browser that partialy support html imports
        $.get(route.viewFile, (template) => {
            var templateHtml = '';

            $($(template)).each((index, element) => {
                switch(element.tagName) {
                    case 'TEMPLATE':
                        templateHtml = element.innerHTML;
                        break;
                }
            });

            if(typeof window.classes[route.controllerClassName] != 'undefined') {
                return defer.resolve(templateHtml).promise();
            }

            $.getScript(route.controllerFile, () => {
                return defer.resolve(templateHtml);
            });
        });

        return defer.promise();
    }

    loadView(href) {
        var defer = $.Deferred(),
            link  = $(`head [href="${href}"]`);

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
            modules       = _modules.get(this);

        for (let i in modules) {
            if (!modules.hasOwnProperty(i)) continue;

            let module = modules[i];
            var defer  = $.Deferred();
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

        // add this https://stackoverflow.com/questions/2271156/chrome-desktop-notification-example

        if (typeof window.toastr == 'object' && typeof window['toastr'][type] == 'function') {

            if (!this.isDebug() && type === 'error') {
                return false;
            }

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
    isDebug() {
        return location.pathname.indexOf('index-dev.html') > 0;
    }

    getPartial(url) {
        var defer = $.Deferred();

        $.ajax({
            url    : url,
            success: function (data) {
                defer.resolve(data);
            },
            error  : function () {
                defer.reject();
            }
        });

        return defer.promise();
    }

}