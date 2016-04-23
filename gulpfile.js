var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    minifyHTML = require('gulp-minify-html'),
    jsonminify = require('gulp-jsonminify'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;



if ( process.env.NODE_ENV === 'development'){
  env = 'development';

} else {
  env = 'production';
}



if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

gulp.task('log', function() {
  gutil.log('This is what the env variable is set as: ' + env)
  gutil.log('This is what the NODE_ENV is set as: ' + process.env.NODE_ENV)
  gutil.log('This is what the outputDir is set as: ' + outputDir)
});
coffeeSources = ['components/coffee/*.coffee'];
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'

];

sassSources = ['components/sass/*.scss'];
htmlSources = [outputDir + 'index.html'];
jsonSources = [outputDir + '/js/*.json'];

gulp.task('log', function() {
  gutil.log('This is what the env variable is set as: ' + env)
  gutil.log('This is what the NODE_ENV is set as: ' + process.env.NODE_ENV)
  gutil.log('This is what the outputDir is set as: ' + outputDir)
  gutil.log('This is what the htmlSources is set as: ' + htmlSources)
  gutil.log('This is what the jsonSources is set as: ' + jsonSources)
});

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
  .pipe(coffee({ bare: true })
    .on('error', gutil.log))
  .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())

});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      css: outputDir + 'css',
      image: outputDir + 'images',
      style: sassStyle,
      comments: true
    }))
    .pipe(connect.reload())
    .on('error', gutil.log)
    .pipe(gulp.dest(outputDir +'css'))


});



gulp.task('watch', function(){
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch(sassSources, ['compass']);
  gulp.watch('builds/development/*.html', ['html']);
  gulp.watch('builds/development/js/*.json', ['json']);
  gulp.watch('builds/development/images/**/*.*', ['images']);
  
});

gulp.task('connect', function(){
  connect.server({
    root: outputDir,
    livereload: true
  });
});

gulp.task('html', function() {
  gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(connect.reload())
});

gulp.task('json', function() {
  gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env === 'production', jsonminify()))
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
    .pipe(connect.reload())
});

gulp.task('images', function() {
  gulp.src('builds/development/images/**/*.*')
    .pipe(gulpif(env === 'production', imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false}],
      use: [pngcrush()]
    })))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
    .pipe(connect.reload())
});

gulp.task('default', ['log', 'images', 'html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);