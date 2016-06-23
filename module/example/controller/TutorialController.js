class TutorialController extends Controller {

    constructor(app) {
        super(app);
        this.converter = new showdown.Converter();
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

                mermaid.init({noteMargin: 10}, ".mermaid");
            });

        });

        return super.postRender(defer);
    }
}

window.classes["TutorialController"] = TutorialController;