class defaultModule {

    constructor() {
        this.settings = {};
    }

}

window.classes['defaultModule'] = defaultModule;
App.modules.push((new defaultModule()));