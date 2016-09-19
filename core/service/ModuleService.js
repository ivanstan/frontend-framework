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
    loadModules() {
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
                    this.service.routes   = $.extend(this.service.routes, module.routes);

                    if (i == this.modules.length - 1) {
                        defer.resolve();
                    }
                },
                error  : (jqXHR, textStatus, errorThrown) => {
                    defer.reject(textStatus);
                }
            });
        }

        return defer.promise();
    }

}