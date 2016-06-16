class Astro {

    /**
     * Convert Geocentric-Equatorial (Cartesian) to Right Ascension-Declination (Polar) Coordinate system.
     *
     * @param cart
     * @returns {{ra: number, dec: number, d: number}}
     *          α - Right Ascension (radians),
     *          β - Declination (radians), respectively,
     *          d - Distance (unit given in arguments),
     * @constructor
     */
    static CartToPolar(cart) {
        var r = Math.sqrt(Math.pow(cart.x, 2) + Math.pow(cart.y, 2) + Math.pow(cart.z, 2));

        return {
            ra: Math.atan(cart.y / r),
            dec: Math.acos(cart.z / r),
            d: r
        };
    }

    static PolarToCart(polar) {
        
        return {
            x: polar.d * Math.cos(polar.dec) * Math.cos(polar.ra),
            y: polar.d * Math.cos(polar.dec) * Math.sin(polar.ra),
            z: polar.d * Math.sin(polar.dec)
        }
    }

    static rad2deg(rad) {
        return rad * (180 / Math.PI);
    }

    static deg2rad(deg) {
        return deg * Math.PI / 180;
    }

    /**
     * Convert Geocentric-Equatorial (Cartesian) to Mathematical Cartesian, suitable for use in THREE.js
     *
     * @param vector
     * @returns {{x: number, y: number, z: number}}
     */
    static fromGeocentric(vector) {

        return {
            x: vector.x,
            y: vector.z,
            z: vector.y
        }
    }
}