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

    /**
     * Template is loaded. Use this method to attach event handlers.
     */
    assign() {

    }

    /**
     * Called when controller another controller is called. Event handlers will be detached automatically,
     * use this method to cleanup additional elements added on page.
     */
    resign() {

    }

}