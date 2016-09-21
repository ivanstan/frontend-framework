/**
 * @class Controller
 *
 * All modules shall extend this Module class.
 */
class Module {

    /**
     * Class Constructor.
     *
     * @param {Framework} service   Framework instance.
     */
    constructor(service) {
        this.service = service;
    }

    /**
     * preRender.
     * Executed before state rendering process starts.
     *
     * @param defer {Deferred}
     * @returns {Promise}
     */
    preRender(defer) {
        return defer.resolve().promise();
    }

    /**
     * postRender.
     * Executed once state rendering is complete.
     *
     * @param defer {Deferred}
     * @returns {Promise}
     */
    postRender(defer) {
        return defer.resolve().promise();
    }

    /**
     *
     * @param state
     * @param action
     * @returns {*}
     */
    changeState(state, action) {
        return state;
    }

}