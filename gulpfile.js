"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var maps = require('gulp-sourcemaps');

var appSourceFiles = ['js/init.js', 'js/array.js', 'js/models.js', 'js/controllers.js', 'js/app.js'];
var vendorSourceFiles = ['js/vendor/bandjs/band.min.js', 'js/vendor/vextab/vextab-div.js'];

/*
* tasks to build for production
*/
gulp.task('concatScripts', function(){
	return gulp.src(vendorSourceFiles.concat(appSourceFiles))
		.pipe(maps.init())
		.pipe(concat('app.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('scripts'));
});

gulp.task('minifyScripts', ['concatScripts'], function(){
	return gulp.src('scripts/app.js')
		.pipe(uglify())
		.pipe(rename('app.min.js'))
		.pipe(gulp.dest('scripts'));
});

/*
* tasks to build for development since it is so slow to compile vendor source files
*/
gulp.task('concatScriptsDev', function(){
	return gulp.src(appSourceFiles)
		.pipe(maps.init())
		.pipe(concat('app.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('scripts'));
});

/*
* Tasks to build or watch for development only
*/
gulp.task('watchScripts', function(){
	gulp.watch('js/**/*.js', ['concatScriptsDev']);
});
gulp.task('buildDev', ['concatScriptsDev']);

/*
* Default is to build for production
*/
gulp.task('build', ['minifyScripts']);
gulp.task('default', ['build']);
