require('any-promise/register/bluebird');
require('any-promise/register')('bluebird', {Promise: require('bluebird')});

var fs = require('fs'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace-task'),
    packageJson = require('./package.json'),
    NodeFramework = require('./core/NodeFramework.js'),
    sourceJs = [],
    sourceScss = [];

var config = JSON.parse(fs.readFileSync('bootstrap.json', 'utf8'));
NodeFramework.setConfig(config);
var libs = NodeFramework.resolveDependencies('dependencies');

for (var i in libs) {

    if (libs[i].hasOwnProperty('scss')) {
        sourceScss = sourceScss.concat(libs[i].scss);
    }

    if (libs[i].hasOwnProperty('js')) {
        sourceJs = sourceJs.concat(libs[i].js);
    }
}

gulp.task('stylesheet', function () {
    gulp.src(sourceScss)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('stylesheet.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./build'));
});

gulp.task('javascript', function () {
    gulp.src(sourceJs)
        .pipe(concat('javascript.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('framework', function () {
    var lib = NodeFramework.getLibrary(libs, 'framework');
    
    gulp.src(lib.js)
        .pipe(concat('frontend-framework-' + packageJson.version + '.js'))
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

                        for(var i in sourceJs) {
                            result += '<script src="' + sourceJs[i] + '"></script>\n';
                        }

                        return result;
                    }
                },
                {
                    match: /{stylesheet}/g,
                    replacement: function () {
                        return '<link rel="stylesheet" type="text/css" href="build/stylesheet.css">\n';
                    }
                }
            ]
        }))
        .pipe(rename('index-dev.html'))
        .pipe(gulp.dest('./'));
});

gulp.task('production', function () {

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
                        var result = '';
                        var js = [
                            'build/javascript.js'
                        ];

                        for(var i in js) {
                            result += '<script src="' + js[i] + '"></script>\n';
                        }

                        return result;
                    }
                },
                {
                    match: /{stylesheet}/g,
                    replacement: function () {
                        return '<link rel="stylesheet" type="text/css" href="build/stylesheet.css">\n';
                    }
                }
            ]
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./'));
});

gulp.task('build', function () {
    gulp.start(['stylesheet', 'javascript', 'framework', 'development', 'production', 'docs']);
});

gulp.task('docs', function () {
    var jsdox = require("jsdox");

    jsdox.generateForDir('./core', './module/example/assets/docs', './assets/templates', function() {});
});

gulp.task('watch', function () {
    gulp.watch(sourceScss, ['stylesheet']);
});