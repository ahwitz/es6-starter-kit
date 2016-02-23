/* jshint node:true */
'use strict';

var static_location = "static";
var livereload_port = 35729;
var static_port = 9000;

var colors = require('colors'); //because I'm anal about this stuff
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var shell = require('gulp-shell');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');

// server business
var express = require('express');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser');
var path = require('path');
var static_app, static_server;

gulp.task('develop:templates', shell.task([
    'python lib/build-templates.py -b ' + static_location + '/templates/index.html -t ' + static_location + '/templates/views ' + static_location
]));

gulp.task('develop:styles', shell.task([
    'sassc -m ' + static_location + '/css/app.scss ' + static_location + '/css/app.css'
]));

//Prod task
gulp.task("develop:babel", function () {
    return gulp.src(static_location + "/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest("dist"));
});

gulp.task('develop:jshint', function (callback)
{
    return gulp.src([static_location + '/js/**/*.js'])
        .pipe($.jshint({lookup: true, devel: true, esnext: true}))
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('develop:server', function()
{
    // nothing as of yet: see nodemon below
});

gulp.task('develop', function() {
    gulp.start('develop:server');
    gulp.start('develop:templates');
    gulp.start('develop:styles');

    $.livereload.listen();

    staticInit();

    gulp.watch([
        static_location + '/js/**/*.js',
        static_location + '/index.html', //will change when any templates change via develop:templates
        static_location + '/css/app.css'
    ]).on('change', $.livereload.changed);

    gulp.watch(static_location + '/templates/**/*.html', ['develop:templates']);
    gulp.watch(static_location + '/js/**/*.js', ['develop:jshint']);
    gulp.watch(static_location + '/css/app.scss', ['develop:styles']);
});

gulp.task('default', function()
{
    gulp.start('develop');
});

function staticInit()
{
    static_app = module.exports.app = exports.app = express();
    var STATIC_PREFIXES = ['libs', 'js', 'fonts', 'css', 'config.js'];

    /**
     * Static app: middleware
     */

    if (process.argv.indexOf('prod') == -1)
    {
        static_app.use(require('connect-livereload')({'port':livereload_port}));
    }
    static_app.use(cookieParser('Ich bin das sehr Modell eines modernen Generalmajor'));

    /**
     * Static app: logging, only for / right now.
     */
    static_app.use(function(req, res, next)
    {
        if ((STATIC_PREFIXES.indexOf(req.url.split("/")[1]) === -1) && (STATIC_PREFIXES.indexOf(req.url.split("/")[2]) === -1)) {
            staticTimeLog(req.method + " " + req.url + " " + req.connection.remoteAddress);  
        }      
        next();
    });

    // Serve static files
    static_app.use(express.static(static_location));

    /**
     * Static app: all other URLs
     *  -Log the access to the console
     *  -Retain the URL so Backbone can manipulate it
     *  -Send the main index page
     *  -Let Backbone router handle errors
     */
    static_app.get("/*", function(req, res, next)
    {
        if (STATIC_PREFIXES.indexOf(req.url.split("/")[1]) == -1)
            res.sendFile(path.join(__dirname, static_location + '/index.html'));
        else 
        {
            console.log(req.url + ' could not be found in the static directory for some reason.');
            next();
        }
    });

    /**
     * Static app server
     */
    static_server = require('http').createServer(static_app)
        .listen(static_port)
        .on('listening', function()
        {
            staticTimeLog('Reloaded static content server on http://localhost:' + static_port + '.');
        });
}

var addZero = function(number)
{
    return String(number).length == 1 ? "0" + number : number;
};

var staticTimeLog = function(text)
{
    timeLog("static", text);
};

var timeLog = function(server, text)
{
    var now = new Date();
    var formattedTime = addZero(now.getHours()) + ":" + addZero(now.getMinutes()) + ":" + addZero(now.getSeconds());
    console.log("[" + formattedTime.grey + "] " + "[" + server + "] ".green + text.green);
};