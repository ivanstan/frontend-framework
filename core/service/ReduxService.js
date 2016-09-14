class ReduxService {

    constructor(routes) {
        this.routes = routes;

        this.store = Redux.createStore(() => {
            return this.changeState();
        });

        this.store.subscribe(() => {
            let state = this.store.getState();
            App.navigate(state.route);
        });

    }

    changeState(state, action) {
        if (typeof state === 'undefined') {
            var state = {};
            state.route = new Route(window.location.hash, {}, this.routes);
        }

        switch(action) {
            case 'navigate':

                break;
        }

        return state;
    }

}