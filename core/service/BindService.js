class BindService {

    constructor(service) {
        this.service = service;
    }

    toController(controller) {
        var ignore = ['service', '_template', 'route'],
            props  = Object.getOwnPropertyNames(controller);

        var data = {},
            values = {};

        for (let i in props) {
            if(!props.hasOwnProperty(i) || ignore.indexOf(props[i]) > -1) continue;

            data[props[i]] = `[data-field="${props[i]}"]`;
            values[props[i]] = controller[props[i]];

        }

        this.bound = Bind(values, data);
    }

}