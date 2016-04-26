class Application {

    constructor(settings) {
        var _self = this;
        _self.settings = settings;
        _self.cache = new Cache();
        _self.modules = [];
        _self.current = {};

        _self.loadModules().done(function () {
            _self.defaultModule = _self.getModule(_self.settings.default.module);
            jQuery(window).trigger('hashchange');
        });

        $(window).on('hashchange', function () {
            var route = _self.getRoute();
            _self.navigate(route);
        });
    };

    loadModules() {
        var defer = $.Deferred();
        var _self = this;

        var modulesLoaded = 0;
        jQuery.each(_self.settings.modules, function (index, moduleName) {
            jQuery.getScript('module/' + moduleName + '/module.js', function (data, textStatus, jqxhr) {
                _self.modules[_self.modules.length - 1].name = moduleName;

                if (jqxhr.status !== 200) {
                    defer.reject();
                }

                modulesLoaded++;
                if (modulesLoaded == _self.settings.modules.length) {
                    defer.resolve();
                }
            });
        });

        return defer.promise();
    }

    getModule(name) {
        var result = false;
        jQuery.each(this.modules, function (index, module) {
            if (module.name == name) {
                result = module;
            }
        });

        return result;
    }

    getRoute() {
        var route = {};
        var uri = window.location.hash.substring(1).split('?');
        route.pathname = uri[0].split('/');
        var params = uri[1] ? uri[1].split('&') : [];

        route.module = route.pathname[0] ? route.pathname[0] : this.settings.default.module;
        route.controller = route.pathname[1] ? route.pathname[1] : this.settings.default.controller;
        route.params = {};

        for (var i in params) {
            var nv = params[i].split('=');
            if (!nv[0]) continue;
            route.params[nv[0]] = nv[1] || true;
        }

        return route;
    }

    navigate(route) {
        var _self = this;

        if(typeof window.classes[route.controller + 'Controller'] === 'function' && _self.cache.exist(route.pathname)) {
            var controllerClass = window.classes[route.controller + 'Controller'];
            var controller = new controllerClass();
            var template = _self.cache.get(route.pathname);
            var template = controller.render(template, route);
            jQuery(_self.settings.viewSelector).html(template);

            _self.current.ctrl = controller.attach(route);
        }

        _self.loadController(route)
        .fail(function (jqXHR, ajaxOptions, exception) {
            _self.navigate({
                module: _self.settings.notfound.module,
                controller: _self.settings.notfound.module
            });
        })
        .done(function (template, route, jqXHR) {
            var controllerClass = window.classes[route.controller + 'Controller'];
            var controller = new controllerClass();
            var template = controller.render(template, route);
            jQuery(_self.settings.viewSelector).html(template);

            _self.current.ctrl = controller.attach(route);
        });
    }

    loadController(route) {
        var _self = this,
            defer = jQuery.Deferred(),
            controllerFile = 'module/' + route.module + '/controller/' + route.controller + '.js',
            viewFile = 'module/' + route.module + '/view/' + route.controller + '.html';

        $.ajax({
            url: viewFile,
            dataType: 'html',
            success: function (template, textStatus, jqXHR) {
                jQuery.getScript(controllerFile, function (source, textStatus, jqXHR) {
                    defer.resolve(template, route, jqXHR);
                    _self.cache.set(route.pathname, template);
                }).fail(function (jqXHR, settings, exception) {
                    defer.reject(jqXHR, settings, exception);
                })
            },
            error: function (jqXHR, ajaxOptions, exception) {
                defer.reject(jqXHR, settings, exception);
            }
        });

        return defer.promise();
    }
} 

