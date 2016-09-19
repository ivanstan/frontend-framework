class ReduxService {

    constructor(service) {
        this.routing = service.getService('routing');

        this.store = Redux.createStore(() => {
            return this.changeState();
        });

        this.store.subscribe(() => {
            let state = this.store.getState();

            console.log(this.routing, state.route);

            this.routing.navigate(state.route);
        });

    }

    changeState(state, action) {
        if (typeof state === 'undefined') {
            var state = {};
            state.route = this.routing.find(window.location.hash);
        }

        switch(action) {
            case 'navigate':

                //ToDo: dead code

                console.log(state, action);

                break;
        }

        return state;
    }

}