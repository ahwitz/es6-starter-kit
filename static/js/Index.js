import Backbone from "backbone";
import Marionette from 'backbone.marionette';

import Router from './Router';

class ES6StarterApp extends Marionette.Application
{
    initialize(options)
    {
        this.router = new Router();
        Backbone.history.start();
        this.rootView = new RootView({});
    }
}

class RootView extends Marionette.LayoutView
{
    constructor(options)
    {
        options.template = "#root-view";
        options.el = "#app";
        options.regions = {
            'sample': "#sub",
            'notroot': "#root"
        };
        super(options);
        this.render();
        this.showChildView('notroot', new NotRootView({}));
        this.showChildView('sample', new SampleView({}));
    }
}

class NotRootView extends Marionette.ItemView
{
    constructor(options)
    {
        options.template = "#not-root-view";
        super(options);
    }
}

class SampleView extends Marionette.ItemView
{
    constructor(options)
    {
        options.template = "#sub-view";
        super(options);
    }
}

export const staticInit = () => {
    var app = new ES6StarterApp({});
    app.start();
};
