class GeoLocationService {

    constructor() {
        this.geoposition = {
            coords: {
                latitude: 0,
                longitude: 0,
                altitude: 0,
                accuracy: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null
            },
            timestamp: Date.now()
        }
    }

    set latitude(value) {
        this.geoposition.coords.latitude = value;
    }

    set longitude(value) {
        this.geoposition.coords.longitude = value;
    }

    set altitude(value) {
        this.geoposition.coords.altitude = value;
    }

    get position() {
        var _self = this,
            defer = $.Deferred();

        if (!navigator.geolocation) {
            defer.resolve(_self.geoposition);
            return defer.promise();
        }

        navigator.geolocation.getCurrentPosition((geoposition) => {
            defer.resolve(geoposition);
        }, () => {
            defer.resolve(_self.geoposition);
        }, {
            timeout: 2000,
            maximumAge: 75000
        });

        return defer.promise();
    }

    geoCode(latitude, longitude) {

        jQuery.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude,
            async: false,
            success: function(data) {

            },
            error: function() {

            }
        });

        return rval;
    }

}