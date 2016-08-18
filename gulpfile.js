var fs = require('fs');
var gulp  = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var dirSync = require( 'gulp-directory-sync' );
var config = require('./config');
var ini = require('ini');

var path = process.env.HOME + '/.aws/credentials'
var creds = ini.parse(fs.readFileSync(path, 'utf-8'))
console.log(creds['codegophers'])
var s3 = require('gulp-s3-upload')(creds['codegophers']);

gulp.task('dev', [
  'build-css',
  'copy-html',
  'copy-media',
  'copy-js',
  'copy-img',
  'copy-vendor',
  'watch',
]);

gulp.task('build-css', function() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'));
});

gulp.task('copy-html', function() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build/'));
});

gulp.task('copy-media', function() {
  return gulp.src('src/media/*')
    .pipe(gulp.dest('build/media/'));
});

gulp.task('copy-js', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(dirSync('src/js/', 'build/js/', { printSummary: true }))
});

gulp.task('copy-img', function() {
  return gulp.src('src/img/**/*')
    .pipe(dirSync('src/img/', 'build/img/', { printSummary: true }))
});

gulp.task('copy-vendor', function() {
  return gulp.src('src/vendor/**/*')
    .pipe(dirSync('src/vendor/', 'build/vendor/', { printSummary: true }))
});

gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['build-css']);
  gulp.watch('src/*.html', ['copy-html']);
  gulp.watch('src/media/*', ['copy-media']);
  gulp.watch('src/js/**/*.js', ['copy-js']);
  gulp.watch('src/img/*', ['copy-img']);
  gulp.watch('src/vendor/**/*', ['copy-vendor']);
});

gulp.task('deploy', function() {
  gulp.src("./build/**")
    .pipe(s3({
      Bucket: config.s3bucket,
      ACL: 'public-read',
      keyTransform: function(name) {
        return config.folder + '/' + name
      }
    }, {
      maxRetries: 5
    }));
});

gulp.task('build', [
  'build-css',
  'copy-html',
  'copy-media',
  'copy-js',
  'copy-img',
  'copy-vendor'
]);
