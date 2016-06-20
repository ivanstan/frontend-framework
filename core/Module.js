/**
 *
 */
class Module {

    /**
     *
     * @param {Framework} app Framework object
     */
    constructor(app) {
        this._settings = {};
    }

    get settings() {
        return (typeof this._settings !== 'undefined') ? this._settings : {};
    }

    set settings(settings) {
        this._settings = settings;
    }

    /**
     * Hook called once state rendering is complete.
     */
    postRender() {

    }

}