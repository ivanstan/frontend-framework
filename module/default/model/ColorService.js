class ColorService {

    // http://paletton.com/
    // http://www.hexcolortool.com/
    // http://www.color-hex.com/

    constructor() {
        this.nextSeries = 0;
        this._bgLight = '4757bd';
        this._bgNormal = '3646a7';
        this._bgDark = '263174';
        this.series = [
            '111F74',
            '515FB6',
            '7985CF',
            '074C6A',
            '0F6388',
            '287799',
            '428AA9'
        ];
    }

    get seriesColor() {
        var color = this.series[this.nextSeries];
        this.nextSeries++;
        return color;
    }

    get bgLight() {
        return this._bgLight;
    }

    get bgNormal() {
        return this._bgNormal;
    }

    get bgDark() {
        return this._bgDark;
    }

    get maxSeries() {
        return this.series.length;
    }

    static hexToRGB(hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }


}