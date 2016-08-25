'use strict';

var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    maps        = require('gulp-sourcemaps'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream');

gulp.task('browserify', function() {
    return browserify('js/app.js').bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('compileSass', function() {
  return gulp.src("scss/application.scss")
      .pipe(maps.init())
      .pipe(sass())
      .pipe(maps.write('./'))
      .pipe(gulp.dest('css'));
});

gulp.task('watchFiles', function() {
  gulp.watch('scss/*.scss', ['compileSass']);
  gulp.watch('js/app.js', ['browserify']);
});

gulp.task('serve', ['watchFiles', 'browserify', 'compileSass']);
