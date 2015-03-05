var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	browserify = require('gulp-browserify'),
	concat = require('gulp-concat');

var coffeeSources = ['components/coffee/tagline.coffee'];
var sassSources = ['components/sass/style.scss'];
var jsSources = [
	'components/scripts/pixgrid.js',
	'components/scripts/rclick.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];

gulp.task('default',['coffee', 'js', 'compass', 'watch', 'connect']);


gulp.task('coffee', function(){
	gulp.src(coffeeSources)
	.pipe (coffee({ bare:true })
		.on('error', gutil.log)
	)
	.pipe(gulp.dest('components/scripts'))

});

gulp.task('js', function(){
	gulp.src(jsSources)
	.pipe(concat('script.js'))
	.pipe(browserify())
	.pipe(gulp.dest('builds/development/js'))
	.pipe(connect.reload())

});

gulp.task('compass', function(){
	gulp.src(sassSources)
	.pipe(compass({
		sass:'components/sass',
		image:'builds/development/images',
		style:'expanded'
	})
	.on('error', gutil.log))
	.pipe(gulp.dest('builds/development/css'))
	.pipe(connect.reload())

});

gulp.task('watch', function(){
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);

});

gulp.task('connect', function (){
	connect.server({
		root:'builds/development/',
		livereload: true
	});
});
