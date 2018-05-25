// imports collections from Mongo
import { Template } from 'meteor/templating';
// imports html page
import './main.html';

Template.main.events({
    'buttonOne click': function(event){
        event.preventDefault();
        Router.route('/aboutUs'); // redirects to the home page
    }
})
Router.go('/')
Router.configure({
  name: 'main', 
  layoutTemplate: 'main'
});
Router.route('/page_ourTeam',{
  name: 'ourTeam'
})
Router.route('/page_aboutUs',{
  name: 'aboutUs'
})

Router.route('/page_bigQuote',{
  name: 'bigQuote'
})
Router.route('/page_map2',{
  name: 'map2'
})
Router.route('/intro',{
  name: 'intro'
})
Router.route('/disease',{
  name: 'getDiseaseData'
})
Router.route('/page_enter_data',{
  name: 'enterData'
})

Router.route('/', {
  template: 'intro'
});
