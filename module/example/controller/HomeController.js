class HomeController extends Controller {

    constructor(app) {
        super(app);
        this.app = app;

        if (app.isDebug()) {
            console.log(this.constructor.name + ' constructor called');
        }
    }

    preRender(defer) {

        if (this.app.isDebug()) {
            console.log(this.constructor.name + ' preRender called');
        }

        return super.preRender(defer);
    }

    postRender(defer) {

        if (this.app.isDebug()) {
            console.log(this.constructor.name + ' postRender called');
        }

        return super.postRender(defer);
    }

    destructor(defer) {

        if (this.app.isDebug()) {
            console.log(this.constructor.name + ' destructor called');
        }

        return super.destructor(defer);
    }
}

window.classes["HomeController"] = HomeController;