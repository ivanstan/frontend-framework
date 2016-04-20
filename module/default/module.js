class defaultModule {

	constructor() {
        this.settings = {};
    }

	routingErrorHandler(route, jqXHR) {
		console.log('Route not found.');
	}

}

App.modules.push((new defaultModule()));