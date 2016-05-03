class mainController extends Controller {

    constructor() {
        super();
    }

    getTemplate() {
        var template = super.getTemplate();
        template = Handlebars.compile(template);

        var data = {};

        return template(data);
    }

    assign() {

    }

}

window.classes['mainController'] = mainController;