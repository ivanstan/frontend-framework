class Util {

    static capitalize(string) {
        return string[0].toUpperCase() + string.slice(1);
    }

    static loading(loading) {
        if (loading == null) {
            loading = true;
        }

        var loader = $('#ajax-loader');
        if (loader.length == 0) {
            return loading;
        }

        if (loading) {
            loader.show();
            return loading;
        }

        loader.hide();
        return loading;
    }

    static link2html(link) {
        var template = $(link[0].import).find('template');

        if (template.length == 0) {
            return false;
        }

        return template.html();
    }

    static toggleFullScreen() {
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
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


