class defaultController extends Controller {

    constructor() {
        super();
    }

    getTemplate() {
        return super.getTemplate();
    }

    process() {
        var ctrl = {};

        ctrl.alert = jQuery('#alert-button').click(function () {
            alert('Test');
        });

        ctrl.sidebar = jQuery('#menu-toggle').click(function () {
            $('#wrapper').toggleClass('toggled');
        });

        ctrl.confirm = jQuery('#confirm-dialog').click(function () {
            confirm('Press a button!', function (confirmed) {
                console.log(confirmed);
            });
        });

        return ctrl;
    }

}

window.classes['defaultController'] = defaultController;