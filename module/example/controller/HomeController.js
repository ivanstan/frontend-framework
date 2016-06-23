class HomeController extends Controller {

    constructor(app) {
        super(app);
        this.app = app;
        this.converter = new showdown.Converter();

        if (app.isDebug()) {
            console.log(this.constructor.name + ' constructor called');
        }
    }

    preRender(defer) {

        if (this.app.isDebug()) {
            console.log(this.constructor.name + ' preRender called');
        }

        return super.preRender(defer);
    }

    postRender(defer) {
        $('.showdown').each((i, block) => {
            let element = $(block);

            var url = element.data('url');
            $.get(url, (data) => {
                let markdown = this.converter.makeHtml(data);
                element.html(markdown);

                $('pre code').each((i, block) => {
                    hljs.highlightBlock(block);
                });
            });

        });

        if (this.app.isDebug()) {
            console.log(this.constructor.name + ' postRender called');
        }

        return super.postRender(defer);
    }

    destructor(defer) {

        if (this.app.isDebug()) {
            console.log(this.constructor.name + ' destructor called');
        }

        return super.destructor(defer);
    }
}

window.classes["HomeController"] = HomeController;