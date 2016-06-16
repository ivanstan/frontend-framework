class AjaxException extends Exception {

    constructor(message) {
        super(message);
    }

    set jqXHR(jqXHR) {
        this._jqXHR = jqXHR;
        return this;
    }

    set textStatus(textStatus) {
        this._textStatus = textStatus;
        return this;
    }

    set errorThrown(errorThrown) {
        this._errorThrown = errorThrown;
        return this;
    }

    error() {

        if(typeof this._errorThrown !== 'string') {
            this.message = this._errorThrown;
        }

        var message;
        var statusErrorMap = {
            '400': "Server understood the request, but request content was invalid.",
            '401': "Unauthorized access.",
            '403': "Forbidden resource can't be accessed.",
            '404': "Route not found.",
            '500': "Internal server error.",
            '503': "Service unavailable."
        };

        if (this._jqXHR.status) {
            message = statusErrorMap[this._jqXHR.status];
            this.title = message;
        }

        switch(this._textStatus) {
            case 'abort':

                break;
            case 'error':

                break;
            case 'notmodified':

                break;
            case 'parsererror':
                this.title = 'Parser error';
                break;
            case 'success':

                break;
            case 'timeout':

                break;
            default:

        }

        super.error();
    }

}