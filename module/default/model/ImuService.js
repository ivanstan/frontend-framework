class ImuService {

    constructor() {
        if(!window.DeviceMotionEvent || !window.DeviceOrientationEvent) {
            throw new Exception('IMU not present.');
        }
    }

    get gyroscopeStream() {

        var acc = {
            x:0,
            y:0,
            z:0
        };

        var x_0 = $V([acc.x, acc.y, acc.z]); //vector. Initial accelerometer values

        //P prior knowledge of state
        var P_0 = $M([
            [1,0,0],
            [0,1,0],
            [0,0,1]
        ]);

        //identity matrix. Initial covariance. Set to 1
        var F_k = $M([
            [1,0,0],
            [0,1,0],
            [0,0,1]
        ]);

        //identity matrix. How change to model is applied. Set to 1
        var Q_k = $M([
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ]); //empty matrix. Noise in system is zero

        var KM = new KalmanModel(x_0,P_0,F_k,Q_k);

        var z_k = $V([acc.x, acc.y, acc.z]); //Updated accelerometer values



        var H_k = $M([
            [1,0,0],
            [0,1,0],
            [0,0,1]
        ]); //identity matrix. Describes relationship between model and observation



        var R_k = $M([
            [2,0,0],
            [0,2,0],
            [0,0,2]
        ]); //2x Scalar matrix. Describes noise from sensor. Set to 2 to begin
        var KO = new KalmanObservation(z_k,H_k,R_k);

        var gyroscopeStream = Rx.Observable.fromEvent(window, 'deviceorientation');

        gyroscopeStream.subscribe((event) => {
            KO.z_k = $V([event.alpha, event.beta, event.gamma]); //vector to be new reading from x, y, z
            KM.update(KO);

            event.kalmanAlpha = KM.x_k.elements[0];
            event.kalmanBeta = KM.x_k.elements[0];
            event.kalmanGamma = KM.x_k.elements[0];

            //console.log(KM.x_k.elements[0], KM.x_k.elements[1], KM.x_k.elements[2]); //result
            //console.log(acc.x-KM.x_k.elements[0], acc.y-KM.x_k.elements[1], acc.z-KM.x_k.elements[2]); //diff
        });

        gyroscopeStream.subscribeOnError((event) => {

        });

        return gyroscopeStream;
    }

    get accelerometerStream() {
        var accelerometerStream = Rx.Observable.fromEvent(window, 'devicemotion');
        accelerometerStream.subscribe((event) => {
            // Get acceleration from the results
            var acceleration = event.acceleration;

            // Get acceleration including gravity from the results
            var acceleration2 = event.accelerationIncludingGravity;

            // Get rotation rate from the results
            var rotation = event.rotationRate;

            // Get refresh interval from the results
            var info = event.interval;
        });

        accelerometerStream.subscribeOnError((event) => {

        });

        return accelerometerStream;
    }


}