class defaultController {

	render(template, route) {

		return template;
	}

	attach(route) {

	}
	
}

App.current.controller = (new defaultController());