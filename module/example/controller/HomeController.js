class HomeController extends Controller {

    constructor(service) {
        super(service);

<<<<<<< HEAD
        if (app.debug()) {
=======
        if (service.debug) {
>>>>>>> integration
            console.log(this.constructor.name + ' constructor called');
        }
    }

    preRender(defer) {

<<<<<<< HEAD
        if (this.app.debug()) {
=======
        if (this.service.debug) {
>>>>>>> integration
            console.log(this.constructor.name + ' preRender called');
        }

        return super.preRender(defer);
    }

    postRender(defer) {

<<<<<<< HEAD
        if (this.app.debug()) {
=======
        if (this.service.debug) {
>>>>>>> integration
            console.log(this.constructor.name + ' postRender called');
        }

        return super.postRender(defer);
    }

    destructor(defer) {

<<<<<<< HEAD
        if (this.app.debug()) {
=======
        if (this.service.debug) {
>>>>>>> integration
            console.log(this.constructor.name + ' destructor called');
        }

        return super.destructor(defer);
    }
}

window.classes["HomeController"] = HomeController;