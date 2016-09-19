class Abstract {

    constructor() {

        if (new.target === Abstract) {
            throw new TypeError("Cannot construct Abstract instances directly.");
        }

    }

}
class ServiceContainer {

    constructor(config, app) {
        this.settings = config.settings;
        this.module = new ModuleService(this, config.modules);
        this.notification = new NotificationService(this);
        this.routing = new RoutingService(this, config.routes, app);
        this.storage = new StorageService(this);
        this.redux = new ReduxService(this);
        this.filter = new FilterService(this);
    }

    getService(service) {
        return (typeof this[service] == 'undefined') ? false : this[service];
    }

    setService(name, service) {
        this[name] = service;
    }

    /**
     * Returns true if application is in debug mode.
     *
     * @returns {Boolean}
     */
    get debug() {
        return location.pathname.indexOf('index-dev.html') > 0;
    }

    get isChrome() {
        return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    }

    getPartial(url) {
        let defer = $.Deferred();

        $.ajax({
            url    : url,
            success: (data) => {
                defer.resolve(data);
            },
            error  : () => {
                defer.reject();
            }
        });

        return defer.promise();
    }

}
class Util {

    /**
     * Uppercase first letter of string.
     *
     * @param string
     * @returns {string}
     */
    static capitalize(string) {
        return string[0].toUpperCase() + string.slice(1);
    }

    /**
     * Returns html template from html import tag.
     *
     * @param link
     * @returns {*}
     */
    static link2html(link) {
        var template = $(link[0].import).find('template');

        if (template.length == 0) {
            return false;
        }

        return template.html();
    }

    static pathInfo(path) {
        let filename = path.replace(/^.*[\\\/]/, ''),
            extension = filename.split('.').pop();

        return {
            path: path,
            filename: filename,
            extension: extension,
            basename: filename.replace('.' + extension, ''),
            dirname: path.replace(filename, '')
        }
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

    set message(message) {
        this._message = message;
    }

    set title(title) {
        this._title = title;
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
            this._message = this._errorThrown;
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
            this._message = message;
        }

        switch(this._textStatus) {
            case 'abort':

                break;
            case 'error':

                break;
            case 'notmodified':

                break;
            case 'parsererror':
                this._title = 'Parser error';
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
/**
 * @class Controller
 *
 * All modules shall extend this Module class.
 */
class Module extends Abstract {

    /**
     * Class Constructor.
     *
     * @param {Framework} app   Framework instance.
     */
    constructor(service) {
        super();
        this.service = service;
    }

    /**
     * preRender.
     * Executed before state rendering process starts.
     *
     * @param defer {Deferred}
     * @returns {Promise}
     */
    preRender(defer) {
        return defer.resolve().promise();
    }

    /**
     * postRender.
     * Executed once state rendering is complete.
     *
     * @param defer {Deferred}
     * @returns {Promise}
     */
    postRender(defer) {
        return defer.resolve().promise();
    }

}
/**
 * @class Controller
 *
 * All controllers shall extend this Controller class.
 */
class Controller extends Abstract {

    /**
     * Class constructor.
     *
     * @param {Framework} app   Framework instance.
     */
    constructor(service) {
        super();
        this.service = service;
        this._template = '';
    }

    /**
     * Template property getter.
     *
     * @returns {String}    Html view associated with state.
     */
    get template() {
        return this._template;
    }

    /**
     * Template property setter.
     *
     * @param {String} template     Html view associated with state.
     */
    set template(template) {
        this._template = template;
    }

    /**
     * preRender
     * Executed before state rendering process starts.
     *
     * @param defer {Deferred}
     * @returns {Promise} promise
     */
    preRender(defer) {
        return defer.resolve().promise();
    }

    /**
     * postRender
     * Executed once state rendering is complete.
     *
     * @param defer {Deferred}
     * @returns {Promise}
     */
    postRender(defer) {
        return defer.resolve().promise();
    }

    /**
     * Destructor.
     * Executed when state change is requested.
     *
     * @param defer {Deferred}
     * @returns {Promise}
     */
    destructor(defer) {
        return defer.resolve().promise();
    }

}
class Route {

    /**
     * Constructor. Parses the route string to object.
     *
     * @param this.uri
     * @param params
     * @param map
     * @returns {Route}
     */
    constructor(uri) {
        this.uri = uri.indexOf('#') === 0 ? uri.substring(1) : uri;
        this.params = [];

        if(this.uri.lastIndexOf('#') > 0) {
            this.hash = this.uri.substring(this.uri.lastIndexOf('#') + 1, this.uri.length);
            this.uri = this.uri.substring(0, this.uri.lastIndexOf('#'));
        }

        if(this.uri.indexOf('?') > -1) {
            let tmpParams = this.uri.substr(this.uri.indexOf('?'), this.uri.length);
            this.uri = this.uri.substr(0, this.uri.indexOf('?'));

            tmpParams = tmpParams.split('&');
            for (let i in tmpParams) {
                let nv = tmpParams[i].split('=');
                if (!nv[0]) continue;
                this.params[nv[0]] = nv[1] || true;
            }
        }
    }

}
class NotificationService {

    /**
     * Raise notification to user.
     *
     * @param {String} type      Possible values: 'error', 'warning', 'success', 'info'
     * @param {String} title
     * @param {String} message
     */
    notify(type, message, title = null) {

        if (!this.debug && type === 'error') {
            return void(0);
        }

        if (typeof window.Notification != 'undefined' && Notification.permission !== 'denied') {

            if (Notification.permission === 'granted') {
                let notification = new Notification(message);
                return void(0);
            }

            if (Notification.permission !== 'denied') {
                Notification.requestPermission(function (permission) {

                    // Whatever the user answers, we make sure we store the information
                    if (!('permission' in Notification)) {
                        Notification.permission = permission;
                    }

                    // If the user is okay, let's create a notification
                    if (permission === 'granted') {
                        let notification = new Notification(message);
                    }
                });
                return void(0);
            }

        }

        if (typeof window.toastr == 'object' && typeof window['toastr'][type] == 'function') {
            window['toastr'][type](message, title);
            return void(0);
        }

        console.log(message);

        return void(0);
    }

    info(message, title = null) {
        this.notify('info', message, title);
    }

    success(message, title = null) {
        this.notify('success', message, title);
    }

    warning(message, title = null) {
        this.notify('warning', message, title);
    }

    error(message, title = null) {
        this.notify('error', message, title);
    }

}
/**
 * Sets the String type item to local storage.
 *
 * @param {String} name Save under this name.
 * @param {String} value Value to be saved.
 */
class StorageService {

    setItem(name, value) {
        window.localStorage.setItem(name, value);
    };

    /**
     * Get String type item from local storage.
     *
     * @param {String} name Name of item to fetch.
     * @param {String} def Default value to use if the item doesn't exist.
     * @returns {String}
     */
    getItem(name, def) {
        var value = window.localStorage.getItem(name);
        return value == null ? def : value;
    };

    /**
     * Set object data type in local storage
     *
     * @param {String} name Save under this name.
     * @param {Object} value Object to be saved.
     */
    setObject(name, value) {
        Storage.setItem(name, JSON.stringify(value));
    };

    /**
     * Get Object data type item from local storage.
     *
     * @param {String} name Name of item to fetch.
     * @param {String} def Default value to use if the item doesn't exist.
     * @returns {String}
     */
    getObject(name, def) {
        var value;

        try {
            value = JSON.parse(Storage.getItem(name, def));
        } catch (exception) {
            value = def;
        }

        return value;
    };
}
class ReduxService {

    constructor(service) {
        this.routing = service.getService('routing');

        this.store = Redux.createStore(() => {
            return this.changeState();
        });

        this.store.subscribe(() => {
            let state = this.store.getState();
            this.routing.navigate(state.route);
        });

    }

    changeState(state, action) {
        if (typeof state === 'undefined') {
            var state = {};
            state.route = this.routing.find(window.location.hash);
        }

        switch(action) {
            case 'navigate':

                //ToDo: dead code

                console.log(state, action);

                break;
        }

        return state;
    }

}
class FilterService {

    escapeImports(text) {
        return text;
    }

}
class RoutingService {

    constructor(service, routes) {
        this.routes = routes;

        if(Object.keys(this.routes).length === 0) {
            service.notification.info('Routing map empty');
        }
    }

    find(uri) {
        let route = new Route(uri),
            matched = this.routes[route.uri] ? this.routes[route.uri] : this.routes['/'];

        route.controller = matched.controller;
        route.module = matched.module;
        route.view = matched.view;

        return this.processRoute(route);
    }

    processRoute(matched) {
        matched.controllerClassName = false;

        if(typeof matched.controller != 'undefined') {
            let path = Util.pathInfo(matched.controller);

            matched.controllerClassName = path.basename;
            matched.controllerFile = matched.controller;

            var state = matched.controllerClassName.toLowerCase().replace('controller', '');
        }

        matched.cssNamespace = `${matched.module}-${state}-page`;
        matched.viewFile = matched.view;

        return matched;
    }

    navigate(route) {
        if(typeof route == 'string') {
            route = this.find(route);
        }

        App.navigate(route);
    }

}
let _modules = new WeakMap();

class ModuleService {

    constructor(service, modules) {
        this.modules = modules;
        this.service = service;
        _modules.set(this, {});
    }

    /**
     * Performs loading of modules.
     *
     * @returns {*}
     */
    load() {
        let defer           = $.Deferred(),
            moduleInstances = _modules.get(this);

        for (let i in this.modules) {
            let moduleName      = this.modules[i],
                moduleClassName = `${Util.capitalize(moduleName)}Module`;

            $.ajax({
                url    : `module/${moduleName}/${moduleClassName}.js`,
                success: (source, textStatus, jqXHR) => {
                    let moduleClass = window.classes[moduleClassName];
                    if (typeof moduleClass === 'undefined') {
                        defer.reject(`Invalid module class: ${moduleClass}`);
                        return false;
                    }

                    let module                  = new moduleClass(this.service);
                    moduleInstances[moduleName] = module;
                    _modules.set(this, moduleInstances);

                    for (let route in module.routes) {
                        module.routes[route].module = moduleName;
                    }

                    this.service.settings = $.extend(this.service.settings, module.settings);
                    this.service.routes   = $.extend(this.service.routing.routes, module.routes);

                    if (i == this.modules.length - 1) {
                        defer.resolve();
                    }
                },
                error  : (jqXHR, textStatus, errorThrown) => {
                    defer.reject(textStatus);
                }
            });
        }

        defer.fail((message) => {
            this.service.notification.error(message);
        });

        return defer.promise();
    }

    /**
     * Execute a module hook. This function will run methods name name in all modules.
     *
     * @param {String} name
     */
    hook(name) {
        let deferredArray = [],
            modules       = _modules.get(this);

        for (let i in modules) {
            if (!modules.hasOwnProperty(i)) continue;

            let module = modules[i];
            let defer  = $.Deferred();
            deferredArray.push(defer);

            if (typeof module[name] === 'function') {
                try {
                    module[name](defer);
                } catch (exception) {
                    this.service.notification.error(exception, 'Exception');
                }
            }
        }

        return $.when.apply($, deferredArray).promise();
    }

}
/**
 *
 *
 */
let _current = new WeakMap();

class Framework {

    /**
     * Application bootstrap.
     *
     * @param config
     */
    constructor(config) {
        window.classes = window.classes || {};
        _current.set(this, {});
        _modules.set(this, {});

        this.viewSelector = config.viewSelector;
        this.service      = new ServiceContainer(config);
        let redux = this.service.getService('redux');

        this.service.module.load().done(() => {
                $(window).on('hashchange', () => {
                    let action = {
                        type: 'navigate',
                        path: window.location.hash
                    };
                    redux.store.dispatch(action);
                });

                $(window).trigger('hashchange');
            })
    };

    /**
     * Navigate to state.
     *
     * @param {Route} route
     */
    navigate(route) {
        let current = _current.get(this);

        // call resign of previous controller
        let destructorDefer = $.Deferred(),
            destructorPromise;

        if (typeof current.destructor === 'function') {
            destructorPromise = current.destructor(destructorDefer);
        } else {
            destructorDefer.resolve();
            destructorPromise = destructorDefer.promise();
        }

        destructorPromise.always(() => {
            this.service.module.hook('preRender')
                .always(() => {
                    this.loadController(route)
                        .done((template) => {
                            let controllerClass = window.classes[route.controllerClassName];

                            if (typeof controllerClass == 'undefined') {
                                this.service.notification.error(`State controller missing ${route.controllerClassName}`);
                            }

                            let controller = new controllerClass(this.service);

                            controller.template = template;
                            controller.route    = route;

                            let preRenderDefer = new $.Deferred();
                            controller.preRender(preRenderDefer)
                                .always(() => {
                                    let view = $(this.viewSelector),
                                        filter = this.service.getService('filter');

                                    view.html(filter.escapeImports(controller.template));
                                    view.attr('class', route.cssNamespace);

                                    let postRenderDefer = new $.Deferred();
                                    controller.postRender(postRenderDefer)
                                        .always(() => {
                                            _current.set(this, controller);
                                            this.service.module.hook('postRender').always(() => {

                                            });
                                        });
                                });

                            return route;
                        })
                        .fail((errorText) => {
                            this.service.notification.error(errorText);
                            return null;
                        })
                });
        });
    }

    loadController(route) {
        let defer = $.Deferred();

        if (this.service.isChrome) {
            this.loadView(route.viewFile)
                .done((link) => {

                    if (typeof link[0].import != 'undefined') {
                        let template = Util.link2html(link);

                        if (template == false) {
                            return defer.reject(`File ${route.viewFile} is not template`).promise();
                        }

                        return defer.resolve(template);
                    }
                })
                .fail(() => {
                    defer.reject(`Error loading ${route.viewFile}`);
                });

            return defer.promise();
        }

        // Polyfile for browser that partialy support html imports
        $.get(route.viewFile, (template) => {
            let templateHtml = '';

            $($(template)).each((index, element) => {
                switch (element.tagName) {
                    case 'TEMPLATE':
                        templateHtml = element.innerHTML;
                        break;
                    case 'SCRIPT':
                        console.log(element);
                        break;
                    default:
                        console.log(element);
                }
            });

            if (typeof window.classes[route.controllerClassName] != 'undefined') {
                return defer.resolve(templateHtml).promise();
            }

            $.getScript(route.controllerFile, () => {
                return defer.resolve(templateHtml);
            });
        });

        return defer.promise();
    }

    loadView(href) {
        let defer = $.Deferred(),
            link  = $(`head [href='${href}']`);

        // ToDo: Check if this if can be avoided
        if (link.length > 0) {
            defer.resolve(link);
            return defer.promise();
        }

        link      = document.createElement('link');
        link.rel  = 'import';
        link.href = href;
        link.setAttribute('async', '');
        link.onload  = (event) => {
            defer.resolve($(link));
        };
        link.onerror = (event) => {

            if (this.debug) {
                console.log(event);
            }

            this.notification('error', `Unable to load: ${href}`);
            defer.reject(event);
        };

        setTimeout(() => {
            $('head').append($(link));
        }, 0);

        return defer.promise();
    }

}