if (Meteor.isClient) {
    
    Template.qrCode.onRendered(function () {
        debugger;
        var files = [];
        var identities = []; 
        var x = Session.get('codeResults')
        var y = Session.get('codeResults2')
        
        for(var j = 0; j < x.length; j++){
            files.push(generateMapLinkPoint(x[j])); 
        }              
      $('#qrcode').qrcode({
        size: 300,
        text: JSON.stringify({
             "files": files,
             "target": "http://cakes.cosmoquest.com/felix/",
            "identities":y
         }
        )
      });
    });
}   

function generateMapLinkPoint(results){
    var beginning = 'https://maps.googleapis.com/maps/api/staticmap?center=39.124884,-105.555755&zoom=7&size=700x700'
    for (var i = 0; i < results.features.length && i < 135; i++) {
        var coordsX = results.features[i].geometry.coordinates[0];
        var coordsY = results.features[i].geometry.coordinates[1];
       // console.log('&markers=color:blue%7C' + coordsX + ',' + coordsY)
        beginning += '&markers=color:blue%7C' + coordsY + ',' +coordsX;
      }
      beginning += '&key=AIzaSyC2c36yX_7p872_zPJfYXsAruO_TLLaD7Q'
      return beginning
}