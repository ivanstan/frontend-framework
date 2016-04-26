class mainController {

    render(template, route) {
        var template = Handlebars.compile(template);

        var data = {};

        return template(data);
    }

    attach(route) {

    }

}

window.classes['mainController'] = mainController;