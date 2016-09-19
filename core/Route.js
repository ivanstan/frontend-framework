class Route {

    /**
     * Constructor. Parses the route string to object.
     *
     * @param this.uri
     * @param params
     * @param map
     * @returns {Route}
     */
    constructor(uri) {
        this.uri = uri.indexOf('#') === 0 ? uri.substring(1) : uri;
        this.params = [];

        if(this.uri.lastIndexOf('#') > 0) {
            this.hash = this.uri.substring(this.uri.lastIndexOf('#') + 1, this.uri.length);
            this.uri = this.uri.substring(0, this.uri.lastIndexOf('#'));
        }

        if(this.uri.indexOf('?') > -1) {
            let tmpParams = this.uri.substr(this.uri.indexOf('?'), this.uri.length);
            this.uri = this.uri.substr(0, this.uri.indexOf('?'));

            tmpParams = tmpParams.split('&');
            for (let i in tmpParams) {
                let nv = tmpParams[i].split('=');
                if (!nv[0]) continue;
                this.params[nv[0]] = nv[1] || true;
            }
        }
    }

}