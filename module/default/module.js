var module = {
	settings: {}
};

module.init = function() {
	console.log('Default module loaded.');
};

App.modules.push(module);