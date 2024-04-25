const gulp = require('gulp');
const connect = require('gulp-connect');

gulp.task('connect', function() {
    connect.server({
        root: '.',
        livereload: false,
        port: 3000,
    });
});

gulp.task('index', function() {
    return gulp.src('./index.html')
        .pipe(gulp.dest('.'))
        .pipe(connect.reload());
});

gulp.task('other-files', function() {
    return gulp.src('./**/*')
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch('./**/*', gulp.series('other-files'));
});

gulp.task('default', gulp.parallel('connect', 'watch'));
