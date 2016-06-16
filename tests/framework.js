describe('Framework', function () {

    it('should parse route', function () {
        window.classes = {};
        App = new Application(exports.getConfig());

        var route = new Route('default/default');

        expect(route.controller).toBe('default');
    });

});