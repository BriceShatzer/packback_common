// Include gulp
var gulp = require('gulp');

// Include plugins
var sass = require('gulp-sass');
var del = require('del');
var lint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');

// Paths
var paths = {
    'base': 'build',
    'fonts': {
        'src': [
            'assets/fonts/*.*'
        ],
        'dest': 'build/assets/fonts',
        'watch': 'assets/fonts/*.*'
    },
    'images': {
        'src': [
            'assets/img/**'
        ],
        'dest': 'build/assets/img',
        'watch': 'assets/img/**'
    },
    'scripts': {
        'src': [
            'bower_components/modernizr/modernizr.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/foundation/js/foundation.js',
            'bower_components/viewer/dist/crocodoc.viewer.js',
            'bower_components/event-source-polyfill/eventsource.js',
            'bower_components/viewer/plugins/realtime/realtime.js',
            'assets/js/**'
        ],
        'dest': 'build/assets/js',
        'watch': 'assets/js/**'
    },
    'styles': {
        'src': [
            'assets/scss/*.scss'
        ],
        'includePaths': [
            'assets/scss',
            'assets/scss/bin',
            'bower_components/foundation/scss'
        ],
        'dest': 'build/assets/css',
        'watch': 'assets/scss/**'
    }
}

// Concatenate & Minify JS
gulp.task('scripts', ['lint'], function() {
    del([paths.scripts.dest]);
    return gulp.src(paths.scripts.src)
        .pipe(concat('all.js'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(rename('all.min.js'))
        .pipe(uglify({mangle:false}))
        .pipe(gulp.dest(paths.scripts.dest));
});

// Lint application JS, not dependancies
gulp.task('lint', function() {
    return gulp.src('assets/js/**')
        //.pipe(concat('test.js'))
        //.pipe(uglify({mangle:false}))
        .pipe(lint({laxbreak: true, asi: true, expr: true}))
        .pipe(lint.reporter('default'))
});

// Compile Our Fonts
gulp.task('fonts', function() {
    del([paths.fonts.dest]);
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
});

// Compile Our Images
gulp.task('images', function() {
    del([paths.images.dest]);
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
});

// Import native CSS components

gulp.task('css-components', function() {
    return gulp.src(['bower_components/viewer/dist/crocodoc.viewer.css'])
        .pipe(rename('_crocodoc-viewer.scss'))
        .pipe(gulp.dest('assets/scss/bin'));
});

// Compile Our Sass
gulp.task('sass', ['css-components'], function() {
    del([paths.styles.dest]);
    return gulp.src(paths.styles.src)
        .pipe(sass({
            includePaths: paths.styles.includePaths,
            outputStyle: 'expanded',
            errLogToConsole:true
        }))
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(gulp.dest(paths.styles.dest));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(paths.images.watch, ['images']);
    gulp.watch(paths.styles.watch, ['sass']);
    gulp.watch(paths.fonts.watch, ['fonts']);
    gulp.watch(paths.scripts.watch, ['scripts']);
});

gulp.task('refresh', function () {
    del(paths.base);
});

// Default Task
gulp.task('default', ['refresh'], function () {
    gulp.start('sass','fonts','images','scripts');
});
