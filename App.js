App = {
	modules: [],
	currentView: {}
};

App.init = function(settings) {
	App.settings = settings;
	
	App.loadModules().done(function(){
		App.defaultModule = App.getModule(App.settings.defaultModule);
		App.executeBehavior('init');
		App.navigate(App.getRoute()).fail(function(jqXHR) {
			App.defaultModule.routingErrorHandler(App.getRoute(), jqXHR);
		});
	});

	$(window).on('hashchange', function() {
		App.navigate(App.getRoute()).fail(function(jqXHR) {
			App.defaultModule.routingErrorHandler(App.getRoute(), jqXHR);
		});
	});
};

App.loadModules = function() {
	var defer = $.Deferred();

	var modulesLoaded = 0;
    jQuery.each(App.settings.modules, function(index, moduleName){
		jQuery.getScript('module/' + moduleName + '/module.js', function(data, textStatus, jqxhr){
			App.modules[App.modules.length - 1].name = moduleName;

			if(jqxhr.status !== 200) {
				defer.reject();
			}

			modulesLoaded++;
			if(modulesLoaded == App.settings.modules.length) {
				defer.resolve();
			}
		});
	});

	return defer.promise();
}

App.executeBehavior = function(name) {
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

App.getRoute = function() {
	var route = {};

	var uri = window.location.hash.substring(1).split('?');
	var pathname = uri[0].split('/');
	var params = uri[1] ? uri[1].split('&') : [];

	route.module = pathname[0] ? pathname[0] : App.settings.defaultModule;
	route.controller = pathname[1] ? pathname[1] : App.settings.defaultController;
	route.params = {};

    for(var i in params) {
        var nv = params[i].split('=');
        if (!nv[0]) continue;
        route.params[nv[0]] = nv[1] || true;
    }

	return route;
}

App.navigate = function(route) {
	var defer = $.Deferred();

	var module = App.getModule(route.module);
	var controllerFile = 'module/' + route.module + '/controller/' + route.controller + '.js';
	var viewFile = 'module/' + route.module + '/view/' + route.controller + '.html';

	jQuery.ajax({
		url: controllerFile,
		dataType: 'script',
		cache: true,
		success: function(template, textStatus, jqXHR) {
			$.ajax({
				url: viewFile,
				dataType: 'html',
				success: function(template, textStatus, jqXHR) {
					var controller = window[route.controller + 'Controller'];

					App.currentView.html = controller.render(template, route);
					App.currentView.ctrl = controller.attach(route);

					jQuery(App.settings.viewSelector).html(App.currentView.html);

					defer.resolve(jqXHR);
				},
				error: function(jqXHR, ajaxOptions, thrownError) {
					defer.reject(jqXHR);
				}
			});
		}, 				
		error: function(jqXHR, ajaxOptions, thrownError) {
			defer.reject(jqXHR);
		}
	});

	return defer.promise();
}