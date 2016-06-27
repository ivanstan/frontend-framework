class ExampleModule extends Module {

    constructor(app) {
        super();
        this.app = app;
        this.routes = {
            '/': {
                controller: 'DocsController'
            },
            'docs': {
                controller: 'DocsController'
            }
        };

        if (app.isDebug()) {
            console.log(this.constructor.name + ' constructor called');
        }

    }

    preRender(defer) {

        if (this.app.isDebug()) {
            console.log(this.constructor.name + ' preRender hook called');
        }

        return super.preRender(defer);
    }

    postRender() {

        if (this.app.isDebug()) {
            console.log(this.constructor.name + ' postRender hook called');
        }

        return super.postRender(defer);
    }

}

window.classes["ExampleModule"] = ExampleModule;