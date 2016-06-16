class Celestial extends Observable {

    constructor() {
        super();
    }

    setMap(map) {
        this._map = map;

        return this;
    }

    setMarker(latitude, longitude) {
        if(this._map == 'undefined') return false;

        let position = new google.maps.LatLng(latitude, longitude),
            _self = this;

        if (typeof this.marker != 'undefined') {
            this.marker.set('position', position);
            return this.marker;
        }

        var marker = new google.maps.Marker({
            position: position,
            draggable: false,
            map: _self._map.instance
        });

        google.maps.event.addListener(marker, 'click', (event) => {
            console.log(marker);
        });

        var label = new MapLabel({
            text: 'Sun',
            position: position,
            map: _self._map.instance,
            fontSize: 10,
            strokeWeight: 0,
            fontColor: '#fff',
            align: 'center'
        });
        label.set('position', position);

        this.label = label;
        this.marker = marker;

        return marker;
    }

}