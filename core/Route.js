class Route {

    /**
     * Constructor. Parses the route string to object.
     *
     * @param {String} path Path string to parse.
     * @param {Object} params Object of parameters to pass to target state.
     * @returns {Object} Route object
     */
    constructor(path, params) {
        let route = {};
        let uri = path.substring(1).split('?');
        route.pathname = uri[0].split('/');

        route.module = route.pathname[0] ? route.pathname[0] : App.config.default.module;
        route.controller = route.pathname[1] ? route.pathname[1] : App.config.default.controller;
        route.controllerClassName = route.pathname[1] ? Util.capitalize(route.pathname[1]) + 'Controller' : Util.capitalize(App.config.default.controller) + 'Controller';
        route.pathname = uri[0];
        route.params = {};

        // ToDo: handle hash suffix here

        let paramsA = uri[1] ? uri[1].split('&') : [];
        for (let i in paramsA) {
            let nv = params[i].split('=');
            if (!nv[0]) continue;
            route.params[nv[0]] = nv[1] || true;
        }

        if (route.pathname.length == 0) {
            route.pathname = route.module + '/' + route.controller;
        }

        return route;
    }

}