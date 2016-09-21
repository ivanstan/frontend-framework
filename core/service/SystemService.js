class SystemService {

    constructor(service) {
        this.service = service;
    }

    loadController(route) {
        let defer = $.Deferred();

        if (this.service.isChrome) {
            this.loadView(route.viewFile)
                .done((link) => {

                    if (typeof link[0].import != 'undefined') {
                        let template = Util.link2html(link);

                        if (template == false) {
                            return defer.reject(`File ${route.viewFile} is not template`).promise();
                        }

                        return defer.resolve(template);
                    }
                })
                .fail(() => {
                    defer.reject(`Error loading ${route.viewFile}`);
                });

            return defer.promise();
        }

        // Polyfile for browser that partialy support html imports
        $.get(route.viewFile, (template) => {
            let templateHtml = '';

            $($(template)).each((index, element) => {
                switch (element.tagName) {
                    case 'TEMPLATE':
                        templateHtml = element.innerHTML;
                        break;
                    case 'SCRIPT':
                        console.log(element);
                        break;
                    default:
                        console.log(element);
                }
            });

            if (typeof window.classes[route.controllerClassName] != 'undefined') {
                return defer.resolve(templateHtml).promise();
            }

            $.getScript(route.controllerFile, () => {
                return defer.resolve(templateHtml);
            });
        });

        return defer.promise();
    }

    loadView(href) {
        let defer = $.Deferred(),
            link  = $(`head [href='${href}']`);

        // ToDo: Check if this if can be avoided
        if (link.length > 0) {
            defer.resolve(link);
            return defer.promise();
        }

        link      = document.createElement('link');
        link.rel  = 'import';
        link.href = href;
        link.setAttribute('async', '');
        link.onload  = (event) => {
            defer.resolve($(link));
        };
        link.onerror = (event) => {

            if (this.debug) {
                console.log(event);
            }

            this.service.notification.error(`Unable to load: ${href}`);
            defer.reject(event);
        };

        $('head').append($(link));

        return defer.promise();
    }

}