class ExampleModule extends Module {

    constructor(service) {
        super(service);
        this.routes = {
            '/': {
                "controller": "module/example/controller/HomeController.js",
                "view"    : "module/example/view/home-view.html"
            },
            'example/tutorial': {
                "controller": "module/example/controller/TutorialController.js",
                "view"    : "module/example/view/tutorial-view.html"
            },
            'example/docs': {
                "controller": "module/example/controller/DocsController.js",
                "view"    : "module/example/view/docs-view.html"
            },
            'example/docs/services': {
                "controller": "module/example/controller/DocsServicesController.js",
                "view"    : "module/example/view/docs-services-view.html"
            }
        };

        if (this.service.debug) {
            console.log(this.constructor.name + ' constructor called');
        }

    }

    preRender(defer) {

        if (this.service.debug) {
            console.log(this.constructor.name + ' preRender hook called');
        }

        return super.preRender(defer);
    }

    postRender(defer) {

        $('.docrx').docrx();

        if (this.service.debug) {
            console.log(this.constructor.name + ' postRender hook called');
        }

        return super.postRender(defer);
    }

}

window.classes["ExampleModule"] = ExampleModule;