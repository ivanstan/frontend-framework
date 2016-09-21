require('any-promise/register/bluebird');
require('any-promise/register')('bluebird', {Promise: require('bluebird')});

var fs = require('fs'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    replace = require('gulp-replace-task'),
    packageJson = require('./package.json'),
    NodeFramework = require('./core/NodeFramework.js'),
    jsdox = require("jsdox");

gulp.remote = require('gulp-remote-src');
gulp.merge = require('merge2');

var config = JSON.parse(fs.readFileSync('bootstrap.json', 'utf8'));
var resources = NodeFramework.setConfig(config).getResources();

var remoteInternalStylesheet = resources['remoteInternalStylesheet'],
    remoteExternalStylesheet = resources['remoteExternalStylesheet'],
    localInternalStylesheet = resources['localInternalStylesheet'],
    localExternalStylesheet = resources['localExternalStylesheet'];
var remoteInternalJavascript = resources['remoteInternalJavascript'],
    remoteExternalJavascript = resources['remoteExternalJavascript'],
    localInternalJavascript = resources['localInternalJavascript'],
    localExternalJavascript = resources['localExternalJavascript'];
var localJavascript = resources['localJavascript'],
    localStylesheet = resources['localStylesheet'],
    remoteStylesheet = resources['remoteStylesheet'],
    remoteJavascript = resources['remoteJavascript'];

gulp.task('stylesheet', function () {

    gulp.src(localInternalStylesheet)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('stylesheet-dev.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./build'));

});

gulp.task('development', function () {

    gulp.src('assets/index.html')
        .pipe(replace({
            patterns: [
                {
                    match: /\{config\}/g,
                    replacement: function () {
                        var DI = config;
                        delete DI.build;

                        return JSON.stringify(DI);
                    }
                },
                {
                    match: /\{javascript\}/g,
                    replacement: function () {
                        var result = '',
                            uri,
                            resource = [];

                        resource = resource.concat(remoteJavascript);
                        resource = resource.concat(localJavascript);

                        for (var i in resource) {
                            uri = resource[i].replace('https://', '//');
                            uri = uri.replace('http://', '//');

                            result += '<script src="' + uri + '"></script>\n';
                        }

                        return result;
                    }
                },
                {
                    match: /\{stylesheet\}/g,
                    replacement: function () {
                        var result = '',
                            uri,
                            resource = ['build/stylesheet-dev.css'];

                        resource = resource.concat(remoteStylesheet);

                        for (var i in resource) {
                            uri = resource[i].replace('https://', '//');
                            uri = uri.replace('http://', '//');

                            result += '<link rel="stylesheet" type="text/css" href="' + uri + '">\n';
                        }

                        return result;
                    }
                }
            ]
        }))
        .pipe(rename('index-dev.html'))
        .pipe(gulp.dest('./'));
});

gulp.task('production', function () {

    gulp.merge(gulp.remote(remoteInternalJavascript), gulp.src(localInternalJavascript))
        .pipe(sourcemaps.init())
        .pipe(concat('javascript.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build'));

    gulp.merge(gulp.remote(remoteInternalStylesheet), gulp.src(localInternalStylesheet))
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('stylesheet.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./build'));

    gulp.src('assets/index.html')
        .pipe(replace({
            patterns: [
                {
                    match: /\{config\}/g,
                    replacement: function () {
                        var DI = config;
                        delete DI.libs;

                        return JSON.stringify(DI);
                    }
                },
                {
                    match: /\{javascript\}/g,
                    replacement: function () {
                        var result = '',
                            uri,
                            resource = ['build/javascript.js'];

                        resource = resource.concat(remoteExternalJavascript);
                        resource = resource.concat(localExternalJavascript);

                        for (var i in resource) {
                            uri = resource[i].replace('https://', '//');
                            uri = uri.replace('http://', '//');

                            result += '<script src="' + uri + '"></script>\n';
                        }

                        return result;
                    }
                },
                {
                    match: /\{stylesheet\}/g,
                    replacement: function () {
                        var result = '',
                            uri,
                            resource = ['build/stylesheet.css'];

                        resource = resource.concat(remoteExternalStylesheet);
                        resource = resource.concat(localExternalStylesheet);

                        for (var i in resource) {
                            uri = resource[i].replace('https://', '//');
                            uri = uri.replace('http://', '//');

                            result += '<link rel="stylesheet" type="text/css" href="' + uri + '">\n';
                        }

                        return result;
                    }
                }
            ]
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./'));
});

gulp.task('framework', function () {
    //var lib = NodeFramework.setConfig(config).getLibrary('framework');
    //
    //console.log(lib);
    //
    //gulp.src(lib.javascript)
    //    .pipe(concat('frontend-framework-' + packageJson.version + '.js'))
    //    .pipe(gulp.dest('./build'));
});

gulp.task('docs', function () {
    var jsdox = require("jsdox");

    jsdox.generateForDir('./core', './module/example/assets/docs', './assets/templates', function () {
    });
    jsdox.generateForDir('./core/service', './module/example/assets/docs', './assets/templates', function () {
    });
});

gulp.task('build', function () {
    gulp.start(['development', 'production', 'framework', 'docs']);
});

gulp.task('watch', function () {
    gulp.watch(localStylesheet, ['stylesheet']);
});