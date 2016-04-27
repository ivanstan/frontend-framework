class defaultController {

	render(template, route) {

		return template;
	}

	attach(route) {
		var ctrl = {};

		ctrl.alert = jQuery('#alert-button').click(function(message){
			alert('Test');
		});

		return ctrl;

	}
	
}

window.classes['defaultController'] = defaultController;