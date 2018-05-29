import { Meteor } from 'meteor/meteor';

Meteor.startup( () => {
    //BrowserPolicy.framing.disallow()    
    //BrowserPolicy.content.allowOriginForAll( 'maps.googleapis.com');  
    //BrowserPolicy.content.allowOriginForAll( 'https://ghr.nlm.nih.gov');
    //BrowserPolicy.content.allowOriginForAll( 'fonts.googleapis.com' );
    //BrowserPolicy.framing.restrictToOrigin('https://ghr.nlm.nih.gov')
    //BrowserPolicy.framing.restrictToOrigin( 'localhost:5000' );
    //BrowserPolicy.framing.allowAll();
    //BrowserPolicy.content.allowInlineScripts();
    //BrowserPolicy.content.allowEval();
    //BrowserPolicy.content.allowInlineStyles();
    //BrowserPolicy.content.allowDataUrlForAll();
    //BrowserPolicy.content.allowSameOriginForAll();
  });
