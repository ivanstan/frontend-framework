class ReduxService {

    constructor(service) {
        this.service = service;
        this.routing = service.getService('routing');

        this.store = Redux.createStore(this.changeState);

        this.store.subscribe(() => {
            let state = this.store.getState();
            this.routing.navigate(state.route);
        });
    }

    changeState(state, action) {
        let service = window.application.service;

        switch (action.type) {
            case '@@redux/INIT':
                var state = {};
                state.route = service.routing.find(window.location.hash);
                break;
            case 'navigate':
                state.route = service.routing.find(action.path);
                break;
        }

        // execute changeState redux hook
        let modules = service.module.getModules();
        for (let i in modules) {
            if (!modules.hasOwnProperty(i)) continue;

            let module = modules[i];
            if (typeof module['changeState'] !== 'function') continue;

            try {
                state = module['changeState'](state, action);
            } catch (exception) {
                service.notification.error(exception, 'Exception');
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