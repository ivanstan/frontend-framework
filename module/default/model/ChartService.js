class ChartService {

    get chartConfig() {
        return {
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: categories,
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: 'Altitude (km)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ' km',
                crosshairs: [true, true],
                //backgroundColor: 'rgba(15, 99, 136, 0.5)'
            },
            series: [{
                name: data.satellite,
                color: '#AFB5DC',
                data: altitudes
            }]
        }
    }
}