class Util {

    static capitalize(string) {
        return string[0].toUpperCase() + string.slice(1);
    }

    static loading(loading) {
        if (loading == null) {
            loading = true;
        }

        var loader = $('#ajax-loader');
        if (loader.length == 0) {
            return loading;
        }

        if (loading) {
            loader.show();
            return loading;
        }

        loader.hide();
        return loading;
    }

    /**
     * Raise notification to user.
     *
     * @param type      Possible values: 'error', 'warning', 'success', 'info'
     * @param title
     * @param message
     */
    static notification(type, title, message) {
        if (typeof window.toastr == 'object' && typeof window['toastr'][type] == 'function') {

            if (!Util.isDebug() && type === 'error') {
                return false;
            }

            window['toastr'][type](title, message);
        }
    }

    static link2html(link) {
        var template = $(link[0].import).find('template');

        if (template.length == 0) {
            return false;
        }

        return template.html();
    }

    static isDebug() {
        return location.pathname.indexOf('index-dev.html') > 0
    }

    static toggleFullScreen() {
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    static require(dependencies) {
        var defer = [];
        var _self = this;

        $(dependencies).each((index, url) => {
            defer.push($.getScript(url));
        });

        Util.loading();

        return $.when.apply($, defer)
            .fail((jqXHR, textStatus, errorThrown) => {
                var instanceProto = Object.getPrototypeOf(_self);
                console.log(instanceProto.constructor.name + ': failed loading dependencies');
                console.log(errorThrown);

                Util.notification('error', instanceProto.constructor.name, 'Failed loading dependencies');
            })
            .always(() => {
                Util.loading(false);
            });
    }

}



class Exception {

    constructor(message) {
        this._message = message;
        this._title = 'Error';

        return this;
    }

    set route(route) {
        this._route = route;
        return this;
    }

    static create(message) {
        return new this(message);
    }

    get message() {
        return this._message;
    }

    get title() {
        return this._title;
    }

    error() {

    }

}
class AjaxException extends Exception {

    constructor(message) {
        super(message);
    }

    set jqXHR(jqXHR) {
        this._jqXHR = jqXHR;
        return this;
    }

    set textStatus(textStatus) {
        this._textStatus = textStatus;
        return this;
    }

    set errorThrown(errorThrown) {
        this._errorThrown = errorThrown;
        return this;
    }

    error() {

        if(typeof this._errorThrown !== 'string') {
            this.message = this._errorThrown;
        }

        var message;
        var statusErrorMap = {
            '400': "Server understood the request, but request content was invalid.",
            '401': "Unauthorized access.",
            '403': "Forbidden resource can't be accessed.",
            '404': "Route not found.",
            '500': "Internal server error.",
            '503': "Service unavailable."
        };

        if (this._jqXHR.status) {
            message = statusErrorMap[this._jqXHR.status];
            this.title = message;
        }

        switch(this._textStatus) {
            case 'abort':

                break;
            case 'error':

                break;
            case 'notmodified':

                break;
            case 'parsererror':
                this.title = 'Parser error';
                break;
            case 'success':

                break;
            case 'timeout':

                break;
            default:

        }

        super.error();
    }

}
class Module {

    constructor() {
        this._settings = {};
    }

    get settings() {
        return (typeof this._settings !== 'undefined') ? this._settings : {};
    }

    set settings(settings) {
        this._settings = settings;
    }

}
class Controller {

    constructor() {
        this._defer = $.Deferred();
        this._template = '';
        this._route = {};
        this._settings = {};
    }

    get deferred() {
        return this._defer;
    }

    get template() {
        return this._template;
    }

    set template(template) {
        this._template = template;
    }

    get route() {
        return this._route;
    }

    set route(route) {
        this._route = route;
    }

    set settings(settings) {
        this._settings = settings;
    }

    get settings() {
        return this._settings;
    }

    /**
     * Override this method in your controller to process asynchronous requests.
     * Further controller processing shall not be executed until defer object is either
     * resolver or rejected.
     *
     * @returns Defer promise
     */
    async() {
        this._defer.resolve();
        return this._defer.promise();
    }

    /**
     * Template is loaded. Use this method to attach event handlers.
     */
    assign() {

    }

    /**
     * Called when controller another controller is called. Event handlers will be detached automatically,
     * use this method to cleanup additional elements added on page.
     */
    resign() {

    }

}
class Route {

    constructor(path, params) {
        let route = {};
        let uri = path.substring(1).split('?');
        route.pathname = uri[0].split('/');

        route.module = route.pathname[0] ? route.pathname[0] : App.settings.default.module;
        route.controller = route.pathname[1] ? route.pathname[1] : App.settings.default.controller;
        route.controllerClassName = route.pathname[1] ? Util.capitalize(route.pathname[1]) + 'Controller' : Util.capitalize(App.settings.default.controller) + 'Controller';
        route.pathname = uri[0];
        route.params = {};

        // ToDo: handle hash suffix here

        let paramsA = uri[1] ? uri[1].split('&') : [];
        for (let i in paramsA) {
            let nv = params[i].split('=');
            if (!nv[0]) continue;
            route.params[nv[0]] = nv[1] || true;
        }

        if (route.pathname.length == 0) {
            route.pathname = route.module + '/' + route.controller;
        }

        return route;
    }

}
Storage.setObject = function(key, value) {
    Storage.setItem(key, JSON.stringify(value));
};

Storage.getObject = function(key, def) {
    var value;

    try {
        value = JSON.parse(Storage.getItem(key, def));
    } catch (exception) {
        value = def;
    }

    return value;
};

Storage.setItem = function(name, value) {
    window.localStorage.setItem(name, value);
};

Storage.getItem = function(name, def) {
    var value = window.localStorage.getItem(name);
    return value == null ? def : value;
};

class Application {

    constructor(settings) {
        this.settings = settings;
        this.modules = {};
        this.current = {};

        this.loadModules()
            .done(() => {
                $(window).trigger('hashchange');
            })
            .fail((jqXHR, textStatus, errorThrown) => {

                let exception = AjaxException.create('Error loading modules')
                    .setJqXHR(jqXHR)
                    .setTextStatus(textStatus)
                    .setErrorThrown(errorThrown);

                Application.errorHandler(exception);
            });

        $(window).on('hashchange', () => {
            this.navigate(new Route(window.location.hash));
        });
    };

    loadModules() {
        var defer = $.Deferred();

        for (var i in this.settings.modules) {
            var moduleName = this.settings.modules[i];
            var moduleClassName = Util.capitalize(moduleName) + 'Module';

            $.ajax({
                url: 'module/' + moduleName + '/' + moduleClassName + '.js',
                success: (source, textStatus, jqXHR) => {
                    var moduleClass = window.classes[moduleClassName];

                    if (typeof moduleClass !== 'undefined') {
                        var module = new moduleClass();

                        this.modules[moduleName] = module;

                        this.settings['modules'][moduleName] = module.settings;
                        this.settings['modules'].splice(this.settings['modules'].indexOf(moduleName), 1);

                        if (jqXHR.status !== 200) {
                            defer.reject(jqXHR, textStatus, 'Error loading ' + moduleClassName);
                        }

                        if (i == this.settings.modules.length) {
                            defer.resolve();
                        }
                    }


                },
                error: (jqXHR, textStatus, errorThrown) => {
                    defer.reject(jqXHR, textStatus, errorThrown);
                }
            });
        }

        return defer.promise();
    }

    navigate(route) {
        this.loadController(route)
            .fail((jqXHR, textStatus, errorThrown) => {

                let exception = AjaxException.create(errorThrown)
                    .setJqXHR(jqXHR)
                    .setTextStatus(textStatus)
                    .setErrorThrown(errorThrown)
                    .setRoute(route);

                Application.errorHandler(exception);
                return null;
            })
            .done((template) => {
                let controllerClass = window.classes[route.controllerClassName];

                if (typeof controllerClass == 'undefined') {
                    Util.notification('error', 'State controller missing' + route.controllerClassName);
                }

                var controller = new controllerClass();

                controller.settings = this.settings;
                controller.template = template;
                controller.route = route;

                controller.async(controller.deferred)
                    .always(() => {
                        // call resign of previous controller
                        if (typeof this.current.controller !== 'undefined') {
                            this.current.controller.resign();
                        }

                        let view = $(this.settings.viewSelector);

                        view.html(controller.template);
                        view.attr('class', route.pathname.replace('/', '-') + '-page');

                        this.current.assign = controller.assign();
                        this.current.controller = controller;
                        this.hook('postRender');
                    });


                return route;
            });
    }

    loadController(route) {
        var defer = $.Deferred(),
            viewFile = 'module/' + route.module + '/view/' + route.controller + '.html';

        this.importHtml(viewFile)
            .done((link) => {
                var template = Util.link2html(link);

                if (template == false) {
                    Util.notification('error', 'File ' + viewFile + ' is not template');
                    defer.reject();
                }

                defer.resolve(template);
            })
            .fail(() => {
                Util.notification('error', 'Error loading ' + viewFile);
            });

        return defer.promise();
    }

    importHtml(href) {
        var defer = $.Deferred(),
            link = $('head [href="' + href + '"]');

        // ToDo: Check if this if can be avoided
        if (link.length > 0) {
            defer.resolve(link);
            return defer.promise();
        }

        var link = document.createElement('link');
        link.rel = 'import';
        link.href = href;
        link.setAttribute('async', '');
        link.onload = (event) => {
            defer.resolve($(link));
        };
        link.onerror = (event) => {
            Util.notification('error', 'Unable to load: ' + href);
            defer.reject(event);
        };

        $('head').append($(link));

        return defer.promise();
    }

    hook(hookName) {
        for (let i in this.modules) {
            let module = this.modules[i];

            if (typeof module[hookName] === 'function') {
                try {
                    module[hookName]();
                } catch (exception) {
                    Util.notification('error', exception, 'Exception');
                }
            }
        }
    }

    static errorHandler(exception) {
        exception.processError();

        Util.notification('error', exception.getTitle(), exception.getMessage());

        console.log(exception);
    }

}