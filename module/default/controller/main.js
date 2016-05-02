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

    process() {

    }

}

window.classes['mainController'] = mainController;