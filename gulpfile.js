var gulp = require('gulp');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var autoPrefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var babel = require('gulp-babel');

// var declare = require('gulp-declare');
// var wrap = require('gulp-wrap');

//image compression
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

//file paths
var DIST_PATH = '.'
var THEME_PATH = 'wp-content/themes/<YOUR_THEME_NAME>/'
var CUSTOM_SCRIPTS_PATH = THEME_PATH + 'scripts/**/*.js';
var SCRIPTS_PATH = THEME_PATH + 'js/**/*.js';
var CSS_PATH = THEME_PATH + 'css/**/*.css';
var SASS_PATH = THEME_PATH + 'scss/**/*.scss';
var IMAGES_PATH = THEME_PATH + 'images/**/*.{jpg,jpeg,png,svg,gif}';


//styles for scss
gulp.task('styles', function() {
    console.log('starting styles task');
    console.log(THEME_PATH + 'css');

    return gulp.src(THEME_PATH + 'scss/style.scss')
        .pipe(plumber(function (err) {
            console.log('styles task error');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(autoPrefixer({
            browsers: ['last 2 versions', 'ie 8']
        }))
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(sourcemaps.write())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest(THEME_PATH + '/css'));
});


gulp.task('scripts', function () {
    console.log('starting scripts task');

    return gulp.src(CUSTOM_SCRIPTS_PATH)
        .pipe(plumber(function (err) {
            console.log('scripts task error');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(concat('site.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(THEME_PATH  + '/js'));
});

gulp.task('images', function (){
    return gulp.src(IMAGES_PATH)
        .pipe(imagemin(
            [
                imagemin.gifsicle(),
                imagemin.jpegtran(),
                imagemin.optipng(),
                imagemin.svgo(),
                imageminPngquant(),
                imageminJpegRecompress()
            ]
        ))
        .pipe(gulp.dest(THEME_PATH + '/img'));
});

gulp.task('watch', function () {
    gulp.watch([SASS_PATH], ['styles']);
    gulp.watch([CUSTOM_SCRIPTS_PATH], ['scripts']);
})

gulp.task('default', ['images', 'styles', 'scripts'], function () {
    console.log('starting default task');
});
