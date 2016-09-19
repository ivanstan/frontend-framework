/**
 *
 *
 */
let _current = new WeakMap();

class Framework {

    /**
     * Application bootstrap.
     *
     * @param config
     */
    constructor(config) {
        window.classes = window.classes || {};
        _current.set(this, {});

        this.viewSelector = config.viewSelector;
        this.service      = new ServiceContainer(config);

        this.service.module.load().done(() => {
            this.service.redux.init();
            $(window).trigger('hashchange');
        });
    };

    /**
     * Navigate to state.
     *
     * @param {Route} route
     */
    navigate(route) {
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
            this.service.module.hook('preRender')
                .always(() => {
                    this.loadController(route)
                        .done((template) => {
                            let controllerClass = window.classes[route.controllerClassName];

                            if (typeof controllerClass == 'undefined') {
                                this.service.notification.error(`State controller missing ${route.controllerClassName}`);
                            }

                            let controller = new controllerClass(this.service);

                            controller.template = template;
                            controller.route    = route;

                            let preRenderDefer = new $.Deferred();
                            controller.preRender(preRenderDefer)
                                .always(() => {
                                    let view   = $(this.viewSelector),
                                        filter = this.service.getService('filter');

                                    view.html(filter.escapeImports(controller.template));
                                    view.attr('class', route.cssNamespace);

                                    let postRenderDefer = new $.Deferred();
                                    controller.postRender(postRenderDefer)
                                        .always(() => {
                                            _current.set(this, controller);
                                            this.service.module.hook('postRender').always(() => {

                                            });
                                        });
                                });

                            return route;
                        })
                        .fail((errorText) => {
                            this.service.notification.error(errorText);
                            return null;
                        })
                });
        });
    }

    loadController(route) {
        let defer = $.Deferred();

        if (this.service.isChrome) {
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
                    case 'SCRIPT':
                        console.log(element);
                        break;
                    default:
                        console.log(element);
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

}