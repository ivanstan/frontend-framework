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
     */
    preRender(defer) {
        return defer.resolve().promise();
    }

    /**
     * Executed once state rendering is complete.
     */
    postRender(defer) {
        return defer.resolve().promise();
    }

}