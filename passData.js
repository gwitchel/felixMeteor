
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
          Meteor.call('welcome', $('input[type=text]').val(), function(err,response) {
              if(err) {
                  Session.set('serverDataResponse', "Error:" + err.reason);
                  return;
              }
              Session.set('serverDataResponse', response);
          });
      }
    };
  }
  
  if (Meteor.isServer) {
    Meteor.startup(function () {
      Meteor.methods({
         getCurrentTime: async function () {
            let fetchResult;
            fetchResult = await fetch('https://ghr.nlm.nih.gov/condition/alzheimer-disease?report=json');
            const j = await fetchResult.json();
            return j
        },
  
        welcome: function (name) {
          console.log('on server, welcome called with name: ', name);
          if(name==undefined || name.length<=0) {
            throw new Meteor.Error(404, "Please enter your name");
          }
          return "Welcome " + name;
        }
      });
    });
  }