var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var ejs = require('gulp-ejs');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var uglify = require('gulp-uglify');
// var validator = require('gulp-html');
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

// gulp.task('validator', function () {
//   return gulp.src('dest/**/*.html')
//     .pipe(validator());
// });

gulp.task('sass', function (done) {
  return gulp.src('src/sass/**/*.scss')
    .pipe(plumber(plumberRequest))
    .pipe(scsslint({
      'config': '.scsslint.yml',
    }))
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dest/css'));
    done();
});

gulp.task('cname', function (done) {
  gulp.src('src/CNAME')
    .pipe(gulp.dest('dest/'));
    done();
});

gulp.task('vendor', function (done) {
  gulp.src('node_modules/sanitize.css/dist/*')
    .pipe(gulp.dest('dest/css'));
  gulp.src('node_modules/jquery/dist/*')
    .pipe(gulp.dest('dest/js/vendor'));
  gulp.src('node_modules/masonry-layout/dist/*')
    .pipe(gulp.dest('dest/js/vendor'));
  gulp.src('node_modules/jquery-lazyload/*.js')
    .pipe(gulp.dest('dest/js/vendor'));
    done();
});

gulp.task('js', function (done) {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber(plumberRequest))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dest/js/'));
    done();
});

gulp.task('ejs', function (done) {
  return gulp.src(['src/ejs/**/*.ejs', '!src/ejs/**/_*.ejs'])
    .pipe(plumber(plumberRequest))
    .pipe(ejs(ejsOptions))
    .pipe(minifyHTML())
    .pipe(gulp.dest('dest/'));
    done();
});

gulp.task('img', function (done) {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('dest/img/'));
    done();
});


gulp.task('clean',function(done){
  return gulp.src([
    'dest',
    'src/img/portfolios',
    'src/img/creator',
    'src/img/interviews',
    'src/img/thumbnails',
  ]).pipe(clean());
  console.log('Clean completed');
  done();
});

gulp.task('build', gulp.series('cname','vendor', 'sass', 'ejs', 'img','js', function (done) {
// gulp.task('build', ['cname','vendor', 'sass', 'ejs', 'img','js', 'validator'], function () {
  console.log('done');
    done();
}));

gulp.task('watch', function(){

  var changeHandler = function(event){
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  }

  var taskSass = gulp.watch('src/sass/**/*.scss', gulp.task('sass'));
  taskSass.on( 'change', changeHandler );

  var taskEjs = gulp.watch('src/ejs/**/*.ejs', gulp.task('ejs'));
  taskEjs.on( 'change', changeHandler );

  var taskImg = gulp.watch('src/img/**/*', gulp.task('img'));
  taskImg.on( 'change', changeHandler );

  var taskJs = gulp.watch('src/js/**/*', gulp.task('js'));
  taskJs.on( 'change', changeHandler );

});
