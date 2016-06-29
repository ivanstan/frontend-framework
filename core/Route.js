class Route {

    /**
     * Constructor. Parses the route string to object.
     *
     * @param uri
     * @param params
     * @param map
     * @returns {Route}
     */
    constructor(uri, params, map) {
        this.map = map;
        this.params = params ? params : {};
        this.uri = uri.indexOf('#') === 0 ? uri.substring(1) : uri;
        this.cssNamespace = this.uri.replace('/', '-') + '-page';

        if(uri.lastIndexOf('#') > 0) {
            this.hash = this.uri.substring(this.uri.lastIndexOf('#') + 1, this.uri.length);
            this.uri = this.uri.substring(0, this.uri.lastIndexOf('#'));
        }

        if(this.uri.indexOf('?') > -1) {
            let tmpParams = this.uri.substr(uri.indexOf('?'), this.uri.length);
            this.uri = this.uri.substr(0, this.uri.indexOf('?'));

            tmpParams = tmpParams.split('&');
            for (let i in tmpParams) {
                let nv = tmpParams[i].split('=');
                if (!nv[0]) continue;
                this.params[nv[0]] = nv[1] || true;
            }
        }

        if(Object.keys(this.map).length === 0) {
            console.log('Routing map empty');
        }

        let matched = this.map[this.uri] ? this.map[this.uri] : this.map['/'];

        this.module = matched.module;
        this.controller = matched.controller;
        this.controllerClassName = Util.capitalize(matched.controller) + 'Controller';

        return this;
    }
}