class Framework {

    /**
     * Application bootstrap.
     *
     * @param config
     */
    constructor(config) {
        window.classes = window.classes || {};
        window.application = {
            framework: this,
            modules: {},
            current: {}
        };
        this.service   = new ServiceContainer(config);
        this.service.module.load().done(() => {
            this.service.redux.init();
            $(window).trigger('hashchange');
        });
    };
}