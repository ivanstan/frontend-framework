class defaultController extends Controller {

    constructor() {
        super();
    }

    getTemplate() {
        return super.getTemplate();
    }

    attach() {
        var ctrl = {};

        ctrl.alert = jQuery('#alert-button').click(function (message) {
            alert('Test');
        });

        ctrl.sidebar = $("#menu-toggle").click(function (e) {
            $("#wrapper").toggleClass("toggled");
        });

        return ctrl;
    }

}

window.classes['defaultController'] = defaultController;