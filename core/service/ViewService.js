class ViewService {

    constructor(service, config) {
        this.view = $(config.viewSelector);
    }

    render(template) {
        this.view.html(template);
    }

    setClass(name) {
        this.view.attr('class', name);
    }

}