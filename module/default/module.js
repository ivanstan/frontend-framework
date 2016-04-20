var module = {
	settings: {}
};

module.init = function() {
	console.log('Default module loaded.');
};

module.routingErrorHandler = function(route, jqXHR) {

}

App.modules.push(module);