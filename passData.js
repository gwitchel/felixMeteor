if (Meteor.isServer) {
    Meteor.startup(function () {
      Meteor.methods({
        getData: async function (name) {
        let fetchResult;            
          if(name==undefined || name.length<=0) {
            throw new Meteor.Error(404, "Please enter a condition"); // user didn't enter a condition
          }
          var k = cleanName(name) // cleans the input to be more cooherent with retreiving data, still not always accurate
          fetchResult = await fetch('https://ghr.nlm.nih.gov/condition/' + k + '?report=json'); // retreives object from gene reference 
          if(typeof fetchResult == 'object'){
            const j = await fetchResult.json();
            return j; // if it's an object, return it
          }
        }
      });
    });
}

function cleanName(name){ 
    // very minimal cleaning for inputted conditions
    var n = name; 
    n = n.toLowerCase()
    n = n.replace(" ", "-");
    return n; 
}