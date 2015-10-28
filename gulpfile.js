'use strict';

var gulp    = require('gulp'),
    eslint  = require('gulp-eslint'),
    mocha   = require('gulp-mocha'),
    concat  = require('gulp-concat-sourcemap'),
    del     = require('del'),
    nodeify = require('module.nodeify');

gulp.task('lint', function () {
  var src = [
    './src/**/*.js',
    './test/**/*.js'
  ];

  return gulp.src(src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('clean', function () {
  return del('dist');
});

gulp.task('nodeify', ['lint', 'clean'], function () {
  return gulp.src('src/**/*.js')
    .pipe(nodeify)
    .pipe(gulp.dest('dist/node'));
});

gulp.task('test', ['nodeify'], function () {
  return gulp.src('test/**/*.js')
    .pipe(mocha());
});

gulp.task('dist', ['test'], function () {
  return gulp.src('./src/**/*.js')
    .pipe(concat('request.js', { sourcesContent: true }))
    .pipe(gulp.dest('./dist/browser'));
});
