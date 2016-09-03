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
    gutil = require('gulp-util');

gulp.remote = require('gulp-remote-src');
gulp.merge = require('merge2');

var config = JSON.parse(fs.readFileSync('bootstrap.json', 'utf8'));
NodeFramework.setConfig(config);
var libraries = NodeFramework.resolveDependencies('dependencies');

var fileIndex,
    file;

var remoteInternalStylesheet = [],
    remoteExternalStylesheet = [],
    localInternalStylesheet = [],
    localExternalStylesheet = [];

var remoteInternalJavascript = [],
    remoteExternalJavascript = [],
    localInternalJavascript = [],
    localExternalJavascript = [];

var localJavascript = [],
    localStylesheet = [],
    remoteStylesheet = [],
    remoteJavascript = [];

for (var libraryIndex in libraries) {
    var library = libraries[libraryIndex];
    var pack = typeof libraries[libraryIndex]['package'] != 'undefined' ? libraries[libraryIndex]['package'] : true;

    if (library.hasOwnProperty('stylesheet')) {
        for (fileIndex in library.stylesheet) {
            file = library.stylesheet[fileIndex];

            if (file.indexOf('//') == -1) {
                if (pack) {
                    localInternalStylesheet.push(file);
                } else {
                    localInternalStylesheet.push(file);
                }
                localStylesheet.push(file);
            } else {
                if (pack) {
                    remoteInternalStylesheet.push(file);
                } else {
                    remoteExternalStylesheet.push(file);
                }
                remoteStylesheet.push(file);
            }
        }
    }

    if (library.hasOwnProperty('javascript')) {
        for (fileIndex in library.javascript) {
            file = library.javascript[fileIndex];

            if (file.indexOf('//') == -1) {
                if (pack) {
                    localInternalJavascript.push(file);
                } else {
                    localExternalJavascript.push(file);
                }
                localJavascript.push(file);
            } else {
                if (pack) {
                    remoteInternalJavascript.push(file);
                } else {
                    remoteExternalJavascript.push(file);
                }
                remoteJavascript.push(file);
            }
        }
    }
}

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
                    match: /{config}/g,
                    replacement: function () {
                        var DI = config;
                        delete DI.build;

                        return JSON.stringify(DI);
                    }
                },
                {
                    match: /{javascript}/g,
                    replacement: function () {
                        var result = '';

                        for (var i in remoteJavascript) {
                            result += '<script src="' + remoteJavascript[i] + '"></script>\n';
                        }

                        for (var j in localJavascript) {
                            result += '<script src="' + localJavascript[j] + '"></script>\n';
                        }

                        return result;
                    }
                },
                {
                    match: /{stylesheet}/g,
                    replacement: function () {
                        var result = '',
                            stylesheet = remoteStylesheet.concat(['build/stylesheet-dev.css']);

                        for (var i in stylesheet) {
                            result += '<link rel="stylesheet" type="text/css" href="' + stylesheet[i] + '">\n';
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
                    match: /{config}/g,
                    replacement: function () {
                        var DI = config;
                        delete DI.libs;

                        return JSON.stringify(DI);
                    }
                },
                {
                    match: /{javascript}/g,
                    replacement: function () {
                        var result = '<script src="build/javascript.js"></script>\n';

                        for (var i in remoteExternalJavascript) {
                            result += '<script src="' + remoteExternalJavascript[i] + '"></script>\n';
                        }

                        for (var j in localExternalJavascript) {
                            result += '<script src="' + localExternalJavascript[i] + '"></script>\n';
                        }

                        return result;
                    }
                },
                {
                    match: /{stylesheet}/g,
                    replacement: function () {
                        var result = '<link rel="stylesheet" type="text/css" href="build/stylesheet.css">\n';

                        for (var i in remoteExternalStylesheet) {
                            result += '<link rel="stylesheet" type="text/css" href="' + remoteExternalStylesheet[i] + '">\n';
                        }

                        for (var j in localExternalStylesheet) {
                            result += '<link rel="stylesheet" type="text/css" href="' + localExternalStylesheet[i] + '">\n';
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
    var lib = NodeFramework.getLibrary(libraries, 'framework');

    gulp.src(lib.javascript)
        .pipe(concat('frontend-framework-' + packageJson.version + '.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('docs', function () {
    var jsdox = require("jsdox");

    jsdox.generateForDir('./core', './module/example/assets/docs', './assets/templates', function () {
    });
});

gulp.task('build', function () {
    gulp.start(['development', 'production', 'framework', 'docs']);
});

gulp.task('watch', function () {
    gulp.watch(localStylesheet, ['stylesheet']);
});