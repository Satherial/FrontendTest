/*USAGE:
	gulp clean -> cancella sia .tmp che dist per iniziare il processo
	gulp -> build di default
  gulp serve -> start to appelop with browser-sync, no auto-reload beacuse of chrome cache inconsistencies
	gulp <task name> -> per far eseguire un task specifico
	gulp strip -> per creare in .tmp una cartella per Sonar
*/
'use strict';
var gulp = require('gulp');
var stripDebug = require('gulp-strip-debug');
var $ = require('gulp-load-plugins')();
var del = require('del');
var babel = require('gulp-babel');
var cjsx = require('gulp-cjsx');
var coffee = require('gulp-coffee');
var browserSync = require('browser-sync');
var rename = require('gulp-rename');
var es = require('event-stream');
var appName = 'prontopro';

gulp.task('clean', function(cb) {
	return del(['.tmp', 'dist'], {
		force: true
	}, cb);
});

gulp.task('cjsx', function() {
	return gulp.src('app/scripts/components/**/*.cjsx')
    .pipe(cjsx({bare: true}))
		.pipe(gulp.dest('.tmp/scripts/components'));
});

// gulp.task('jsx', function() {
// 	return gulp.src('app/scripts/components/**/*.jsx')
// 		.pipe(babel({
// 			presets: ['react']
// 		}))
// 		.pipe(gulp.dest('.tmp/scripts/components'));
// });

gulp.task('bowerjs', function() {
	return es.concat(
			gulp.src('app/scripts/bower_components/**/*.min.js')
					.pipe(gulp.dest('.tmp/scripts/bower_components')),
			gulp.src('app/scripts/bower_components/requirejs/*.js')
					.pipe($.uglify({
						comments: false
					}))
					.pipe(gulp.dest('.tmp/scripts/bower_components/requirejs')),
			gulp.src('app/scripts/bower_components/requirejs-text/*.js')
					.pipe($.uglify({
						comments: false
					}))
					.pipe(gulp.dest('.tmp/scripts/bower_components/requirejs-text')),
			gulp.src('app/scripts/bower_components/classnames/*.js')
					.pipe($.uglify({
						comments: false
					}))
					.pipe(gulp.dest('.tmp/scripts/bower_components/classnames')),
			gulp.src('app/scripts/bower_components/bootbox.js/*.js')
					.pipe($.uglify({
						comments: false
					}))
					.pipe(gulp.dest('.tmp/scripts/bower_components/bootbox.js')),
			gulp.src('app/scripts/bower_components/requirejs-plugins/**/*.js')
					.pipe($.uglify({
						comments: false
					}))
					.pipe(gulp.dest('.tmp/scripts/bower_components/requirejs-plugins')),
			gulp.src('app/scripts/bower_components/webrtc-adapter/adapter.js')
					.pipe($.uglify({
						comments: false
					}))
					.pipe(gulp.dest('.tmp/scripts/bower_components/webrtc-adapter'))
	);
});

gulp.task('bowerjs-noclean', function() {
	return gulp.src('app/scripts/bower_components/**/*.js')
          .pipe(gulp.dest('.tmp/scripts/bower_components'));
});

gulp.task('coffee', function() {
	return es.concat(
			gulp.src('app/scripts/*.coffee')
		    	.pipe(coffee({bare: true}))
					.pipe(gulp.dest('.tmp/scripts')),
			gulp.src('app/scripts/services/*.coffee')
		    	.pipe(coffee({bare: true}))
					.pipe(gulp.dest('.tmp/scripts/services')),
			gulp.src('app/scripts/components/*.coffee')
		    	.pipe(coffee({bare: true}))
					.pipe(gulp.dest('.tmp/scripts/components'))
	);
});

gulp.task('scripts', ['cjsx', 'coffee', 'bowerjs'], function(cb) {
	return cb();
});

gulp.task('images', function() {
	return es.concat(
		gulp.src('app/assets/images/*.png')
			.pipe(gulp.dest('.tmp/assets/images')),
		/*gulp.src('app/assets/images/*.png').pipe($.imagemin({
			use: [pngquant()]
		})).pipe(gulp.dest('.tmp/assets/images')),*/
		gulp.src('app/assets/images/*.gif')
				.pipe(gulp.dest('.tmp/assets/images')),
		gulp.src('app/assets/images/*.jpg')
				.pipe(gulp.dest('.tmp/assets/images'))
	);
});

gulp.task('bowercss', function() {
	return es.concat(
			gulp.src('app/scripts/bower_components/bootstrap/dist/css/bootstrap.css')
					.pipe(gulp.dest('.tmp/assets/styles')),
			gulp.src('app/scripts/bower_components/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css')
					.pipe(gulp.dest('.tmp/assets/styles')),
			gulp.src('app/scripts/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.css')
					.pipe(gulp.dest('.tmp/assets/styles'))
	);
});

gulp.task('bowercss-serve', function() {
	return es.concat(
			gulp.src('app/scripts/bower_components/bootstrap/dist/css/bootstrap.css')
					.pipe(gulp.dest('.tmp/scripts/bower_components/bootstrap/dist/css')),
			gulp.src('app/scripts/bower_components/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css')
					.pipe(gulp.dest('.tmp/scripts/bower_components/awesome-bootstrap-checkbox')),
			gulp.src('app/scripts/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.css')
					.pipe(gulp.dest('.tmp/scripts/bower_components/bootstrap-datepicker/dist/css'))
	);
});

gulp.task('css', function() {
	return gulp.src('app/assets/styles/*.css').pipe(gulp.dest('.tmp/assets/styles'));
});

gulp.task('styles', ['css', 'bowercss'], function(cb) {
	return cb();
});

gulp.task('prepare-stript', ['scripts'], function () {
	return gulp.src('.tmp/scripts/**/*.js')
		.pipe(stripDebug())
		.pipe(gulp.dest('.tmp/stripped'));
});

gulp.task('strip', ['prepare-stript'], function () {
	return gulp.src('.tmp/stripped/**/*.js')
			.pipe(gulp.dest('.tmp/scripts'));
});

gulp.task('copy-index', function() {
	return gulp.src('app/*.html').pipe(gulp.dest('.tmp'));
});

gulp.task('build', ['copy-resources', 'uglify-scripts', 'minify-styles'], function(cb) {
	return cb();
});

gulp.task('copy-resources', ['copy-index', 'images'], function() {
	return es.concat(
			gulp.src('.tmp/assets/images/*.*')
					.pipe(gulp.dest('dist/assets/images')),
			gulp.src('.tmp/index.min.html')
					.pipe(rename('index.html'))
					.pipe(gulp.dest('dist'))
	);
});

gulp.task('minify-scripts', ['strip'], function() {
	$.requirejs({
		baseUrl: '.tmp/scripts',
		name: 'app',
		out: appName + '.min.js',
		mainConfigFile: '.tmp/scripts/app.js'
	}).pipe(gulp.dest('dist/scripts'));
});

gulp.task('uglify-scripts', ['minify-scripts'], function() {
		return es.concat(
			gulp.src('.tmp/scripts/bower_components/**/*.js')
					.pipe(gulp.dest('dist/scripts/bower_components')),
			gulp.src('.tmp/scripts/services/**/*.js')
					.pipe($.uglify({
						comments: false
					}))
					.pipe(gulp.dest('dist/scripts/services')),
			gulp.src('.tmp/scripts/components/**/*.js')
					.pipe($.uglify({
						comments: false
					}))
					.pipe(gulp.dest('dist/scripts/components'))
		);
});

gulp.task('minify-styles', ['styles'], function() {
	return gulp.src('.tmp/assets/styles/*.css')
		.pipe(gulp.dest('dist/assets/styles'));
});

gulp.task('assets', function() {
	return gulp.src('app/assets/*.*')
		.pipe(gulp.dest('.tmp/assets'));
});

// gulp.task('compile-components', function () {
// 	return gulp.src('app/scripts/components/**/*.jsx')
//           .pipe(babel({
//           	presets: ['react']
//           }))
//           .pipe(gulp.dest('.tmp/scripts/components'));
// });

gulp.task('serve', ['styles', 'scripts', 'images', 'copy-index', 'bowercss-serve'], function () {
  browserSync({
    server: {
      baseDir: ['.tmp']
    }
  });

	gulp.watch('app/scripts/**/*.cjsx', ['scripts']);
	gulp.watch('app/scripts/**/*.coffee', ['scripts']);
  gulp.watch('app/scripts/bower_components/**/*.js', ['bowerjs-noclean']);
  gulp.watch('app/scripts/bower_components/**/*.css', ['bowercss-serve']);
  gulp.watch('app/assets/**/*.*', ['assets']);
});

gulp.task('default', ['build'], function(cb) {
	return del(['.tmp'], {
		force: true
	}, cb);
});
