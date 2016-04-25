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

            _self.navigate(route)
                .fail(function (jqXHR) {
                    _self.defaultModule.routingErrorHandler(route, jqXHR);
                })
                .done(function (controller, template, jqXHR) {
                    _self.current.html = controller.render(template, route);
                    jQuery(_self.settings.viewSelector).html(_self.current.html);

                    _self.current.ctrl = controller.attach(route);
                });
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
        var defer = $.Deferred();
        var controllerFile = 'module/' + route.module + '/controller/' + route.controller + '.js';
        var viewFile = 'module/' + route.module + '/view/' + route.controller + '.html';

        $.ajax({
            url: viewFile,
            dataType: 'html',
            beforeSend: function () {
                if (_self.cache.exist(route.pathname)) {
                    var cache = _self.cache.get(route.pathname);

                    jQuery.globalEval(cache.controller);
                    defer.resolve(App.current.controller, cache.template);
                    return false;
                }
                return true;
            },
            success: function (template, textStatus, jqXHR) {
                jQuery.getScript(controllerFile, function (source, textStatus, jqXHR) {
                    defer.resolve(_self.current.controller, template, jqXHR);

                    _self.cache.set(route.pathname, {
                        template: template,
                        controller: source
                    });
                }).fail(function (jqXHR, settings, exception) {
                    defer.reject(jqXHR);
                })
            },
            error: function (jqXHR, ajaxOptions, thrownError) {
                defer.reject(jqXHR);
            }
        });

        return defer.promise();
    }
} 

