
/*

 ## Available Tasks
 
 ### gulp build
 compile sources in /build (uncompressed, sourcemap)
 
 ### gulp dist
 compile the current distributable version in /dist (minified, without debug support)
 
 ### gulp start
 starts a development session, rebuild the project on source change

 ### gulp test
 run all the tests once

 ### gulp ci
 start a continuous integration session

 ### gulp karma-start
 start KarmaJS server

 ### gulp karma-run
 trigger the execution of the tests on an active Karma server 

 */

'use strict';

var pkg = require('./package.json');
var path = require('path');
var gulp = require('gulp');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var runSequence = require('run-sequence');

var karma = require('karma');
var webpack = require('webpack');
var webpackBuild = require('gulp-webpack-build');

var webpackConfig = {
    useMemoryFs: true,
    progress: true
};

gulp.task('jshint', function () {
    return gulp.src(['./src/**'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish, { fail: true }))
        .pipe(jshint.reporter('fail'))
    ;
});

gulp.task('build', ['jshint'], function() {
    return gulp.src('./webpack.config.js', { base: path.resolve('./') })
        .pipe(webpackBuild.configure(webpackConfig))
        .pipe(webpackBuild.compile())
        .pipe(gulp.dest('./'));;
});

gulp.task('dist', ['jshint'], function() {
    return gulp.src('./webpack.config.js', { base: path.resolve('./') })
        .pipe(webpackBuild.configure(webpackConfig))
        .pipe(webpackBuild.overrides({
            output: {
                filename: './dist/[name]-' + pkg.version + '.js'
            },
            debug: false,
            plugins: [
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin()
            ]
        }))
        .pipe(webpackBuild.compile())
        .pipe(gulp.dest('./'));
});


gulp.task('start', ['build'], function() {  
    gulp.watch(['./src/**'], ['build']);
});

gulp.task('test', ['jshint'], function() {
    karma.server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
        autoWatch: false
    });
});

gulp.task('ci', ['jshint'], function() {
    karma.server.start({
        configFile: __dirname + '/karma.conf.js',
    });
});

gulp.task('karma-start', ['jshint'], function() {
    karma.server.start({
        configFile: __dirname + '/karma.conf.js',
        autoWatch: false
    });
});

gulp.task('karma-run', ['jshint'], function() {
    karma.runner.run({
        configFile: __dirname + '/karma.conf.js',
    });
});
