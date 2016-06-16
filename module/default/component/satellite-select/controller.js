((window, document) => {

    var owner = document.currentScript.ownerDocument;

    class SatelliteSelect extends HTMLElement {

        constructor() {
            this.createdCallback();
        }

        createdCallback() {
            var _self = this,
                api = this.getAttribute('data-api-url'),
                template = owner.querySelector("template"),
                clone = template.content.cloneNode(true);

            _self.satellites = Storage.getObject('satellites', {});
            _self.root = this.createShadowRoot();

            _self.select = $(clone).find('#satellite-search .typeahead').typeahead({
                source: (query, process) => {
                    $.ajax({
                        url: api + '/api/two-line-elements?_format=json&page=1&page-size=10&sort=name&search=' + query,
                        crossDomain: true,
                        dataType: 'json',
                        success: (response) => {
                            return process(response.records);
                        }
                    });
                },
                updater: (item) => {
                    _self.addSatellite(item);
                    _self.renderSelected();
                }
            });

            _self.close = $(clone).find('table').on('click', '.close', function() {
                let designator = $(this).data('designator');
                let name = _self.satellites[designator].name;

                confirm('Stop tracking of ' + name + ' ?')
                    .done(() => {
                        _self.removeSatellite(designator);
                        _self.renderSelected();
                    })
            });

            _self.root.appendChild(clone);
            _self.renderSelected();
        }

        removeSatellite(designator) {
            delete this.satellites[designator];
            Storage.setObject('satellites', this.satellites);
            $(document).trigger('satellites:change', [this.satellites]);
        }

        addSatellite(item) {
            this.satellites[item.designator] = item;
            Storage.setObject('satellites', this.satellites);
            $(document).trigger('satellites:change', [this.satellites]);
        }

        renderSelected() {
            var body;

            for (let designator in this.satellites) {
                let satellite = this.satellites[designator];

                body +=
                    '<tr>' +
                    '<th scope="row"><span class="tle-decode">' + satellite.designator + '</span></th>' +
                    '<td>' + satellite.name + '</td>' +
                    '<td>' +
                    '<tle-display line1="' + satellite.line1 + '" line2="' + satellite.line2 + '"></tle-display>' +
                    '</td>' +
                    '<td>' +
                    '<button data-designator=' + satellite.designator + ' type="button" class="close" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                    '</td>' +
                    '</tr>';
            }

            $(this.root).find('table tbody').html(body);

            $(this.root).find('.tle-decode').on('click', function() {
                var tle = $(this).parent().parent().find('tle-display');

                App.navigate({
                    controller: "tle",
                    controllerClassName: "TleController",
                    module: "default",
                    params: {
                        line1: tle.attr('line1'),
                        line2: tle.attr('line2')
                    },
                    pathname: "default/tle"
                });

            });
        }
    }

    document.registerElement('satellite-select', SatelliteSelect);
})(window, document);