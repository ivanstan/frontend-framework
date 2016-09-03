require('any-promise/register/bluebird');
require('any-promise/register')('bluebird', {Promise: require('bluebird')});

var fs            = require('fs'),
    gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    concat        = require('gulp-concat'),
    cleanCSS      = require('gulp-clean-css'),
    rename        = require('gulp-rename'),
    replace       = require('gulp-replace-task'),
    packageJson   = require('./package.json'),
    NodeFramework = require('./core/NodeFramework.js'),
    gutil         = require('gulp-util'),
    localJs       = [],
    localScss     = [],
    remoteScss    = [],
    remoteJs      = [];

var config = JSON.parse(fs.readFileSync('bootstrap.json', 'utf8'));
NodeFramework.setConfig(config);
var libraries = NodeFramework.resolveDependencies('dependencies');


var fileIndex, file;

for (var libraryIndex in libraries) {
    var library = libraries[libraryIndex];

    if (library.hasOwnProperty('stylesheet')) {
        for (fileIndex in library.stylesheet) {
            file = library.stylesheet[fileIndex];

            if (file.indexOf('//') == -1) {
                localScss.push(file);
            } else {
                remoteScss.push(file);
            }
        }
    }

    if (library.hasOwnProperty('javascript')) {
        for (fileIndex in library.javascript) {
            file = library.javascript[fileIndex];

            if (file.indexOf('//') == -1) {
                localJs.push(file);
            } else {
                remoteJs.push(file);
            }
        }
    }
}

gulp.task('stylesheet', function () {
    gulp.src(localScss)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('stylesheet.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./build'));
});

gulp.task('development', function () {

    gulp.src(localJs)
        .pipe(concat('javascript.js'))
        .pipe(gulp.dest('./build'));

    gulp.src('assets/index.html')
        .pipe(replace({
            patterns: [
                {
                    match      : /{config}/g,
                    replacement: function () {
                        var DI = config;
                        delete DI.build;

                        return JSON.stringify(DI);
                    }
                },
                {
                    match      : /{javascript}/g,
                    replacement: function () {
                        var result = '';

                        for (var i in remoteJs) {
                            result += '<script src="' + remoteJs[i] + '"></script>\n';
                        }

                        for (var j in localJs) {
                            result += '<script src="' + localJs[j] + '"></script>\n';
                        }

                        return result;
                    }
                },
                {
                    match      : /{stylesheet}/g,
                    replacement: function () {

                        var result = '',
                            style  = remoteScss.concat(['build/stylesheet.css']);

                        for (var i in style) {
                            result += '<link rel="stylesheet" type="text/css" href="' + style[i] + '">\n';
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
    gulp.start(['stylesheet', 'development', 'production', 'framework', 'docs']);
});

gulp.task('watch', function () {
    gulp.watch(localScss, ['stylesheet']);
});