class Util {

    static capitalize(string) {
        return string[0].toUpperCase() + string.slice(1);
    }

    static link2html(link) {
        var template = $(link[0].import).find('template');

        if (template.length == 0) {
            return false;
        }

        return template.html();
    }

    static require(dependencies) {
        var defer = [];
        var _self = this;

        $(dependencies).each((index, url) => {
            defer.push($.getScript(url));
        });

        Util.loading();

        return $.when.apply($, defer)
            .fail((jqXHR, textStatus, errorThrown) => {
                var instanceProto = Object.getPrototypeOf(_self);
                console.log(instanceProto.constructor.name + ': failed loading dependencies');
                console.log(errorThrown);

                Util.notification('error', instanceProto.constructor.name, 'Failed loading dependencies');
            })
            .always(() => {
                Util.loading(false);
            });
    }

}


