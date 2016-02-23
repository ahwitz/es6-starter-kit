System.config({
  "paths": {
    "*": "*.js",
    "github:*": "libs/github/*.js",
    "npm:*": "libs/npm/*.js"
  }
});

System.config({
  "map": {
    "backbone": "npm:backbone@1.2.1",
    "backbone.marionette": "npm:backbone.marionette@2.4.1",
    "backbone.radio": "npm:backbone.radio@0.9.0",
    "jquery": "npm:jquery@2.1.4",
    "marionette": "npm:marionette@0.0.0",
    "sinon": "npm:sinon@1.14.1",
    "twbs/bootstrap": "github:twbs/bootstrap@3.3.4",
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:twbs/bootstrap@3.3.4": {
      "jquery": "github:components/jquery@2.1.4"
    },
    "npm:backbone.babysitter@0.1.7": {
      "backbone": "npm:backbone@1.2.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "underscore": "npm:underscore@1.8.3"
    },
    "npm:backbone.marionette@2.4.1": {
      "backbone": "npm:backbone@1.2.1",
      "backbone.babysitter": "npm:backbone.babysitter@0.1.7",
      "backbone.wreqr": "npm:backbone.wreqr@1.3.1",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "underscore": "npm:underscore@1.6.0"
    },
    "npm:backbone.radio@0.9.0": {
      "backbone": "npm:backbone@1.2.1",
      "underscore": "npm:underscore@1.7.0"
    },
    "npm:backbone.wreqr@1.3.1": {
      "backbone": "npm:backbone@1.2.1",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "underscore": "npm:underscore@1.6.0"
    },
    "npm:backbone@1.1.2": {
      "process": "github:jspm/nodelibs-process@0.1.1",
      "underscore": "npm:underscore@1.7.0"
    },
    "npm:backbone@1.2.0": {
      "process": "github:jspm/nodelibs-process@0.1.1",
      "underscore": "npm:underscore@1.8.3"
    },
    "npm:backbone@1.2.1": {
      "process": "github:jspm/nodelibs-process@0.1.1",
      "underscore": "npm:underscore@1.6.0"
    },
    "npm:formatio@1.1.1": {
      "process": "github:jspm/nodelibs-process@0.1.1",
      "samsam": "npm:samsam@1.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:jquery@2.1.4": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:sinon@1.14.1": {
      "formatio": "npm:formatio@1.1.1",
      "lolex": "npm:lolex@1.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "util": "npm:util@0.10.3"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

