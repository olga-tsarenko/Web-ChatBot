const gulp = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();

gulp.task('compile-less', function() {
    return gulp.src('./public/src/*.less')
        .pipe(less().on('error', function(err) {
            console.error(err.message);
            this.emit('end');
        }))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./public/'))
        .pipe(browserSync.stream());
});


gulp.task('watch-less', function() {
    gulp.watch('./public/src/*.less', gulp.series('compile-less'));
});


gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./public/"
        }
    });

    gulp.watch("./public/src/*.less", gulp.series('compile-less'));
    gulp.watch("./public/*.html").on("change", browserSync.reload);
});

// run`gulp`
gulp.task('default', gulp.parallel('watch-less', 'serve'));
