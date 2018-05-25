import { Mongo } from 'meteor/mongo'

Template.enterData.helpers({
    returnDiseases() {
      return diseaseTable; 
    }
});
Template.enterData.events({
    'click .showMap': function(){
        var cb = document.getElementsByClassName("cbn");
        for(var i = 0; i < cb.length; i++){
            var name = cb[i].id;
            if(cb[i].checked)  Diseases.insert({ id: name });
            
        }
        Router.go("map2");
    }
});
var diseaseTable = [
    {
        "id": 1,
        "name":"hypertension"
    },
    {
        "id": 2,
        "name":"high colestoral"
    },
    {
        "id": 3,
        "name":"arthritis"
    },
    {
        "id": 4,
        "name":"ischemic heart disease"
    },
    {
        "id": 5,
        "name":"diabetes"
    },
    {
        "id": 6,
        "name":"chronic kidney disease"
    },
    {
        "id": 7,
        "name":"heart failure"
    },
    {
        "id": 8,
        "name":"depression"
    },
    {
        "id": 9,
        "name":"alzhimers"
    },
    {
        "id": 10,
        "name":"obstructive pulminary disease"
    }

]
