class RoutingService {

    constructor(service, routes) {
        this.routes = routes;

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

    navigate(route) {
        if(typeof route == 'string') {
            route = this.find(route);
        }

        App.navigate(route);
    }

}