class ModuleService {

    constructor(service, modules) {
        this.modules = modules;
        this.service = service;
    }

    /**
     * Performs loading of modules.
     *
     * @returns {*}
     */
    load() {
        let defer           = $.Deferred(),
            moduleInstances = this.getModules();

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
                    this.setModule(moduleName, module);

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

    getModules() {
        return window.application.modules || {};
    }

    setModule(name, instance) {
        window.application.modules[name] = instance;
    }

    /**
     * Execute a module hook. This function will run methods name name in all modules.
     *
     * @param {String} name
     */
    hook(name) {
        let deferredArray = [],
            modules       = this.getModules();

        for (let i in modules) {
            if (!modules.hasOwnProperty(i)) continue;

            let module = modules[i];

            if (typeof module[name] !== 'function') continue;

            let defer  = $.Deferred();
            deferredArray.push(defer);
            try {
                module[name](defer);
            } catch (exception) {
                this.service.notification.error(exception, 'Exception');
            }
        }

        return $.when.apply($, deferredArray).promise();
    }

}