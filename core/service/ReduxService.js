class ReduxService {

    constructor(service) {
        this.service = service;
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

        let modules = this.service.module.getModules();
        for (let i in modules) {
            if (!modules.hasOwnProperty(i)) continue;

            let module = modules[i];
            if (typeof module['changeState'] !== 'function') continue;

            try {
                state = module['changeState'](state, action);
            } catch (exception) {
                this.service.notification.error(exception, 'Exception');
            }
        }

        return state;
    }

    init() {
        $(window).on('hashchange', () => {
            let action = {
                type: 'navigate',
                path: window.location.hash
            };
            this.store.dispatch(action);
        });
    }

}