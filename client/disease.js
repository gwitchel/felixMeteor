// imports collections from Mongo
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './disease.html'; // imports html page

if (Meteor.isClient) {
    // sets the response
    Template.passData.result = function () {
      return Session.get('serverDataResponse') || "";
    };
    Template.passData.events = {
        // when the condition is submitted
      'click .submitCondition' : function () {
          event.preventDefault();
          //calls the server side get request, deal with CORS request
          Meteor.call('getData', $('input[type=input]').val(), function(err,response) {
              if(err) {  
                  Session.set('isError', true);  // do you need to display the help form for a wrong submit                                
                  Session.set('serverDataResponse', "Error:" + err.reason); 
                  return;
              }
              if(typeof Session.get('selectedCondition') !== 'undefined'){
                  // if there have already been conditions submitted add this condition to the list 
                  Session.set('isError', false);                                                
                  var x = Session.get('selectedCondition');
                  x.push(response); 
                  Session.set('selectedCondition', x);                  
              } else {
                 // no condition has been submitted, start a list  
                Session.set('selectedCondition', [response]);                
              }
          });
      }
    };
}