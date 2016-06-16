class MainController extends Controller {

    constructor() {
        super();
    }



    assign() {
        var data = [{
            key: 'X',
            values: [],
            color: '#ff7f0e'
        }, {
            key: 'Y',
            values: [],
            color: '#2ca02c'
        }, {
            key: 'Z',
            values: [],
            color: '#7777ff'
        }];

        var chart;

        function redraw() {

            nv.addGraph(() => {
                chart = nv.models.lineChart()
                    .x((d) => {

                        console.log(d);

                        return d.display ? d.display.x : d.x
                    })
                    .y((d) => {
                        return d.display ? d.display.y : d.y
                    })
                    .color(d3.scale.category10().range());

                chart.xAxis
                    .tickFormat((d) => {
                        return d3.time.format('%x')(new Date(d))
                    });

                chart.yAxis
                    .tickFormat(d3.format(',.1%'));

                d3.select('#chart svg')
                    .datum(data)
                    .transition()
                    .call(chart);

                nv.utils.windowResize(chart.update);

                return chart;
            });
        }

        this.gyro = new ImuService();
        this.gyro.gyroscopeStream.subscribe((event) => {
            var time = (new Date()).getTime();

            data[0].values.push({
                x: time,
                y: event.alpth
            });
            data[1].values.push({
                x: time,
                y: event.beta
            });
            data[2].values.push({
                x: time,
                y: event.gamma
            });

            redraw();
        });


    }

}

window.classes['MainController'] = MainController;