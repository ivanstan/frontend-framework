module.exports = function (config) {
    var nodeFramework = require('../core/NodeFramework.js');
    var fs = require('fs');
    var appConfig = JSON.parse(fs.readFileSync('bootstrap.json', 'utf8'));

    var settings = {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser

        files: [],

        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    };

    nodeFramework.setConfig(appConfig);
    var libs = nodeFramework.resolveDependencies('dependencies');
    for (var i in libs) {
        if (libs[i].hasOwnProperty('js')) {
            for(var j in libs[i].js) {
                settings.files.push(libs[i].js[j]);
            }
        }
    }

    settings.files.push('tests/framework.js');

    config.set(settings);
};
