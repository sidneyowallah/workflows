var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	compass = require('gulp-compass'),
	sass = require('gulp-sass'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyHTML = require('gulp-minify-html'),
	minifyCSS = require('gulp-minify-css'),
	minifyJSON = require('gulp-jsonminify'),
	minifyIMG = require('gulp-imagemin'),
	pngcrush = require('imagemin-pngcrush'),
	connect = require('gulp-connect'),
	browserify = require('gulp-browserify'),
	concat = require('gulp-concat');

var env, 
	coffeeSources, 
	sassSources, 
	htmlSources, 
	jsonSources, 
	jsSources,
	sassStyle,
	outputDir;

 
 env = process.env.NODE_ENV || 'development';


if (env==='development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else{
	outputDir = 'builds/production/';
	sassStyle = 'compact';
}


coffeeSources = ['components/coffee/tagline.coffee'];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];
jsSources = [
	'components/scripts/pixgrid.js',
	'components/scripts/rclick.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];


gulp.task('default',['coffee', 'js', 'compass', 'watch', 'connect', 'html', 'json', 'images']);


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
	.pipe(gulpif(env === 'production', uglify()))
	.pipe(gulp.dest(outputDir + 'js'))
	.pipe(connect.reload())

});

gulp.task('compass', function(){
	gulp.src(sassSources)
	.pipe(compass({
		sass:'components/sass',
		image:outputDir + 'images',
		
	})
	.on('error', gutil.log))
	.pipe(gulp.dest(outputDir + 'css'))
	.pipe(connect.reload())

});

gulp.task('html', function (){
	gulp.src('builds/development/*html')
	.pipe(gulpif(env === 'production', minifyHTML()))
	.pipe(gulpif(env === 'production', gulp.dest(outputDir)))
	.pipe(connect.reload())

});

gulp.task('images', function(){
	gulp.src('builds/development/images/**/*.*')
	.pipe(gulpif(env === 'production', minifyIMG({
		progressive:true,
		svgoPlugins:[{removeViewBox:false}],
		use:[pngcrush()]
	})))
	.pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
	.pipe(connect.reload())

});

gulp.task('json', function (){
	gulp.src('builds/development/js/*json')
	.pipe(gulpif(env === 'production', minifyJSON()))
	.pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
	.pipe(connect.reload())

});

gulp.task('watch', function(){
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch('builds/development/js/*json', ['js']);
	gulp.watch('builds/development/*html', ['html']);
	gulp.watch(jsonSources, ['json']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch('builds/development/images/**/*.*', ['images']);


});

gulp.task('connect', function (){
	connect.server({
		root:outputDir,
		livereload: true
	});
});

