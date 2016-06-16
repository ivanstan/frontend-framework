class DefaultModule extends Module {

    constructor() {
        super();

        toastr.options = {
            closeButton: false,
            debug: false,
            newestOnTop: false,
            progressBar: false,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
            onclick: null,
            showDuration: 300,
            hideDuration: 1000,
            timeOut: 5000,
            extendedTimeOut: 1000,
            showEasing: 'swing',
            hideEasing: 'linear',
            showMethod: 'fadeIn',
            hideMethod: 'fadeOut'
        };

        $('#menu-full-screen').on('click', () => {
            Util.toggleFullScreen();
            $(this).find('i').toggleClass('text-muted');
        });

    }

}

window.classes['DefaultModule'] = DefaultModule;