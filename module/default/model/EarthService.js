class EarthService {

    constructor(selector) {
        this.satellites = {};
        this.lastTime = 0;

        this._element = $('#' + selector);
        var viewport = DefaultController.getViewportDimensions();

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setSize(viewport.width, viewport.height);
        this.renderer.setClearColor(0x263174, 1);

        this.resize = $(window).on('resize', () => {
            var viewport = DefaultController.getViewportDimensions();
            this.renderer.setSize(viewport.width, viewport.height);
        });

        this._element.html(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(90, viewport.width / viewport.height, 1, 1000);
        this.camera.position.set(EarthService.scale(4800 + Earth.radius(), 50, 0));
        // this.camera.position.set(0, 0, EarthService.scale(35786 + Earth.radius())); // from GEO
        // this.camera.position.set(0, 0, EarthService.scale(400 + Earth.radius())); // from LEO
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        // var pointLight = new THREE.PointLight(0xFFFFFF);
        // pointLight.position.set(0, 300, 300);
        // this.scene.add(pointLight);

        // var light = new THREE.DirectionalLight(0xffffff);
        // light.position.set(1, 1, 1);
        // this.scene.add(light);

        var light = new THREE.AmbientLight(0xFFFFFF); // soft white light
        this.scene.add(light);

        //this.controls = new THREE.OrbitControls(this.camera);
        //this.controls.damping = 0.2;
        //this.controls.addEventListener('change', () => {
        //    this.renderer.render(this.scene, this.camera);
        //});

        // if (Util.isDebug()) {
            var axisHelper = new THREE.AxisHelper(300);
            this.scene.add(axisHelper);
            // this.controls.enabled = false;
        // }

        this.createEarth();
        this.createEquatorialPlane();

        this.animate();
    }

    /**
     * Accept number expressed in kilometers.
     * Returns value scaled by certain factor.
     */
    static scale(value) {
        let factor = 0.0235;

        return value * factor;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    createEarth() {
        // set up the sphere vars
        var radius = EarthService.scale(Earth.radius()),
            segments = 48,
            rings = 48;

        // create the sphere's material
        var material = new THREE.MeshPhongMaterial();
        material.map = THREE.ImageUtils.loadTexture('assets/earth/earthmap.jpg');
        material.map.minFilter = THREE.LinearFilter;

        var geometry = new THREE.SphereGeometry(radius, segments, rings);
        var sphere = new THREE.Mesh(geometry, material);
        this.scene.add(sphere);
    }

    addSatellite(satellite, position) {
        position = Astro.fromGeocentric(position);
        if (typeof this.satellites[satellite.designator] == 'object') {
            //update position
        }

        let color = ColorService.hexToRGB(satellite.color);
        let material = new THREE.LineBasicMaterial({color: new THREE.Color(color.r, color.g, color.b)});
        let geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(
            EarthService.scale(position.x),
            EarthService.scale(position.y),
            EarthService.scale(position.z)
        ));
        let line = new THREE.Line(geometry, material);
        this.scene.add(line);

        this.satellites[satellite.designator] = satellite;
    }

    createEquatorialPlane() {
        var size = 300, step = 20;

        var geometry = new THREE.Geometry();
        var material = new THREE.LineBasicMaterial({color: 'white'});

        for (var i = -size; i <= size; i += step) {
            geometry.vertices.push(new THREE.Vector3(-size, 0, i));
            geometry.vertices.push(new THREE.Vector3(size, 0, i));
            geometry.vertices.push(new THREE.Vector3(i, 0, -size));
            geometry.vertices.push(new THREE.Vector3(i, 0, size));
        }

        var line = new THREE.Line(geometry, material, THREE.LinePieces);

        this.scene.add(line);
    }

    createLatLngLine(lat, lng) {
        var lineMaterial = new THREE.LineBasicMaterial({
            color: 0xFF0000
        });

        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(300, 0, 0));
        var line = new THREE.Line(geometry, lineMaterial);
        line.rotation.y = lat * Math.PI / 180;
        this.scene.add(line);
    }

    animate() {
        this.render();

        // request new frame
        requestAnimationFrame(() => {
            this.animate();
        });
    }


}