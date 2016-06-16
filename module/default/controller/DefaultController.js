class DefaultController extends Controller {

    constructor() {
        super();

        this.settings = {};
    }

    async(defer) {
        var _self = this,
            geoLocationService = new GeoLocationService();

        geoLocationService.latitude = 28.4058361053;
        geoLocationService.longitude = -80.6047744751;
        geoLocationService.position.always((geolocation) => {

            if(!Storage.getItem('observer-latitude')) {
                Storage.setItem('observer-latitude', geolocation.coords.latitude);
            }

            if(!Storage.getItem('observer-longitude')) {
                Storage.setItem('observer-longitude', geolocation.coords.latitude);
            }

            if(!Storage.getItem('observer-altitude')) {
                Storage.setItem('observer-altitude', geolocation.coords.altitude);
            }

            if(!Storage.getItem('observer-datetime')) {
                Storage.setItem('observer-datetime', 'now');
            }

            this.observer = new Observer();

            defer.resolve();
        });

        return defer.promise();
    }

    createDateTimeForm() {
        return'<form class="form-inline pull-xs-right">' +
            '<div class="input-group form-group datetime-picker">' +
            '<span class="input-group-addon">' +
            '<i class="fa fa-calendar" aria-hidden="true"></i>' +
            '</span>' +
            '<input type="text" class="form-control"/>' +
            '</div>' +
            '</form>';
    }

    createTabMenu() {
        return '<ul class="nav nav-tabs-top" role="tablist">' +
            '<li class="nav-item">' +
            '<a class="nav-link active" data-toggle="tab" href="#dashboard-tab" role="tab">Dashboard</a>' +
            '</li>' +
            '<li class="nav-item">' +
            '<a class="nav-link" data-toggle="tab" href="#map-tab" role="tab">Map</a>' +
            '</li>' +
            '<li class="nav-item">' +
            '<a class="nav-link" data-toggle="tab" href="#sky-tab" role="tab">Sky</a>' +
            '</li>' +
            '<li class="nav-item">' +
            '<a class="nav-link" data-toggle="tab" href="#earth-tab" role="tab">Earth</a>' +
            '</li>' +
            '<li class="nav-item">' +
            '<a class="nav-link" data-toggle="tab" href="#settings-tab" role="tab">Settings</a>' +
            '</li>' +
            '</ul>';
    }

    assign() {
        var _self = this;
        this.mapTab = this.mapTab();
        this.skyTab = this.skyTab();
        this.dashboardTab = this.dashboardTab();

        //$(window).on( 'scroll', (event) => {
        //    let position = $('body').scrollTop();
        //    let headerHeight = $('header').css('height');
        //
        //    if(position > headerHeight) {
        //        $('header').hide();
        //    } else {
        //        $('header').show();
        //    }
        //});

        var menuToggleButton =
            '<button class="navbar-toggler" id="menu-toggle">' +
            '<i class="fa fa-bars" aria-hidden="true"></i>' +
            '</button>';

        $(menuToggleButton).prependTo('header .navbar');

        $(this.createTabMenu()).appendTo('header .navbar');
        $(this.createDateTimeForm()).appendTo('header .navbar');

        $(".datetime-picker").datetimepicker({
            // format: 'mm:hh:ss YYYY-MM-DD',
            defaultDate: this.observer.datetime,
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down",
                previous: "fa fa-angle-left",
                next: "fa fa-angle-right",
                today: "fa fa-crosshairs",
                clear: "fa fa-trash-o",
                close: "fa fa-times"
            },
            showTodayButton: true,
            showClear: true,
            showClose: true
        });

        this.updateClock = setInterval(function () {
            // $(".datetime-picker").val();
        }, this);


        $("nav .datetime-picker").on("dp.change", function(event) {

            if(parseInt(event.timeStamp / 100) == event.date.unix()) {
                console.log(1);
            }

            // determine is today?

            // trigger observer changed
        });



        var active = Storage.getItem('default-active-tab', 'map-tab');
        $('[href="#' + active + '"]').trigger('click');

        var sideBarVisible = Storage.getItem('sidebar-visible', 0);
        if (!sideBarVisible) {
            $('#container #wrapper').addClass('toggled');
            setTimeout(() => {
                $('#map').width($('#page-content-wrapper').width());
            }, 400);
        }

        this.sidebar = $('#menu-toggle').on('click', () => {
            $('#wrapper').toggleClass('toggled').promise().done(() => {
                setTimeout(() => {
                    $('#map').width($('#page-content-wrapper').width());
                    $('#sky').width($('#page-content-wrapper').width());
                }, 400);
            });
            sideBarVisible = !$('#container #wrapper').hasClass('toggled');
            Storage.setItem('sidebar-visible', sideBarVisible);
        });

        $('.nav-tabs-top .nav-link').on('click', function(event) {
            var active = $(this).attr('href').slice(1);
            Storage.setItem('default-active-tab', active);

            if(active == 'map-tab') {
                setTimeout(() => {
                    google.maps.event.trigger(_self.map.instance, "resize");
                }, 0);
                return;
            }

            setTimeout(() => {
                $(window).trigger('resize');
            }, 0);
        });

    }

    mapTab() {
        this.map = new MapService('map');
        this.map.observer = this.observer;

        this.sky = new SkyService('sky');
        this.sky.observer = this.observer;

        this.earth = new EarthService('earth');
        this.earth.observer = this.observer;

        $(document).on('observer:changed', function(event, observer){
            this.observer = observer;
        });

        this.track = new SatelliteTrackService(Storage.getObject('satellites', {}));
        this.track.observer = this.observer;
        this.track.map = this.map;
        this.track.sky = this.sky;
        this.track.earth = this.earth;
        this.track.initialize();
        this.track.celestial();
    }

    skyTab() {
        // https://jsfiddle.net/gh/get/$/1.9.1/highslide-software/highcharts.com/tree/master/samples/highcharts/demo/dynamic-update/

        var _self = this;

        this.gyro = new ImuService();

        Highcharts.setOptions({
            chart: {
                backgroundColor: {
                    linearGradient: [0, 0, 500, 500],
                    stops: [
                        [0, 'rgb(255, 255, 255)'],
                        [1, 'rgb(240, 240, 255)']
                    ]
                },
                borderWidth: 2,
                plotBackgroundColor: 'rgba(255, 255, 255, .9)',
                plotShadow: true,
                plotBorderWidth: 1
            },
            global: {
                useUTC: false
            }
        });

        let data = (function () {
            // generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;

            for (i = -19; i <= 0; i += 1) {
                data.push({
                    x: time + i * 1000,
                    y: Math.random()
                });
            }
            return data;
        }());


        let chartLoaded = function (chart) {
            _self.gyro.getGyroscopeStream().subscribe((event) => {
                var time = (new Date()).getTime();

                chart.series[0].addPoint([time, event.alpha], true, true);
                chart.series[1].addPoint([time, event.kalmanAlpha], true, true);
                //chart.series[2].addPoint([time, event.gamma], true, true);
            });
        };

        $('#chart-accelerometer').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg,
                marginRight: 10,
                events: {
                    load: () => {
                        chartLoaded(this);
                    }
                }
            },
            title: {
                text: 'Live random data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                },
                    {
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }, {
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
            },
            tooltip: {
                formatter: () => {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'X',
                data: data
            }, {
                name: 'Y',
                data: data
            },
                //    {
                //    name: 'Z',
                //    data: data
                //}
            ]
        });

        return this;
    }

    dashboardTab() {

    }

    resign() {
        $('nav #menu-toggle').remove();
        $('nav .nav-tabs-top').remove();
        $('nav form').remove();
    }

    static getViewportDimensions() {
        var navbar = $('.navbar'),
            sidebar = $('#sidebar-wrapper'),
            height = $(window).height() - navbar.height() - 16,
            width = $(window).width() - sidebar.width();

        if(sidebar.parent().hasClass('toggled')) {
            width -= sidebar.width();
        }

        return {
            width: width,
            height: height
        }
    }

}

window.classes['DefaultController'] = DefaultController;