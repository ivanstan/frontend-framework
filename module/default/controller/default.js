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
                '<i class="fa fa-bars" aria-hidden="true"></i>' +
            '</button>';

        jQuery(menuToggleButton).prependTo('header .navbar');

        ctrl.alert = jQuery('#alert-button').click(function () {
            alert('Test');
        });

        ctrl.sidebar = jQuery('#menu-toggle').click(function () {
            jQuery('#wrapper').toggleClass('toggled');
        });

        ctrl.confirm = jQuery('#confirm-dialog').click(function () {
            confirm('Press a button!', function (confirmed) {
                console.log(confirmed);
            });
        });

        ctrl.toastr = jQuery('#toastr-test').click(function(){
            toastr.info('Are you the 6 fingered man?')

            // Display a warning toast, with no title
            toastr.warning('My name is Inigo Montoya. You killed my father, prepare to die!')

            // Display a success toast, with a title
            toastr.success('Have fun storming the castle!', 'Miracle Max Says')

            // Display an error toast, with a title
            toastr.error('I do not think that word means what you think it means.', 'Inconceivable!')
        });

        return ctrl;
    }

    resign() {
        jQuery('#menu-toggle').remove();
    }

}

window.classes['defaultController'] = defaultController;