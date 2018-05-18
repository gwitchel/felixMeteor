// imports collections from Mongo
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
// imports html page
import './disease.html';

// function createCORSRequest(method, url) {
//     var xhr = new XMLHttpRequest();
//     if ("withCredentials" in xhr) {
  
//       // Check if the XMLHttpRequest object has a "withCredentials" property.
//       // "withCredentials" only exists on XMLHTTPRequest2 objects.
//       xhr.open(method, url, true);
  
//     } else if (typeof XDomainRequest != "undefined") {
  
//       // Otherwise, check if XDomainRequest.
//       // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
//       xhr = new XDomainRequest();
//       xhr.open(method, url);
  
//     } else {
  
//       // Otherwise, CORS is not supported by the browser.
//       xhr = null;
  
//     }
//     return xhr;
//   }
  
// // Create the XHR object.
// function createCORSRequest(method, url) {
//     var xhr = new XMLHttpRequest();
//     if ("withCredentials" in xhr) {
//       // XHR for Chrome/Firefox/Opera/Safari.
//       xhr.open(method, url, true);
//     } else if (typeof XDomainRequest != "undefined") {
//       // XDomainRequest for IE.
//       xhr = new XDomainRequest();
//       xhr.open(method, url);
//     } else {
//       // CORS not supported.
//       xhr = null;
//     }
//     return xhr;
//   }
  
//   // Helper method to parse the title tag from the response.
//   function getTitle(text) {
//     return text.match('<title>(.*)?</title>')[1];
//   }
  
//   // Make the actual CORS request.
//   function makeCorsRequest() {
//     // This is a sample server that supports CORS.
//     var url = "https://ghr.nlm.nih.gov/condition/alzheimer-disease?report=json"; //'http://html5rocks-cors.s3-website-us-east-1.amazonaws.com/index.html';
  
//     var xhr = createCORSRequest('GET', url);
//     if (!xhr) {
//       alert('CORS not supported');
//       return;
//     }
  
//     // Response handlers.
//     xhr.onload = function() {
//       var text = xhr.responseText;
//       var title = getTitle(text);
//       alert('Response from CORS request to ' + url + ': ' + title);
//     };
  
//     xhr.onerror = function() {
//       alert('Woops, there was an error making the request.');
//     };
  
//     xhr.send();
//   }


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