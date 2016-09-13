/**
 * @class Controller
 *
 * All modules shall extend this Module class.
 */
class Module extends Abstract {

    /**
     * Class Constructor.
     *
     * @param {Framework} app   Framework instance.
     */
    constructor(service) {
        super();
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

}