/**
 *
 */
class Module {

    /**
     *
     * @param {Framework} app Framework object
     */
    constructor(app) {

    }

    /**
     * Executed before state rendering process starts.
     *
     * @param defer
     * @returns Promise
     */
    preRender(defer) {
        return defer.resolve().promise();
    }

    /**
     * Executed once state rendering is complete.
     *
     * @param defer
     * @returns {*}
     */
    postRender(defer) {
        return defer.resolve().promise();
    }

}