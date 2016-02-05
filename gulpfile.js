var browserify = require('browserify');
var gulp = require('gulp');
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

gulp.task("babelify", function () {
  var b = browserify({
    entries: 'www/app.js',
    debug: true
  }).transform("babelify", {presets: ["es2015", "react"]});

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
});

gulp.task('copy-www', function () {
  return gulp.src(['www/**/*.{css,html,php}'])
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['copy-www', 'babelify']);

gulp.task('watch', ['default'], function () {
  gulp.watch('www/**/*.js', ['babelify']);
  gulp.watch('www/**/*.{css,html,php}', ['copy-www']);
});
