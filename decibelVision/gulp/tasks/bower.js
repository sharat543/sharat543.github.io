var gulp         = require('gulp');
var bowerMain    = require('main-bower-files');
var concat       = require('gulp-concat');
var less         = require('gulp-less');
var sourcemaps   = require('gulp-sourcemaps');
var handleErrors = require('../util/handleErrors');
var gulpFilter   = require('gulp-filter');
var rename       = require('gulp-rename');
var uglify       = require('gulp-uglify');
var minifyCSS    = require('gulp-minify-css');
var flatten      = require('gulp-flatten');

gulp.task('bower', function() {

  var jsFilter = gulpFilter('*.js')
  var cssFilter = gulpFilter('*.css')
  var fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf'])
  var imageFilter = gulpFilter(['*.gif', '*.png', '*.svg', '*.jpg', '*.jpeg'])

  return gulp.src(bowerMain())

    // JS
    .pipe(jsFilter)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(uglify())
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest('./build/js'))
    .pipe(jsFilter.restore())

    // CSS
    .pipe(cssFilter)
    .pipe(concat('lib.css'))
    .pipe(gulp.dest('./build/css'))
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest('./build/css'))
    .pipe(cssFilter.restore())

    // FONTS
    .pipe(fontFilter)
    .pipe(flatten())
    .pipe(gulp.dest('./build/fonts'))
    .pipe(fontFilter.restore())

    // IMAGES
    .pipe(imageFilter)
    .pipe(flatten())
    .pipe(gulp.dest('./build/images'))
    .pipe(imageFilter.restore())

})
