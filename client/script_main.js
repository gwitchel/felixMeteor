// imports collections from Mongo
import { Template } from 'meteor/templating';
// imports html page
import './main.html';
// Template.intro.events({
//   'click': function(event){
//       event.preventDefault();
//       var data;
//       var request = new XMLHttpRequest(); 
//       request.open('GET','https://opendata.arcgis.com/datasets/914bc3a28a644f95b13829128e69ede4_0.geojson',true)
//       request.send();
//       request.onreadystatechange = function(){
//         if(this.readyState == 4 && this.status == 200 ){
//           data = JSON.parse(request.responseText);
//         }
//         console.log(data.features[0].geometry.coordinates);          
//       }
//     }
// })

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
Router.route('/', {
  template: 'intro'
});