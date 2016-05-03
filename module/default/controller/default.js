class defaultController extends Controller {

    constructor() {
        super();
    }

    getTemplate() {
        return super.getTemplate();
    }

    assign() {
        var ctrl = {};

        var menuToggleButton =
            '<button class="navbar-toggler" id="menu-toggle">' +
                '<i class="fa fa-arrow-left" aria-hidden="true"></i>' +
            '</button>';

        jQuery(menuToggleButton).prependTo('header .navbar');

        ctrl.alert = jQuery('#alert-button').click(function () {
            alert('Test');
        });

        ctrl.sidebar = jQuery('#menu-toggle').click(function () {
            jQuery('#wrapper').toggleClass('toggled');
            jQuery(this).find('i').toggleClass("fa-arrow-left fa-arrow-right");
        });

        ctrl.confirm = jQuery('#confirm-dialog').click(function () {
            confirm('Press a button!', function (confirmed) {
                console.log(confirmed);
            });
        });

        return ctrl;
    }

    resign() {
        jQuery('#menu-toggle').remove();
    }

}

window.classes['defaultController'] = defaultController;