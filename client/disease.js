// imports collections from Mongo
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './disease.html'; // imports html page

if (Meteor.isClient) {
    Template.simple.result = function () {
      return Session.get('serverSimpleResponse') || "";
    };
    Template.simple.events = {
      'click input' : function () {
          Meteor.call('getCurrentTime',function(err, response) {
              debugger;
              Session.set('serverSimpleResponse', JSON.stringify(response));
          });
      }
    };
    Template.passData.result = function () {
      return Session.get('serverDataResponse') || "";
    };
    Template.passData.events = {
      'click input[type=button]' : function () {
          Meteor.call('getData', $('input[type=text]').val(), function(err,response) {
              if(err) {
                  Session.set('serverDataResponse', "Error:" + err.reason);
                  return;
              }
              //console.log(response["text-list"][0].text["html"])
              console.log(symptoms(response["text-list"][0].text["html"]));
              //Session.set('serverDataResponse', response);
          });
      }
    };
}
function lookForWord(string,word){
    debugger;
    var indexes = []; 
    var c = string.indexOf(" " + word + "  "); 
    var c2 = 0; 
    while( c !== -1 ){
        c2++
        c = string.indexOf(" " + word + "  ",c+1)
        if(c!== -1) indexes.push(c); 
        if(c2 > 100) c = -1; 
    }
    return indexes; 
}
function propogate(string){
    string = removeInstances(string,"<p>")
    string = removeInstances(string,"</p>")
    var fin = new FullString(string);
    var one =  seperateStringByCharacter(string,'.');
    for(var i = 0; i < one.length; i++){
        fin.sentences.push(new Sentence(one[i]));
    }
    for(var i = 0; i < fin.sentences.length;i++){
        var two = seperateStringByCharacter(fin.sentences[i].init,',')
        for(var j = 0; j < two.length; j++) {
            fin.sentences[i].commaBits.push(new CommaBit(two[j]))
        }
        for(var j = 0; j < fin.sentences[i].commaBits.length; j++){
            var three = seperateStringByCharacter(fin.sentences[i].commaBits[j].init,' ') 
            for(var k = 0; k < three.length; k++){
                fin.sentences[i].commaBits[j].words.push(three[k]);
            }           
        }
    }
    return fin;
}

function removeInstances(string1,word){
    var z = 0; 
    var c = string1.indexOf(word)
    while(c !== -1){
        string1 = string1.substring(0,c) + string1.substring(c+word.length);
        c = string1.indexOf(word)        
        z++; 
        if(z > 200) break; 
    }
    return string1;
}

function seperateStringByCharacter(bigWord,character){
    var array = []; 
    var z = 0; 
    var c = bigWord.indexOf(character)
    while(c !== -1){
        array.push(bigWord.substring(0,c));
        bigWord = bigWord.substring(c+1,bigWord.length);
        c = bigWord.indexOf(character)        
        z++; 
        if(z > 200) break; 
    }
    if(bigWord.length > 0) array.push(bigWord); 
    return array; 
}
function symptoms(string){
    var structure = propogate(string); 
    var possible = [];  
    for (var i = 0; i <structure.sentences.length; i++) {
        if(structure.sentences[i].commaBits.length > 1){
            possible.push(structure.sentences[i]);
        }
    }
    for(var i = 0; i < possible.length; i++){
        if(possible[i].init.indexOf("symptoms") !== -1 ) {
            return takeListReturnSymptoms(possible[i]);
        }
    }
    return "none";
}

function takeListReturnSymptoms(sen){
    debugger;
    var symptoms = []; 
    for(var i = 1; i < sen.commaBits.length; i++){
        symptoms.push(sen.commaBits[i].init);
    }
    return symptoms; 
}

var FullString = function(init){ 
    this.init = init; 
    this.sentences = []; 
}
var Sentence = function(init){
    this.init = init; 
    this.commaBits = []; 
}
var CommaBit = function(init){
    this.init = init; 
    this.words = []; 
}

// Template.getDiseaseData.events({
//     'click': function(event){
//         event.preventDefault();
//         var data = getDiseaseData('bladder-cancer');
//         console.log(data); 
//     }
// })
function getDiseaseData(url){
    // var victory = makeCorsRequest();
    var x = ""
    var request = new XMLHttpRequest(); 
    request.open('GET',"https://ghr.nlm.nih.gov/condition/alzheimer-disease?report=json",false);
    // add a timeout so that if it soen't come back after a given amount of time it will fail. 
    request.onload = function(){
      x = JSON.parse(request.responseText);
    }
    request.send();
    return x; 
}