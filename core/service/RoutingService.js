let _current = new WeakMap();
/**
 * Routing service
 */
class RoutingService {

    /**
     * @constructor
     *
     * @param service
     * @param routes
     */
    constructor(service, routes) {

        console.log(service.settings);

        this.routes = routes;
        this.service = service;
        this.viewSelector = service.settings;
        _current.set(this, {});

        if(Object.keys(this.routes).length === 0) {
            service.notification.info('Routing map empty');
        }
    }

    find(uri) {
        let route = new Route(uri),
            matched = this.routes[route.uri] ? this.routes[route.uri] : this.routes['/'];

        route.controller = matched.controller;
        route.module = matched.module;
        route.view = matched.view;

        return this.processRoute(route);
    }

    processRoute(matched) {
        matched.controllerClassName = false;

        if(typeof matched.controller != 'undefined') {
            let path = Util.pathInfo(matched.controller);

            matched.controllerClassName = path.basename;
            matched.controllerFile = matched.controller;

            var state = matched.controllerClassName.toLowerCase().replace('controller', '');
        }

        matched.cssNamespace = `${matched.module}-${state}-page`;
        matched.viewFile = matched.view;

        return matched;
    }

    /**
     * Navigate to state.
     *
     * @param {Route} route
     */
    navigate(route) {
        if(typeof route == 'string') {
            route = this.find(route);
        }

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
                    this.service.system.loadController(route)
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
                                    this.service.view.render(controller.template);
                                    this.service.view.setClass(route.cssNamespace);

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

}