if (typeof exports == 'undefined') exports = {};

exports.getConfig = function () {
    return {
        modules: ['example'],
        viewSelector: '#container',
        default: {
            module: 'example',
            controller: 'default'
        },
        libs: [
            {
                name: 'jquery',
                js: ['vendor/jquery-2.2.3.min.js']
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
                scss: ['module/example/styles.scss',],
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