var mainController = {

	render: function(template, route) {
		var template = Handlebars.compile(template); 

		data = {};

		return template(data);
	},

	attach: function(route) {

	}
	
}