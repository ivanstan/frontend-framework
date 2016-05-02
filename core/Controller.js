class Controller {

    constructor() {
        this.defer = jQuery.Deferred();
        this.template = '';
        this.route = {};
    }

    /**
     * Override this method in your controller to process asynchronous requests.
     * Further controller processing shall not be executed until defer object is either
     * resolver or rejected.
     *
     * @returns Defer promise
     */
    async() {
        this.defer.resolve();
        return this.defer.promise();
    }

    getTemplate() {
        return this.template;
    }

    setTemplate(template) {
        this.template = template;
    }

    getRoute() {
        return this.route;
    }

    setRoute(route) {
        this.route = route;
    }

}