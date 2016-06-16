class Moon extends Celestial {

    constructor(observer) {
        super();

        this._observer = observer;

        $(document).on('observer:change', (event, observer) => {
            this._observer = observer;
            this.setMarker();
        });

        return this;
    }

    setMarker() {
        var moonTimes = SunCalc.getMoonTimes(this._observer.datetime, this._observer.latitude, this._observer.longitude);
        var moonPosition = SunCalc.getMoonPosition(this._observer.datetime, this._observer.latitude, this._observer.longitude);
        var moon = SunCalc.getMoonIllumination(this._observer.datetime);

        //super.setMarker();
    }

}