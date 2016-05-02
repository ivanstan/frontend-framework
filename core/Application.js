class Application {

    constructor(settings) {
        var _self = this;
        _self.settings = settings;
        _self.cache = new Cache();
        _self.modules = [];
        _self.current = {};

        _self.loadModules().done(function () {
            jQuery(window).trigger('hashchange');
        });

        jQuery(window).on('hashchange', function () {
            _self.navigate(_self.getRoute());
        });
    };

    loadModules() {
        var _self = this,
            defer = jQuery.Deferred(),
            modulesLoaded = 0;

        jQuery.each(_self.settings.modules, function (index, moduleName) {
            jQuery.ajax({
                url: 'module/' + moduleName + '/module.js',
                success: function (source, textStatus, jqXHR) {

                    var module = window.classes[moduleName + 'Module'];
                    _self.modules.push((new module()));
                    _self.modules[_self.modules.length - 1].name = moduleName;

                    if (jqXHR.status !== 200) {
                        defer.reject();
                    }

                    modulesLoaded++;
                    if (modulesLoaded == _self.settings.modules.length) {
                        defer.resolve();
                    }
                },
                error: function (jqXHR, ajaxOptions, exception) {
                    defer.reject();
                }
            });
        });

        return defer.promise();
    }

    getRoute() {
        var route = {};
        var uri = window.location.hash.substring(1).split('?');
        route.pathname = uri[0].split('/');
        var params = uri[1] ? uri[1].split('&') : [];

        route.module = route.pathname[0] ? route.pathname[0] : this.settings.default.module;
        route.controller = route.pathname[1] ? route.pathname[1] : this.settings.default.controller;
        route.pathname = uri[0];
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

        if (typeof window.classes[route.controller + 'Controller'] === 'function' && _self.cache.exist(route.pathname)) {
            var controllerClass = window.classes[route.controller + 'Controller'];

            var template = _self.cache.get(route.pathname);
            _self.executeController(controllerClass, template, route);
        }

        _self.loadController(route)
            .fail(function (jqXHR, ajaxOptions, exception) {
                _self.navigate({
                    module: _self.settings.notfound.module,
                    controller: _self.settings.notfound.module
                });
            })
            .done(function (template, jqXHR) {
                var controllerClass = window.classes[route.controller + 'Controller'];
                _self.executeController(controllerClass, template, route);
            });
    }

    executeController(controllerClass, template, route) {
        var _self = this,
            controller = new controllerClass();

        controller.setTemplate(template);
        controller.setRoute(route);

        jQuery(_self.settings.viewSelector).html(controller.getTemplate());

        _self.current.ctrl = controller.attach();
    }

    loadController(route) {
        var _self = this,
            defer = jQuery.Deferred(),
            controllerFile = 'module/' + route.module + '/controller/' + route.controller + '.js',
            viewFile = 'module/' + route.module + '/view/' + route.controller + '.html';

        jQuery.ajax({
            url: viewFile,
            success: function (template, textStatus, jqXHR) {
                jQuery.ajax({
                    url: controllerFile,
                    success: function (source, textStatus, jqXHR) {
                        jQuery.globalEval(source);
                        defer.resolve(template, route, jqXHR);
                        _self.cache.set(route.pathname, template);
                    },
                    error: function (jqXHR, ajaxOptions, exception) {
                        defer.reject(jqXHR, settings, exception);
                    }
                });
            },
            error: function (jqXHR, ajaxOptions, exception) {
                defer.reject(jqXHR, settings, exception);
            }
        });

        return defer.promise();
    }
} 

