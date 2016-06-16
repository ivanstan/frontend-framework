class Module {

    constructor() {
        this._settings = {};
    }

    get settings() {
        return (typeof this._settings !== 'undefined') ? this._settings : {};
    }

    set settings(settings) {
        this._settings = settings;
    }

}