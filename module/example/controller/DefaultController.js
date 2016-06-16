class DefaultController extends Controller {

    constructor() {
        super();
    }

    assign() {
        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    }
}

window.classes["DefaultController"] = DefaultController;