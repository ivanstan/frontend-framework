var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

var cssSources = [
    'module/**/*.scss',
    'vendor/bootstrap/scss/bootstrap.scss',
    'vendor/toastr/toastr.scss',
    'vendor/simple-sidebar.scss',
    'vendor/font-awesome/scss/font-awesome.scss'
];

gulp.task('styles', function () {
    gulp.src(cssSources)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    gulp.watch(cssSources, ['styles']);
});