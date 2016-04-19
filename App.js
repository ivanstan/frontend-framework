App = {
	modules: []
};

App.init = function(config) {

	App.loadModules(config).done(function(){
		App.executeHook('init');

		App.navigate('default', 'default');
	});

};

App.loadModules = function(config) {
	var defer = $.Deferred();

	var modulesLoaded = 0;
    jQuery.each(config.modules, function(index, moduleName){
		jQuery.getScript('module/' + moduleName + '/module.js', function(){
			App.modules[App.modules.length - 1].name = moduleName;

			modulesLoaded++;
			if(modulesLoaded == config.modules.length) {
				defer.resolve();
			}
		});
	});

	return defer.promise();
}

App.executeHook = function(name) {
	jQuery.each(App.modules, function(index, module){
		module[name]();
	});
};

App.getModule = function(name) {
	var rval = false;
	jQuery.each(App.modules, function(index, module){
		if(module.name == name) {
			rval = module;
		}
	});

	return rval;
}

App.navigate = function(moduleName, controllerName) {
	var module = App.getModule(moduleName);

	jQuery.getScript('module/' + moduleName + '/controller/' + controllerName + '.js', function(){
		
		eval('var html = ' + controllerName + 'Controller();');

		console.log(html);

	});
}
















