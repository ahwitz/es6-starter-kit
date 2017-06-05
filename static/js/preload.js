var failFunction = function (e)
{
    console.log(e || 'Timed out.');
};

// Shim for promises because IE11
var templatesLoaded = false;
var cssLoaded = false;
var initFunction;
var testInit = function ()
{
    if (cssLoaded && templatesLoaded && initFunction) initFunction();
};

var setCSS = function ()
{
    cssLoaded = true;
    testInit();
};

// Load CSS
var cssEl = document.createElement("link");
cssEl.setAttribute("rel", "stylesheet");
cssEl.setAttribute("href", "/css/app.css");
cssEl.setAttribute("onload", "setCSS()");
document.querySelector("head").appendChild(cssEl);

// Fetch the templates and append them separately; we're gonna need jQuery later so we might as well import it now
System.import('jquery').then(function ()
{
    $.ajax({
        'method': 'GET',
        'url': '/templates.html',
        'success': function (data) {
            document.querySelector("body").innerHTML += data;
            templatesLoaded = true;
            testInit();
        },
        'failure': failFunction
    });
}).catch(failFunction);

// Import the javascript; gulp sets the correct one to be Root
System.import('js/Root').then(function (obj)
{
    initFunction = obj.staticInit;
    testInit();
}).catch(failFunction);  
