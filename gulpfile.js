var config = require("./server/lib/config.js");
var static_location = config.static_location;
var livereload_port = config.livereload_port;
var static_port = config.static_port;

var colors = require('colors'); //because I'm anal about this stuff
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var shell = require('gulp-shell');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var eslint = require('gulp-eslint');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');

// server business
var express = require('express');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser');
var path = require('path');
var static_app, static_server;

gulp.task('default', function()
{
    gulp.start('develop');
});

gulp.task('develop', function() {
    gulp.start('develop:server');
    gulp.start('templates');
    gulp.start('styles');
    gulp.start('develop:js');

    $.livereload.listen({port: livereload_port});

    staticInit();

    gulp.watch(static_location + '/js/Index.js', ['develop:js']); // updates should trigger a reload of the Root file when we're in develop mode
    gulp.watch(static_location + '/js/**/*.js', ['eslint']);
    gulp.watch([
        static_location + '/js/**/*.js',
        static_location + '/index.html', 
        static_location + '/templates.html', //will change when any templates change
        static_location + '/css/app.css'
    ]).on('change', $.livereload.changed);

    gulp.watch(static_location + '/templates/**/*.html', ['templates']);
    gulp.watch(static_location + '/css/app.scss', ['styles']);
});

gulp.task('build', function()
{
    gulp.start('templates');
    gulp.start('styles');
    gulp.start('eslint');
    gulp.start('build:js');
});

/**
 * Underscore template building
 */
gulp.task('templates', shell.task([
    'python lib/build-templates.py -b ' + static_location + '/templates/templates.html -t ' + static_location + '/templates/views -f templates.html ' + static_location
]));

/**
 * Style compilation
 */
gulp.task('styles', function() {
    return gulp
        .src(static_location + "/css/app.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: [
                'ie >= 11',
                'ie_mob >= 11',
                'ff >= 30',
                'chrome >= 21',
                'safari >= 8',
                'opera >= 23',
                'ios >= 8',
                'android >= 4.4',
                'bb >= 10'
            ]
        }))
        .pipe(gulp.dest(static_location + "/css/"), {overwrite: true});
});

// Prod task
gulp.task("develop:babel", function () {
    return gulp.src(static_location + "/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest("dist"));
});

gulp.task('eslint', function (callback)
{
    return gulp.src([static_location + '/js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('develop:server', function()
{
    // nothing as of yet: see nodemon below
});

/**
 * Javascript manipulation to make sure Root.js is the desired file
 */

var buildJS = function(root)
{
    var Builder = require('systemjs-builder');
    var builder = new Builder('./' + static_location, './' + static_location + '/config.js');
    builder.buildStatic('./' + static_location + '/js/' + root + '.js', './' + static_location + '/js/Root.js', { minify: true })
    .then(function() {
      console.log('Build complete at', new Date(), '.');
    })
    .catch(function(err) {
      console.log('Build error:');
      console.log(err);
    });
};
gulp.task('develop:js', shell.task([
    'cp ' + static_location + '/js/Index.js  ' + static_location + '/js/Root.js'
]));

gulp.task('build:js', function()
{
    buildJS("Index");
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