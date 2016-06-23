class DocsController extends Controller {

    constructor(app) {
        super(app);

        console.log(app);

        this.converter = new showdown.Converter();
    }

    postRender(defer) {
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

        return super.postRender(defer);
    }
}

window.classes["DocsController"] = DocsController;