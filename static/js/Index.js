import Backbone from "backbone";
import Marionette from 'backbone.marionette';

import Router from './Router';

class MGGClient extends Marionette.Application
{
	initialize(options)
	{
        new Router();
        Backbone.history.start();

		console.log("Initialized?");
		// var view = new MGGView();
		// var articlesView = new ArticlesView({
  //   		collection: [
		// 	    { name: 'Hallo, Welt!' },
		// 	    { name: 'Hello, World!' },
		// 	    { name: 'Bienvenue au monde!' }
		// 	]
		// });
		// this.addRegions({
		// 	mainRegion: "#app"
		// });
		// var mggView = new MGGView();
		// this.mainRegion.show(mggView);
	}
}

export default MGGClient;