class TutorialController extends Controller {

    constructor(app) {
        super(app);
    }

    postRender(defer) {
        return super.postRender(defer);
    }
}

window.classes["TutorialController"] = TutorialController;