class MapService {

    // https://developers.google.com/maps/documentation/javascript/examples/layer-heatmap

    constructor(selector) {
        var _self = this;
        this.setupElement(selector);

        this.markers = {};

        this.map = new google.maps.Map(document.getElementById(selector), {
            center: new google.maps.LatLng(51.508742, -0.120850),
            zoom: 2,
            minZoom: 2,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: MapService.getMapStyle(),
            backgroundColor: '#3646a7'
        });

        this.term = new DayNightOverlay({
            map: this.map,
            fillColor: 'rgba(0,0,0,0.3)',
            date: new Date(Date.UTC())
        });

        this.termUpdate = setInterval(() => {
            _self.term.setDate(Date.UTC());
        }, 3000);

    }

    set observer(observer) {
        var _self = this;

        this.obs = new google.maps.Marker({
            position: (new google.maps.LatLng(observer.latitude, observer.longitude)),
            draggable: true,
            map: _self.instance
        });

        google.maps.event.addListener(this.obs, 'dragend', (event) => {
            observer.latitude = event.latLng.lat();
            observer.longitude = event.latLng.lng();

            $(document).trigger('observer:change', [observer]);
        });
    }

    setupElement(selector) {
        var map = $('#' + selector);

        this.resize = $(window).on('resize', () => {
            var viewport = DefaultController.getViewportDimensions();
            map
                .width(viewport.width)
                .height(viewport.height);
        });

        setTimeout(() => {
            $(window).trigger('resize');
        }, 0);
    }

    static getMapStyle() {
        var color = new ColorService();

        return [{
            featureType: 'road',
            stylers: [{visibility: 'off'}]
        }, {
            featureType: 'transit',
            stylers: [{visibility: 'off'}]
        }, {
            featureType: 'poi',
            stylers: [{visibility: 'off'}]
        }, {
            featureType: 'all',
            elementType: 'labels',
            stylers: [{visibility: 'off'}]
        }, {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{visibility: 'off'}]
        }, {
            featureType: 'administrative',
            elementType: 'geometry.fill',
            stylers: [{visibility: 'on'}, {color: '#' + color.bgDark}]
        }, {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{visibility: 'on'}, {color: '#' + color.bgNormal}]
        }, {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{visibility: 'on'}, {color: '#' + color.bgLight}]
        }];

    }

    get instance() {
        return this.map;
    };
}