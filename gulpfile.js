var gulp = require('gulp'),
    jasmine = require('gulp-jasmine');

var paths = {
    src: 'src/**/*.js',
    specs: 'specs/**/*.spec.js'
};

gulp.task('test', function() {
    return gulp.src(paths.specs)
        .pipe(jasmine());
});

gulp.task('watch-tests', function() {
    gulp.watch([paths.src, paths.specs], ['test']);
});
