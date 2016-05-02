class Controller {

    constructor() {
        this.defer = jQuery.Deferred();
        this.template = '';
        this.route = {};
    }

    getTemplate() {
        return this.template;
    }

    setTemplate(template) {
        this.template = template;
    }

    getRoute() {
        return this.route;
    }

    setRoute(route) {
        this.route = route;
    }

}