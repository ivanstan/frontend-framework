class BootstrapModule extends Module {

    constructor() {
        super();

        $.get("module/bootstrap/view/partial.html", function (data) {
            $("body").after(data);
        });

        $(document).ajaxStart(function () {
            Util.loading();
        });

        $(document).ajaxComplete(function () {
            Util.loading(false);
        });
    }

    postRender() {
        $("[data-toggle='tooltip']").tooltip();
        $("[data-toggle='popover']").popover();
    }
}

window.classes["BootstrapModule"] = BootstrapModule;