import Backbone from "backbone@1.2.1";
import $ from "jquery";

Backbone.$ = $;

System.import('js/mgg-app').then(function (application)
{{
    var MGGClient = application.default;
    var app = new MGGClient();
    app.start();
}});

export default {};
