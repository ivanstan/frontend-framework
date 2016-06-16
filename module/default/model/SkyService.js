class SkyService {

    constructor(selector) {
        var viewport = DefaultController.getViewportDimensions();

        this._element = $('#' + selector);
        this._pointers = {};
        this._color = new ColorService();

        this.resize = $(window).on('resize', () => {
            var viewport = DefaultController.getViewportDimensions();
            this._element
                .width(viewport.width)
                .height(viewport.height);
        });

        setTimeout(() => {
            $(window).trigger('resize');
        }, 0);

        this._virtualsky = $.virtualsky({
            id: selector,
            projection: 'stereo', //'polar', 'stereo', 'lambert', 'ortho', 'equirectangular', 'mollweide', 'planechart' or 'fisheye'
            width: viewport.width,
            height: viewport.height,
            planets: 'vendor/virtualsky/planets.json',
            magnitude: 3,
            latitude: 0,
            longitude: 0,
            clock: (new Date()),
            background: '#' + this._color.bgNormal,
            transparent: false,
            color: 'rgb(255,255,255)',
            az: 0,
            negative: false,
            gradient: false,
            ground: false,
            keyboard: true,
            mouse: true,
            cardinalpoints: true, //show/hide the N/E/S/W labels
            constellations: true, //show/hide the constellation lines
            constellationlabels: false, //show/hide the constellation labels
            constellationboundaries: false, //show/hide the constellation boundaries
            meteorshowers: false, //show/hide current meteor shower radiants
            showplanets: true, //show/hide the planets
            showplanetlabels: true, //show/hide the planet labels
            showorbits: true, //show/hide the orbits of the planets
            showstars: true, //show/hide the stars
            showstarlabels: false, //show/hide the star labels for the brightest stars
            scalestars: 1, //the factor by which to scale the star sizes
            showdate: false, //show/hide the date and time
            showposition: false, //show/hide the latitude and longitude
            gridlines_az: false, //show/hide the azimuth/elevation grid lines
            gridlines_eq: true, //show/hide the RA/Dec grid lines
            gridlines_gal: false, //show/hide the Galactic grid lines
            gridstep: 30,  //the size of the grid step when showing grid lines
            ecliptic: false, //show the line of the Ecliptic
            meridian: false, //show the line of the Meridian
            showgalaxy: false, //show an outline of the Milky Way
            live: false, //update the display in real time
            fontsize: "10px",
            //fontfamily CSS font-family string
            lang: 'en-US'
        });

        $(document).on('observer:change', (event, observer) => {
            this._virtualsky
                .setLatitude(observer.latitude)
                .setLongitude(observer.longitude)
                .setAzimuth(observer.azimuth)
                .draw();
        });

    }

    get instance() {
        return this._virtualsky;
    }

    set observer(observer) {
        this._element.on('mouseup', (event) => {
            observer.azimuth = this._virtualsky.az_off;

            $(document).trigger('observer:change', [observer]);
        });
    }

    addSatellite(satellite, position) {
        this._pointers[satellite.designator] = this.instance.addPointer({
            ra: Astro.rad2deg(position.ra),
            dec: Astro.rad2deg(position.dec),
            label: satellite.name,
            colour: 'rgb(255,255,255)'
        });
    }

}