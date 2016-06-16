class DesignController extends Controller {

    constructor() {
        super();

        this.color = new ColorService();
    }

    set template(template) {
        super.template = template;
    }

    get template() {
        let template = Handlebars.compile(super.template);

        var data = {
            color: '',
            colorBgPrimary: this.color.backgroundPrimary,
            colorBgSecondary: this.color.backgroundSecondary
        };

        for(let i = 0; i < this.color.maxSeries; i++) {
            let color = this.color.seriesColor;
            data.color += '<div class="color-line" style="background: #'  + color + '"></div>';
        }

        return template(data);
    }

}

window.classes['DesignController'] = DesignController;