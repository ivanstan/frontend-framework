require('any-promise/register/bluebird');
require('any-promise/register')('bluebird', {Promise: require('bluebird')});

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    inject = require('gulp-inject'),
    packageJson = require('./package.json'),
    bootstrap = require('./bootstrap.js'),
    NodeFramework = require('./core/NodeFramework.js'),
    sourceJs = [],
    sourceScss = [];

NodeFramework.setConfig(bootstrap.getConfig());
var libs = NodeFramework.resolveDependencies('dependencies');

for (var i in libs) {

    if (libs[i].hasOwnProperty('scss')) {
        sourceScss = sourceScss.concat(libs[i].scss);
    }

    if (libs[i].hasOwnProperty('js')) {
        sourceJs = sourceJs.concat(libs[i].js);
    }
}

gulp.task('styles', function () {
    gulp.src(sourceScss)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./assets'));
});

gulp.task('js', function () {
    gulp.src(sourceJs)
        .pipe(concat('javascript.js'))
        .pipe(gulp.dest('./assets'));
});

gulp.task('framework', function () {
    gulp.src(NodeFramework.getLibrary('framework'))
        .pipe(concat('frontend-framework-' + packageJson.version + '.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('development', function () {

    gulp.src('assets/index.html')
        .pipe(inject(gulp.src(sourceJs.concat(['assets/styles.css']), {read: false}), {
            relative: false,
            addRootSlash: false
        }))
        .pipe(rename('index-dev.html'))
        .pipe(gulp.dest('./'));
});

gulp.task('production', function () {

    gulp.src('assets/index.html')
        .pipe(inject(gulp.src(['assets/javascript.js', 'assets/styles.css'], {read: false}), {
            relative: false,
            addRootSlash: false
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./'));
});

gulp.task('build', function () {
    gulp.start(['styles', 'js', 'framework', 'development', 'production']);
});

gulp.task('watch', function () {
    gulp.watch(sourceScss, ['styles']);
});