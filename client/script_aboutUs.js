// imports collections from Mongo
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
// imports html page
import './page_aboutUs.html';
Template.main.events({
    'toOurTeam click': function(event){
        event.preventDefault();
        Router.route('/ourTeam');
        ; // redirects to the home page
    }
})