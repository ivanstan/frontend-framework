class DefaultController extends Controller {

    constructor() {
        super();
        this.converter = new showdown.Converter();
    }

    assign() {
        $('.showdown').each((i, block) => {
            let element = $(block);

            var url = element.data('url');
            if (typeof url !== typeof undefined && url !== false) {
                $.get(url, (data) => {
                    let markdown = this.converter.makeHtml(data);
                    element.html(markdown);

                    $('pre code').each((i, block) => {
                        hljs.highlightBlock(block);
                    });
                });
            } else {
                let markdown = this.converter.makeHtml(element.html());
                element.html(markdown);

                $('pre code').each((i, block) => {
                    hljs.highlightBlock(block);
                });
            }
        });
    }
}

window.classes["DefaultController"] = DefaultController;