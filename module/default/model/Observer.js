class Observer {

    constructor() {
        this._latitude = Storage.getItem('observer-latitude', 0);
        this._longitude = Storage.getItem('observer-latitude', 0);
        this._altitude = Storage.getItem('observer-latitude', 0);
        this._datetime = Storage.getItem('observer-datetime', 'now');
        this._azimuth = Storage.getItem('observer-azimuth', 0);
    }

    get latitude() {
        return parseFloat(this._latitude);
    }

    set latitude(latitude) {
        Storage.setItem('observer-latitude', latitude);
        this._latitude = latitude;
    }

    get longitude() {
        return parseFloat(this._longitude);
    }

    set longitude(longitude) {
        Storage.setItem('observer-longitude', longitude);
        this._longitude = longitude;
    }

    get altitude() {
        return parseFloat(this._altitude);
    }

    set altitude(altitude) {
        Storage.setItem('observer-altitude', altitude);
        this._altitude = altitude;
    }

    get datetime() {
        return this._datetime == 'now' ? (new Date()) : this._datetime;
    }

    set datetime(datetime) {
        this._datetime = datetime;
        Storage.setItem('observer-datetime', datetime);
    }

    get azimuth() {
        return this._azimuth;
    }

    set azimuth(azimuth) {
        this._azimuth = azimuth;
        Storage.setItem('observer-azimuth', azimuth);
    }

    isLive() {
        return this._datetime == 'now';
    }

}