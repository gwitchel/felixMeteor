// imports collections from Mongo
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
// imports html page
import './page_ourTeam.html';
Template.main.events({
    'backToHome click': function(event){
        event.preventDefault();
        Router.route('/main');
    }
})