class ServiceContainer {

    constructor(config, app) {
        this.settings = config.settings;
        this.module = new ModuleService(this, config.modules);
        this.notification = new NotificationService(this);
        this.routing = new RoutingService(this, config.routes, app);
        this.storage = new StorageService(this);
        this.redux = new ReduxService(this);
        this.system = new SystemService(this);
        this.view = new ViewService(this, config);
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

}