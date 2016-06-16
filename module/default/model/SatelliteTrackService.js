class SatelliteTrackService {

    constructor(satellites) {
        this.colorService = new ColorService();
        // http://www.lizard-tail.com/isana/lab/orb/
        this._satellites = {};
        this.markers = {};
        this.labels = {};
        this.trackOrbits = 1;

        for (var designator in satellites) {
            let satellite = satellites[designator];
            let propagator = new Orb.Satellite({first_line: satellite.line1, second_line: satellite.line2});

            satellite = $.extend(satellite, propagator);
            satellite['color'] = this.colorService.seriesColor;

            this._satellites[designator] = satellite;
        }

        $(document).on('satellites:change', function(events, satellites){

        });


    }

    set map(map) {
        this._map = map;
    }

    set sky(sky) {
        this._sky = sky;
    }

    set earth(earth) {
        this._earth = earth;
    }

    set observer(observer) {
        this._observer = observer;
        this.time = new Orb.Time(observer.datetime);
    }

    get observer() {
        return this._observer;
    }

    initialize() {
        var _self = this;

        this.satPosition = setInterval(function() {
            for (var designator in _self._satellites) {
                _self.satellitePosition(_self._satellites[designator]);
                _self._earth.render();
            }
        }(), 3000);
    }

    celestial() {
        this._sun = new Sun(this.observer)
            .setMap(this._map)
            .setMarker();

        this._moon = new Moon(this.observer)
            .setMap(this._map)
            .setMarker();
    }

    satellitePosition(satellite) {
        var observer = new Orb.Observer(this.observer);
        var observer_rect = observer.rectangular(this.time);

        var geo = satellite.position.geographic(this.time);
        var rect = satellite.position.rectangular(this.time);
        var spherical = Astro.CartToPolar(rect);


        var observation = new Orb.Observation({observer: observer, target: satellite});
        var look = observation.horizontal(this.time);

        this.orbit(satellite);
        this.satellite(satellite, geo.latitude, geo.longitude);

        this._sky.addSatellite(satellite, spherical);
        this._earth.addSatellite(satellite, rect);
    }

    orbit(satellite) {
        let deltaTime = 30;
        var _self = this,
            orbitPeriod = Math.floor(satellite.orbital_period * 60), // seconds
            timestamp = Math.floor(this.time.date.getTime() / 1000),
            half = Math.floor(orbitPeriod / 2 * this.trackOrbits),
            startTime = timestamp - half,
            endTime = timestamp + half,
            orbit = [];

        while (startTime < endTime) {
            var time = new Orb.Time((new Date(startTime * 1000)));
            var geo = satellite.position.geographic(time);
            orbit.push((new google.maps.LatLng(parseFloat(geo.latitude), parseFloat(geo.longitude))));
            startTime += deltaTime;
        }

        var orbitPath = new google.maps.Polyline({
            path: orbit,
            geodesic: true,
            strokeColor: '#' + satellite.color,
            strokeOpacity: 0.5,
            strokeWeight: 2
        });

        orbitPath.setMap(this._map.instance);

        this._satellites[satellite.designator].orbit = orbitPath;
    }

    satellite(satellite, latitude, longitude) {
        var _self = this,
            position = new google.maps.LatLng(latitude, longitude);

        if (typeof this.markers[satellite.designator] != 'undefined') {
            this.markers[satellite.designator].set('position', position);
            this.labels[satellite.designator].set('position', position);
            return marker;
        }

        var url = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + satellite.color;
        var pinImage = new google.maps.MarkerImage(
            url,
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34)
        );

        var marker = new google.maps.Marker({
            position: position,
            icon: pinImage,
            draggable: false,
            map: _self._map.instance,
            designator: satellite.designator
        });

        google.maps.event.addListener(marker, 'click', (event) => {
            let satellite = this._satellites[marker.designator];

            let context = this.getContext();

            console.log(satellite);
        });

        var label = new MapLabel({
            text: satellite.name,
            position: position,
            map: _self._map.instance,
            fontSize: 10,
            strokeWeight: 0,
            fontColor: '#fff',
            align: 'center'
        });
        label.set('position', position);

        this.labels[satellite.designator] = label;
        this.markers[satellite.designator] = marker;

        return marker;
    }

    getContext() {
        var rval = 'map';
        $('nav .nav-tabs-top a').each((index, element) => {
            var element = $(element);
            if($(element).hasClass('active')) {
                rval = element.attr('href').slice(1).replace('-tab', '');
            }
        });
        return rval;
    }

}