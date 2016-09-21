class HomeController extends Controller {

    constructor(service) {
        super(service);

        this.exampleProperty1 = 1;

        this.exampleProperty2 = {
            enum1: 1,
            enum2: 2
        };

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

        //if (this.service.debug) {
        //    console.log(this.constructor.name + ' postRender called');
        //}

        $('[data-field="exampleProperty1"]').on('change', (event) => {
            let $this = $(event.currentTarget);

            console.log(this.exampleProperty1);

        });

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