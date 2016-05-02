class mainController extends Controller {

    constructor() {
        super();
    }

    getTemplate() {
        var template = super.getTemplate();
        var template = Handlebars.compile(template);

        var data = {};

        return template(data);
    }

    attach() {

    }

}

window.classes['mainController'] = mainController;