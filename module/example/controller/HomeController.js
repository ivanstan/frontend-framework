class HomeController extends Controller {

    constructor(app) {
        super(app);
        this.app = app;
        this.converter = new showdown.Converter();

        if (app.isDebug()) {
            console.log(this.constructor.name + ' constructor called');
        }
    }

    preRender() {
        super.preRender();

        if (this.app.isDebug()) {
            console.log(this.constructor.name + ' preRender called');
        }

        return this._defer.promise();
    }

    postRender() {
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
    }

    destructor() {

        if (this.app.isDebug()) {
            console.log(this.constructor.name + ' destructor called');
        }

    }
}

window.classes["HomeController"] = HomeController;