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

    static isChrome() {
        return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
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
class Module {

    /**
     * Class Constructor.
     *
     * @param {Framework} app   Framework instance.
     */
    constructor(app) {

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
class Controller {

    /**
     * Class constructor.
     *
     * @param {Framework} app   Framework instance.
     */
    constructor(app) {
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
     * @param uri
     * @param params
     * @param map
     * @returns {Route}
     */
    constructor(uri, params, map) {
        this.map = map;
        this.params = params ? params : {};
        this.uri = uri.indexOf('#') === 0 ? uri.substring(1) : uri;

        if(uri.lastIndexOf('#') > 0) {
            this.hash = this.uri.substring(this.uri.lastIndexOf('#') + 1, this.uri.length);
            this.uri = this.uri.substring(0, this.uri.lastIndexOf('#'));
        }

        if(this.uri.indexOf('?') > -1) {
            let tmpParams = this.uri.substr(uri.indexOf('?'), this.uri.length);
            this.uri = this.uri.substr(0, this.uri.indexOf('?'));

            tmpParams = tmpParams.split('&');
            for (let i in tmpParams) {
                let nv = tmpParams[i].split('=');
                if (!nv[0]) continue;
                this.params[nv[0]] = nv[1] || true;
            }
        }

        if(Object.keys(this.map).length === 0) {
            console.log('Routing map empty');
        }

        let matched = this.map[this.uri] ? this.map[this.uri] : this.map['/'];

        this.module = matched.module;
        this.state = matched.state;
        this.moduleFolder = `module/${this.module}`;
        this.cssNamespace = `${matched.module}-${matched.state}-page`;

        this.moduleClassName = Util.capitalize(matched.module) + 'Module';
        this.controllerClassName = Util.capitalize(matched.state) + 'Controller';

        this.viewFileName = matched.state + 'View.html';
        this.controllerFileName = matched.state + 'Controller.js';

        this.viewFile = `${this.moduleFolder}/view/${this.viewFileName}`;
        this.controllerFile = `${this.moduleFolder}/controller/${this.controllerFileName}`;

        return this;
    }
}
/**
 * Sets the String type item to local storage.
 *
 * @param {String} name Save under this name.
 * @param {String} value Value to be saved.
 */
Storage.setItem = function(name, value) {
    window.localStorage.setItem(name, value);
};

/**
 * Get String type item from local storage.
 *
 * @param {String} name Name of item to fetch.
 * @param {String} def Default value to use if the item doesn't exist.
 * @returns {String}
 */
Storage.getItem = function(name, def) {
    var value = window.localStorage.getItem(name);
    return value == null ? def : value;
};

/**
 * Set object data type in local storage
 *
 * @param {String} name Save under this name.
 * @param {Object} value Object to be saved.
 */
Storage.setObject = function(name, value) {
    Storage.setItem(name, JSON.stringify(value));
};

/**
 * Get Object data type item from local storage.
 *
 * @param {String} name Name of item to fetch.
 * @param {String} def Default value to use if the item doesn't exist.
 * @returns {String}
 */
Storage.getObject = function(name, def) {
    var value;

    try {
        value = JSON.parse(Storage.getItem(name, def));
    } catch (exception) {
        value = def;
    }

    return value;
};

/**
 *
 *
 */
let _current = new WeakMap();
let _modules = new WeakMap();

class Framework {

    /**
     * Application bootstrap.
     *
     * @param config
     */
    constructor(config) {
        window.classes = window.classes || {};
        this.config    = config;
        this.routes    = {
            '/': {
                controller: 'default',
                module    : 'default'
            }
        };
        this.route     = {};

        _current.set(this, {});
        _modules.set(this, {});

        this.loadModules()
            .done(() => {
                $(window).trigger('hashchange');
            })
            .fail((message) => {
                this.notification('error', message);
            });

        $(window).on('hashchange', () => {
            this.navigate(new Route(window.location.hash, {}, this.routes));
        });
    };

    /**
     * Performs loading of modules.
     *
     * @returns {*}
     */
    loadModules() {
        var defer   = $.Deferred();
        var modules = _modules.get(this);

        var moduleCount  = Object.keys(this.config.modules).length;
        var currentCount = 0;

        for (var moduleName in this.config.modules) {
            if (!this.config.modules.hasOwnProperty(moduleName)) continue;

            var moduleClassName = `${Util.capitalize(moduleName)}Module`;

            $.ajax({
                url    : `module/${moduleName}/${moduleClassName}.js`,
                success: (source, textStatus, jqXHR) => {
                    if (jqXHR.status !== 200) {
                        defer.reject(`Error loading: ${moduleClassName}`);
                    }

                    var moduleClass = window.classes[moduleClassName];
                    if (typeof moduleClass === 'undefined') {
                        defer.reject(`Invalid module class: ${moduleClass}`);
                        return false;
                    }

                    var module                         = new moduleClass(this);
                    this.config['modules'][moduleName] = module.settings;

                    if (typeof module.routes == 'object') {
                        for (var i in module.routes) {
                            module.routes[i]['module'] = moduleName;
                        }
                        this.routes = $.extend(this.routes, module.routes);
                    }

                    modules[moduleName] = module;
                    _modules.set(this, modules);

                    if (currentCount == moduleCount) {
                        defer.resolve();
                    }
                },
                error  : (jqXHR, textStatus, errorThrown) => {
                    defer.reject(textStatus);
                }
            });
            currentCount++;
        }

        return defer.promise();
    }

    /**
     * Navigate to state.
     *
     * @param {Route} route
     */
    navigate(route) {

        this.route  = route;
        var current = _current.get(this);

        // call resign of previous controller
        var destructorDefer = $.Deferred(),
            destructorPromise;

        if (typeof current.destructor === 'function') {
            destructorPromise = current.destructor(destructorDefer);
        } else {
            destructorDefer.resolve();
            destructorPromise = destructorDefer.promise();
        }

        destructorPromise.always(() => {
            this.hook('preRender')
                .always(() => {
                    this.loadController(route)
                        .fail((errorText) => {
                            this.notification('error', errorText);
                            return null;
                        })
                        .done((template) => {
                            let controllerClass = window.classes[route.controllerClassName];

                            if (typeof controllerClass == 'undefined') {
                                this.notification('error', `State controller missing ${route.controllerClassName}`);
                            }

                            var controller = new controllerClass(this);

                            controller.template = template;
                            controller.route    = route;

                            var preRenderDefer = new $.Deferred();
                            controller.preRender(preRenderDefer)
                                .always(() => {
                                    let view = $(this.config.viewSelector);

                                    view.html(controller.template);
                                    view.attr('class', route.cssNamespace);

                                    var postRenderDefer = new $.Deferred();
                                    controller.postRender(postRenderDefer)
                                        .always(() => {
                                            _current.set(this, controller);
                                            this.hook('postRender').always(() => {

                                            });
                                        });
                                });


                            return route;
                        });
                });
        });
    }

    loadController(route) {
        var defer = $.Deferred();

        if (Util.isChrome()) {
            this.loadView(route.viewFile)
                .done((link) => {

                    if (typeof link[0].import != 'undefined') {
                        var template = Util.link2html(link);

                        if (template == false) {
                            return defer.reject(`File ${route.viewFile} is not template`).promise();
                        }

                        return defer.resolve(template).promise();
                    }
                })
                .fail(() => {
                    defer.reject(`Error loading ${route.viewFile}`);
                });
        }

        // Polyfile for browser that partialy support html imports
        $.get(route.viewFile, (template) => {
            var templateHtml = '';

            $($(template)).each((index, element) => {
                switch(element.tagName) {
                    case 'TEMPLATE':
                        templateHtml = element.innerHTML;
                        break;
                }
            });

            if(typeof window.classes[route.controllerClassName] != 'undefined') {
                return defer.resolve(templateHtml).promise();
            }

            $.getScript(route.controllerFile, () => {
                return defer.resolve(templateHtml);
            });
        });

        return defer.promise();
    }

    loadView(href) {
        var defer = $.Deferred(),
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

        $('head').append($(link));

        return defer.promise();
    }

    /**
     * Execute a module hook. This function will run methods name hookName in all modules.
     *
     * @param {String} hookName
     */
    hook(hookName) {
        var deferredArray = [],
            modules       = _modules.get(this);

        for (let i in modules) {
            if (!modules.hasOwnProperty(i)) continue;

            let module = modules[i];
            var defer  = $.Deferred();
            deferredArray.push(defer);

            if (typeof module[hookName] === 'function') {
                try {
                    module[hookName](defer);
                } catch (exception) {
                    this.notification('error', exception, 'Exception');
                }
            }
        }

        return $.when.apply($, deferredArray).promise();
    }

    errorHandler(exception) {
        exception.processError();

        this.notification('error', exception.getTitle(), exception.getMessage());

        console.log(exception);
    }

    /**
     * Raise notification to user.
     *
     * @param {String} type      Possible values: 'error', 'warning', 'success', 'info'
     * @param {String} title
     * @param {String} message
     */
    notification(type, message, title = null) {

        if (!this.debug() && type === 'error') {
            return void(0);
        }

        if (typeof window.Notification != 'undefined' && Notification.permission !== 'denied') {

            if(Notification.permission === 'granted') {
                let notification = new Notification(message);
                return void(0);
            }

            if (Notification.permission !== 'denied') {
                Notification.requestPermission(function (permission) {

                    // Whatever the user answers, we make sure we store the information
                    if(!('permission' in Notification)) {
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

    /**
     * Returns true if application is in debug mode.
     *
     * @returns {Boolean}
     */
    debug() {
        return location.pathname.indexOf('index-dev.html') > 0;
    }

    getPartial(url) {
        var defer = $.Deferred();

        $.ajax({
            url    : url,
            success: function (data) {
                defer.resolve(data);
            },
            error  : function () {
                defer.reject();
            }
        });

        return defer.promise();
    }

}