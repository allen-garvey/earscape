"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var maps = require('gulp-sourcemaps');
var sass = require('gulp-sass');

var appSourceFiles = ['js/init.js', 'js/array.js', 'js/models.js', 'js/controllers.js', 'js/app.js'];
var vendorSourceFiles = ['js/vendor/bandjs/band.min.js', 'js/vendor/vextab/vextab-div.js'];

var SASS_SOURCE_DIR = 'sass/';
var STYLES_DEST_DIR = 'styles/';
var SASS_OPTIONS = {
  errLogToConsole: true,
  // sourceComments: true, //turns on line number comments 
  outputStyle: 'compressed' //options: expanded, nested, compact, compressed
};

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

gulp.task('sass', function() {
    gulp.src(SASS_SOURCE_DIR + '**/*.scss')
        .pipe(sass(SASS_OPTIONS).on('error', sass.logError))
        .pipe(gulp.dest(STYLES_DEST_DIR));
});
gulp.task('watchSass',function() {
    gulp.watch(SASS_SOURCE_DIR + '**/*.scss', ['sass']);
});


/*
* Default is to build for production
*/
gulp.task('build', ['minifyScripts', 'sass']);
gulp.task('default', ['build']);
