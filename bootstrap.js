if (typeof exports == 'undefined') exports = {};

exports.getConfig = function () {
    return {
        modules: ['example'],
        viewSelector: '#container',
        default: {
            module: 'example',
            controller: 'default'
        },
        libs: [{
                name: 'framework',
                js: [
                    'core/Util.js',
                    'core/Exception.js',
                    'core/AjaxException.js',
                    'core/Module.js',
                    'core/Controller.js',
                    'core/Route.js',
                    'core/Storage.js',
                    'core/Application.js'
                ]
            }, {
                name: 'application',
                dependencies: ['framework'],
                scss: ['module/example/styles.scss'],
                js: ['bootstrap.js']
            }
        ]
    };
};

if (typeof window != 'undefined') {
    'use strict';
    window.classes = {};

    App = new Application(exports.getConfig());
}