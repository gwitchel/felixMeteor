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
            throw new Meteor.Error(404, "Please enter a condition");
          }
          var k = cleanName(name)
          fetchResult = await fetch('https://ghr.nlm.nih.gov/condition/' + k + '?report=json');
          if(typeof fetchResult == 'object'){
            const j = await fetchResult.json();
            return j;
          }
          // figure out how to get an alert that the condition doesn't exist out...
        }
      });
    });
}

function cleanName(name){
    debugger;
    var n = name; 
    console.log(n);
    //if(n.indexOf(" ") != -1) n = n.substring(0,n.indexOf(" "))+ '-' + n.substring(n.indexOf(" ")+1);
    n = n.replace(" ", "-");
    console.log(n);
    return n; 
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