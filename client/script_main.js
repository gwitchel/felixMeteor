// imports collections from Mongo
import { Template } from 'meteor/templating';
// imports html page
import './main.html';
Template.main.events({
    'buttonOne click': function(event){
        event.preventDefault();
        Router.route('/aboutUs'); // redirects to the info page
    }
})
Template.intro.events({
  'click .goToConditions': function(){
    Router.go('/enterData'); // redirects to the page for adding data    
  }
})
// routes 
Router.go('/') // goes home always first 
Router.configure({
  name: 'main', 
  layoutTemplate: 'main' // main template that holds everything 
});
Router.route('/page_aboutUs',{
  name: 'aboutUs' // page about us 
})
Router.route('/page_map2',{
  name: 'map2' // the map
})
Router.route('/intro',{
  name: 'intro' //the introduction within main
})
Router.route('/disease',{
  name: 'getDiseaseData' // allows user to get disease data
})
Router.route('/page_enter_data',{
  name: 'enterData' // allows user to enter conditions
})

Router.route('/', {
  template: 'intro' // render intro first 
});
