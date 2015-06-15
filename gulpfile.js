var gulp = require('gulp');
var concat = require('gulp-concat');
var ejs = require('gulp-ejs');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var uglify = require('gulp-uglify');
var validator = require('gulp-html');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var clean = require('gulp-clean');

var plumberRequest = {
  errorHandler: notify.onError('Error: <%= error.message %>')
};

var ejsOptions = {
  EJS_ROOT: __dirname + "/src/ejs/",
  creators: require( "./src/json/creators.json" ),
  portfolios: require("./src/json/portfolios.json"),
  tags: require("./src/json/tags.json"),
  products: require("./src/json/products.json")
};

gulp.task('validator', function () {
  return gulp.src('dest/**/*.html')
    .pipe(validator());
});

gulp.task('sass', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(plumber(plumberRequest))
    .pipe(scsslint({
      'config': '.scsslint.yml',
    }))
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest('dest/css'));
});

gulp.task('cname', function () {
  gulp.src('src/CNAME')
    .pipe(gulp.dest('dest/'));
});

gulp.task('vendor', function () {
  gulp.src('node_modules/sanitize.css/dist/*')
    .pipe(gulp.dest('dest/css'));
  gulp.src('node_modules/jquery/dist/*')
    .pipe(gulp.dest('dest/js/vendor'));
  gulp.src('node_modules/masonry-layout/dist/*')
    .pipe(gulp.dest('dest/js/vendor'));
  gulp.src('node_modules/jquery-lazyload/*.js')
    .pipe(gulp.dest('dest/js/vendor'));
});

gulp.task('js', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber(plumberRequest))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dest/js/'));
});

gulp.task('ejs', function () {
  return gulp.src(['src/ejs/**/*.ejs', '!src/ejs/**/_*.ejs'])
    .pipe(plumber(plumberRequest))
    .pipe(ejs(ejsOptions))
    .pipe(minifyHTML())
    .pipe(gulp.dest('dest/'));
});

gulp.task('img', function () {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('dest/img/'));
});


gulp.task('clean',function(){
  return gulp.src([
    'dest',
    'src/img/portfolios',
    'src/img/creators',
    'src/img/interviews',
    'src/img/thumbnails',
  ]).pipe(clean());
  console.log('Clean completed');
});

gulp.task('build', ['cname','vendor', 'sass', 'ejs', 'img','js', 'validator'], function () {
  console.log('done');
});

gulp.task('watch', function(){

  var changeHandler = function(event){
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  }

  var taskSass = gulp.watch('src/sass/**/*.scss', ['sass']);
  taskSass.on( 'change', changeHandler );

  var taskEjs = gulp.watch('src/ejs/**/*.ejs', ['ejs']);
  taskEjs.on( 'change', changeHandler );

  var taskImg = gulp.watch('src/img/**/*', ['img']);
  taskImg.on( 'change', changeHandler );

  var taskJs = gulp.watch('src/js/**/*', ['js']);
  taskJs.on( 'change', changeHandler );

});
