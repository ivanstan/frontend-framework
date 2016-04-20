App = {
	modules: [],
	current: {}
};

App.init = function(settings) {
	App.settings = settings;
	App.cache = localCache;
	
	App.loadModules().done(function(){
		App.defaultModule = App.getModule(App.settings.default.module);
		jQuery(window).trigger('hashchange');
	});

	$(window).on('hashchange', function() {
		var route = App.getRoute();

		App.navigate(route)
		.fail(function(jqXHR) {
			App.defaultModule.routingErrorHandler(route, jqXHR);
		})
		.done(function(controller, template, jqXHR){
			App.current.html = controller.render(template, route);
			App.current.ctrl = controller.attach(route);

			jQuery(App.settings.viewSelector).html(App.current.html);
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

	route.module = pathname[0] ? pathname[0] : App.settings.default.module;
	route.controller = pathname[1] ? pathname[1] : App.settings.default.controller;
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
	var controllerFile = 'module/' + route.module + '/controller/' + route.controller + '.js';
	var viewFile = 'module/' + route.module + '/view/' + route.controller + '.html';

	jQuery.getScript(controllerFile, function(source, textStatus, jqXHR) {
		$.ajax({
			url: viewFile,
			dataType: 'html',

			beforeSend: function () {
                if (App.cache.exist(viewFile)) {
					defer.resolve(App.current.controller, App.cache.get(viewFile), jqXHR);
                    return false;
                }
                return true;
        	},
			success: function(template, textStatus, jqXHR) {
				defer.resolve(App.current.controller, template, jqXHR);
				App.cache.set(viewFile, template);
			},
			error: function(jqXHR, ajaxOptions, thrownError) {
				defer.reject(jqXHR);
			}
		});
	}).fail(function(jqXHR, settings, exception){
		console.log(exception);
	});

	return defer.promise();
}