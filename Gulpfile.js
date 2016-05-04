var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

var cssSources = [
    'assets/styles.scss',
];

var cssWatch = [
    'vendor/bootstrap/scss/bootstrap.scss',
    'assets/mixins.scss',
    'vendor/toastr/toastr.scss',
    'vendor/simple-sidebar.scss',
    'vendor/font-awesome/scss/font-awesome.scss',
    'module/bootstrap/styles.scss',
    'module/default/styles.scss'
]

gulp.task('styles', function () {
    gulp.src(cssSources)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./assets'));
});

gulp.task('watch', function () {
    gulp.watch(cssWatch, ['styles']);
});