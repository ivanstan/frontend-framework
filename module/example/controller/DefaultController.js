class DefaultController extends Controller {

    constructor() {
        super();
        this.converter = new showdown.Converter();
    }

    assign() {
        $('pre code').each((i, block) => {
            hljs.highlightBlock(block);
        });

        $('.showdown').each((i, block) => {
            let element = $(block);
            let markdown = this.converter.makeHtml(element.html());
            element.html(markdown);
        });
    }
}

window.classes["DefaultController"] = DefaultController;