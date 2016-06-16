class TleController extends Controller {

    async(defer) {

        defer.resolve();

        //$.ajax({
        //    url: 'http://dev.byteout.com/astrodynamics/astrodynamics/web/app_dev.php/api/two-line-elements?_format=json&page=1&page-size=10&sort=name&search=ISS',
        //    success: function (data) {
        //        console.log(data);
        //        defer.resolve();
        //    }
        //});

        return defer.promise();
    }

    assign() {

    }

}

window.classes['TleController'] = TleController;