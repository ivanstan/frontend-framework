class ServiceContainer {

    constructor(config) {
        this.settings = config.settings;
        this.routes   = config.routes;
        this.storage = new StorageService();
        this.redux = new ReduxService(config.routes);
    }

    getService(service) {
        return (typeof this[service] == 'undefined') ? false : this[service];
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