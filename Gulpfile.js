var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

gulp.task('styles', function() {
    gulp.src('module/**/style/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./'));
});

//Watch task
gulp.task('watch',function() {
    gulp.watch('module/**/style/*.scss',['styles']);
});