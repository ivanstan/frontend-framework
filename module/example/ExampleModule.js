class ExampleModule extends Module {

    constructor(app) {
        super();
        this.app = app;

        if(app.isDebug()) {
            console.log(this.constructor.name + ' constructor called');
        }

    }

    preRender() {

        if(this.app.isDebug()) {
            console.log(this.constructor.name + ' preRender hook called');
        }

    }

    postRender() {

        if(this.app.isDebug()) {
            console.log(this.constructor.name + ' postRender hook called');
        }

    }

}

window.classes["ExampleModule"] = ExampleModule;