/**
 *
 */
class Controller {

    /**
     *
     * @param app
     */
    constructor(app) {
        this._template = '';
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
     *
     * @param defer
     * @returns {Promise}
     */
    postRender(defer) {
        return defer.resolve().promise();
    }

    /**
     *
     * Called when controller another controller is called. Event handlers will be detached automatically,
     * use this method to cleanup additional elements added on page.
     *
     * @param defer
     * @returns {Promise}
     */
    destructor(defer) {
        return defer.resolve().promise();
    }

}