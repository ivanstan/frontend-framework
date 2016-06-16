class Controller {

    constructor() {
        this._defer = $.Deferred();
        this._template = '';
        this._route = {};
        this._settings = {};
    }

    get deferred() {
        return this._defer;
    }

    get template() {
        return this._template;
    }

    set template(template) {
        this._template = template;
    }

    get route() {
        return this._route;
    }

    set route(route) {
        this._route = route;
    }

    set settings(settings) {
        this._settings = settings;
    }

    get settings() {
        return this._settings;
    }

    /**
     * Override this method in your controller to process asynchronous requests.
     * Further controller processing shall not be executed until defer object is either
     * resolver or rejected.
     *
     * @returns Defer promise
     */
    async() {
        this._defer.resolve();
        return this._defer.promise();
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