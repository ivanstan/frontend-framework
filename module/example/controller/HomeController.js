class HomeController extends Controller {

    constructor(service) {
        super(service);

        if (service.debug) {
            console.log(this.constructor.name + ' constructor called');
        }
    }

    preRender(defer) {

        if (this.service.debug) {
            console.log(this.constructor.name + ' preRender called');
        }

        return super.preRender(defer);
    }

    postRender(defer) {

        if (this.service.debug) {
            console.log(this.constructor.name + ' postRender called');
        }

        return super.postRender(defer);
    }

    destructor(defer) {

        if (this.service.debug) {
            console.log(this.constructor.name + ' destructor called');
        }

        return super.destructor(defer);
    }
}

window.classes["HomeController"] = HomeController;