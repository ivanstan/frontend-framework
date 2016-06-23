/**
 *
 */
class Controller {

    /**
     *
     * @param app
     */
    constructor(app) {
        this._defer = $.Deferred();
        this._template = '';
        this._route = {};
    }

    /**
     * Defer object getter. Getter of deferred object of async method.
     *
     * @returns {Defer}
     */
    get deferred() {
        return this._defer;
    }

    /**
     * Template getter.
     *
     * @returns {String}
     */
    get template() {
        return this._template;
    }

    /**
     *
     * @param {String} template
     */
    set template(template) {
        this._template = template;
    }

    /**
     *
     * @returns {Route}
     */
    get route() {
        return this._route;
    }

    /**
     *
     * @param {Route} route
     */
    set route(route) {
        this._route = route;
    }

    /**
     * Override this method in your controller to process asynchronous requests.
     * Further controller processing shall not be executed until defer object is either
     * resolver or rejected.
     *
     * @returns {Promise} promise
     */
    preRender(defer) {
        return defer.resolve().promise();
    }

    /**
     * Template is loaded. Use this method to attach event handlers.
     */
    postRender(defer) {
        return defer.resolve().promise();
    }

    /**
     * Called when controller another controller is called. Event handlers will be detached automatically,
     * use this method to cleanup additional elements added on page.
     */
    destructor(defer) {
        return defer.resolve().promise();
    }

}