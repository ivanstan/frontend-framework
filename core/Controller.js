/**
 * @class Controller
 *
 * All controllers shall extend this Controller class.
 */
class Controller extends Abstract {

    /**
     * Class constructor.
     *
     * @param {Framework} app   Framework instance.
     */
    constructor(service) {
        super();
        this.service = service;
        this._template = '';
    }

    /**
     * Template property getter.
     *
     * @returns {String}    Html view associated with state.
     */
    get template() {
        return this._template;
    }

    /**
     * Template property setter.
     *
     * @param {String} template     Html view associated with state.
     */
    set template(template) {
        this._template = template;
    }

    /**
     * preRender
     * Executed before state rendering process starts.
     *
     * @param defer {Deferred}
     * @returns {Promise} promise
     */
    preRender(defer) {
        return defer.resolve().promise();
    }

    /**
     * postRender
     * Executed once state rendering is complete.
     *
     * @param defer {Deferred}
     * @returns {Promise}
     */
    postRender(defer) {
        return defer.resolve().promise();
    }

    /**
     * Destructor.
     * Executed when state change is requested.
     *
     * @param defer {Deferred}
     * @returns {Promise}
     */
    destructor(defer) {
        return defer.resolve().promise();
    }

}