if (typeof exports == 'undefined') exports = {};

exports.getConfig = function () {
    return {
        modules: ['default', 'bootstrap'],
        viewSelector: '#container',
        default: {
            module: 'default',
            controller: 'default'
        },
        libs: [
            {
                name: 'jquery',
                js: ['vendor/jquery-2.2.3.min.js']
            }, {
                name: 'tether',
                url: 'https://github.com/HubSpot/tether',
                js: ['vendor/tether-1.3.1.min.js']
            }, {
                name: 'bootstrap',
                dependencies: ['tether'],
                scss: ['vendor/bootstrap/scss/bootstrap.scss'],
                js: ['vendor/bootstrap/bootstrap.min.js']
            }, {
                name: 'toastr',
                scss: ['vendor/toastr/toastr.scss'],
                js: ['vendor/toastr/toastr.min.js']
            }, {
                name: 'sidebar',
                scss: ['vendor/simple-sidebar.scss']
            }, {
                name: 'moment',
                js: ['vendor/moment.min.js']
            }, {
                name: 'fontawesome',
                scss: ['vendor/font-awesome/scss/font-awesome.scss']
            }, {
                name: 'handlebars',
                js: ['vendor/handlebars-4.0.5.min.js']
            }, {
                name: 'rxjs',
                js: ['vendor/rx.all.js']
            }, {
                name: 'typeahead',
                js: ['vendor/bootstrap3-typeahead.min.js']
            }, {
                name: 'clipboardjs',
                js: ['vendor/clipboard.js']
            }, {
                name: 'orbjs',
                js: [
                    'vendor/orb.js/core.js',
                    'vendor/orb.js/satellite.js',
                    'vendor/orb.js/solarsystem.js'
                ]
            }, {
                name: 'kalman',
                url: 'https://github.com/itamarwe/kalman',
                js: [
                    'vendor/sylvester.js',
                    'vendor/kalman.js'
                ]
            }, {
                name: 'charts',
                js: ['vendor/highcharts.js']
            }, {
                name: 'googlemaps',
                js: [
                    'vendor/google-maps/daynightoverlay.js',
                    'vendor/google-maps/infobox.js',
                    'vendor/google-maps/maplabel.js'
                ]
            }, {
                name: 'datetimepicker',
                scss: ['vendor/bootstrap-datetimepicker/bootstrap-datetimepicker-build.scss'],
                js: ['vendor/bootstrap-datetimepicker/bootstrap-datetimepicker.js']
            }, {
                name: 'suncalc',
                url: 'https://github.com/mourner/suncalc',
                js: ['vendor/suncalc.js']
            }, {
                name: 'virtualsky',
                dependencies: ['jquery'],
                url: 'https://github.com/slowe/VirtualSky',
                js: ['vendor/virtualsky/virtualsky.js']
            }, {
                //name: 'meterjs',
                //url: 'https://github.com/skydivejkl/metar.js/tree/master',
                //js: [
                //    'vendor/meter/meter.js',
                //    'vendor/meter/rvr.js'
                //]
            }, {
                name: 'd3',
                js: ['vendor/d3.v3.min.js']
            }, {
                name: 'nvd3',
                dependencies: ['d3'],
                js: ['vendor/nvd3/nv.d3.js'],
                scss: ['vendor/nvd3/nv.d3.css']
            }, {
                name: 'three',
                js: [
                    'vendor/three.min.js',
                    'vendor/orbit-controls.js'
                ]
            }, {
                name: 'html2canvas',
                js: [
                    'vendor/html2canvas.js'
                ]
            }, {
                name: 'framework',
                js: [
                    'core/Util.js',
                    'core/Module.js',
                    'core/Storage.js',
                    'core/Route.js',
                    'core/Application.js',
                    'core/Controller.js',
                    'core/Exception.js',
                    'core/AjaxException.js'
                ]
            }, {
                name: 'application',
                dependencies: ['framework'],
                scss: [
                    'module/bootstrap/styles.scss',
                    'module/default/styles.scss'
                ],
                js: [
                    'module/bootstrap/extend.js',
                    'module/default/model/Observable.js',
                    'module/default/model/Celestial.js',
                    'module/default/model/Sun.js',
                    'module/default/model/Moon.js',
                    'module/default/model/Earth.js',
                    'module/default/model/GeoLocationService.js',
                    'module/default/model/SatelliteTrackService.js',
                    'module/default/model/ImuService.js',
                    'module/default/model/ChartService.js',
                    'module/default/model/ColorService.js',
                    'module/default/model/SkyService.js',
                    'module/default/model/MapService.js',
                    'module/default/model/EarthService.js',
                    'module/default/model/Observer.js',
                    'module/default/model/Astro.js',
                    'bootstrap.js'
                ]
            }
        ]
    };
};

if (typeof window != 'undefined') {
    'use strict';
    window.classes = {};

    App = new Application(exports.getConfig());
}