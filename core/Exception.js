class Exception {

    constructor(message) {
        this._message = message;
        this._title = 'Error';

        return this;
    }

    set route(route) {
        this._route = route;
        return this;
    }

    static create(message) {
        return new this(message);
    }

    get message() {
        return this._message;
    }

    set message(message) {
        this._message = message;
    }

    set title(title) {
        this._title = title;
    }

    get title() {
        return this._title;
    }

    error() {

    }

}