import { Meteor } from 'meteor/meteor';
if (Meteor.isServer) {
  Router.map(function () {
    this.route('serverRoute', {
      where: 'server',
      path: '/client/main.html',
      action: function() {
        if (this.request.method === 'POST')
          this.response.end("handling post request");
      }
    });
  });
}
Meteor.methods({
  logToConsole: function(msg) {
    console.log(msg)
  }
});
WebApp.connectHandlers.use('/hello', (req, res, next) => {
  res.writeHead(200);
  res.end( req  + `${Meteor.release}`);
  //`Hello world from: ${Meteor.release}`
});
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
      // Initialize Firebase

  });
