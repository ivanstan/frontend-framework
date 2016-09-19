class NotificationService {

    /**
     * Raise notification to user.
     *
     * @param {String} type      Possible values: 'error', 'warning', 'success', 'info'
     * @param {String} title
     * @param {String} message
     */
    notify(type, message, title = null) {

        if (!this.debug && type === 'error') {
            return void(0);
        }

        if (typeof window.Notification != 'undefined' && Notification.permission !== 'denied') {

            if (Notification.permission === 'granted') {
                let notification = new Notification(message);
                return void(0);
            }

            if (Notification.permission !== 'denied') {
                Notification.requestPermission(function (permission) {

                    // Whatever the user answers, we make sure we store the information
                    if (!('permission' in Notification)) {
                        Notification.permission = permission;
                    }

                    // If the user is okay, let's create a notification
                    if (permission === 'granted') {
                        let notification = new Notification(message);
                    }
                });
                return void(0);
            }

        }

        if (typeof window.toastr == 'object' && typeof window['toastr'][type] == 'function') {
            window['toastr'][type](message, title);
            return void(0);
        }

        console.log(message);

        return void(0);
    }

    info(message, title = null) {
        this.notify('info', message, title);
    }

    success(message, title = null) {
        this.notify('success', message, title);
    }

    warning(message, title = null) {
        this.notify('warning', message, title);
    }

    error(message, title = null) {
        this.notify('error', message, title);
    }

}