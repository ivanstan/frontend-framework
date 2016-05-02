class bootstrapModule {

    constructor() {
        this.settings = {};

        jQuery.get('module/bootstrap/view/partial.html', function (data) {
            jQuery('body').after(data);
        });
    }
}

window.classes['bootstrapModule'] = bootstrapModule;

window.alert = function (message) {
    var modal = jQuery('#modal-alert');
    modal.find('.modal-body').html(message);
    modal.modal('show');
};

window.confirm = function (message, callback) {
    var modal = jQuery('#modal-confirm');
    modal.find('.modal-body').html(message);
    modal.modal('show');

    if (typeof callback !== 'function') {
        return false;
    }

    modal.find('.resolve').off();
    modal.find('.reject').off();

    modal.find('.resolve').on('click', function () {
        callback(true);
    });

    modal.find('.reject').on('click', function () {
        callback(false);
    });
};

$(document).ajaxError(function () {

});

$(document).ajaxStart(function () {

});

$(document).ajaxComplete(function () {

});