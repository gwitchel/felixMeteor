
  if (Meteor.isServer) {
    Meteor.startup(function () {
      Meteor.methods({
         getCurrentTime: async function () {
            let fetchResult;
            fetchResult = await fetch('https://ghr.nlm.nih.gov/condition/alzheimer-disease?report=json');
            const j = await fetchResult.json();
            return j
        },
        getData: async function (name) {
            let fetchResult;            
          if(name==undefined || name.length<=0) {
            throw new Meteor.Error(404, "Please enter your name");
          }
          fetchResult = await fetch('https://ghr.nlm.nih.gov/condition/' + name + '?report=json');
          const j = await fetchResult.json();
          return j;
        }
      });
    });
  }

function findSymptoms(){

}

function lookForWord(string,word){
    var indexes = []; 
    var c = true; 
    var c2 = 0; 
    while( c !== -1 ){
        c2++
        c = string.indexOf(" " + word + "  ")
        if(c!== -1) indexes.push(c); 
        if(c2 > 100) c = -1; 
    }
    return indexes; 
}