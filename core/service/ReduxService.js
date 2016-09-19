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

        console.log(state, action);

        switch(action) {
            case 'navigate':

                //ToDo: dead code



                break;
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