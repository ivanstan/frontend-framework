class Sun extends Celestial {

    constructor(observer) {
        super();

        this.SolarSystem = new Orb.SolarSystem();
        this.sun = this.SolarSystem.Sun();

        this._observer = observer;


        $(document).on('observer:change', (event, observer) => {
            this._observer = observer;
            this.setMarker();
        });
        
        return this;
    }


    setMarker() {
        var sunTimes = SunCalc.getTimes(this._observer.datetime, this._observer.latitude, this._observer.longitude);
        var sunPosition = SunCalc.getPosition(this._observer.datetime, this._observer.latitude, this._observer.longitude);
        //var sunriseAzimuth = sunrisePos.azimuth * 180 / Math.PI;

        //super.setMarker();
    }

}