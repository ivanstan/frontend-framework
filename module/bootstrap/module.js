class bootstrapModule {

    constructor() {
        this.settings = {};
    }
}

window.classes['bootstrapModule'] = bootstrapModule;

window.alert = function(message) {
	var modal = jQuery('#appModal');
	modal.find('.modal-body').html(message);
	modal.modal('show');
}