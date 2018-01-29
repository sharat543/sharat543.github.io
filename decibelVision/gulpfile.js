var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var utils = require('gulp-util');
var log = utils.log; // Can be used for logging

gulp.task('vendors', function () {
	// Get all bower components, but use the minified file
	// if it already exists
	var bowerFiles = require('main-bower-files');
	var files = bowerFiles().map(convertFile);

	// Create a filter for files that are not minified
	var filter = require('gulp-filter');
	var unminified = filter(function (file) {
		var basename = path.basename(file.path);
		var min = basename.indexOf('.min') === -1;
		return min;
	});

	var concat = require('gulp-concat');
	//var uglify = require('gulp-uglify');

	gulp.src(files)
		//.pipe(unminified) // Filter out minified files
		//.pipe(uglify()) // Minify unminified files
		//.pipe(unminified.restore()) // Restore minified files
		.pipe(concat('vendors.js')) // Concat all files into one file
		.pipe(gulp.dest('dist')); // Write to destination folder
});

/**
 * Convert the path to a JS file to the minified version, if it exists.
 *
 * @param file {String} The full path to the JS file
 * @returns {String} The minified file path if it exists, otherwise the
 *                   original file path
 */
function convertFile(file) {
	var ext = path.extname(file);
	var min = file.substr(0, file.length - ext.length);
	min += '.min' + ext;
	return fs.existsSync(min) ? min : file;
}
