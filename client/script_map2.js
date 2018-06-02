import { Template } from 'meteor/templating';
// imports html page
import './page_map2.html';

// keeps trac of the key for the map and what need to be displayed 
var mapKey = ''; 
Template.displayKey.events({
  "click .disp": function() {
    // alerts the user of the map key defined when the map was created
    window.alert(mapKey + "the lower the composite score of a county the more compatible it is. In other words: Blue is good, red is bad. ")
  }, 
});
// if meteor is running load up the google maps and insert the key 
if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load({key: 'AIzaSyCeW_dpmqryHSJ-95XXoapZRa_OzFGDRRI'});// loads google maps key
  });
}
// uploads the data 
Template.map2.helpers({
  exampleMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      //Map initialization options
      return {
        center: new google.maps.LatLng(39.124884,  -105.555755),
        zoom: 8
      };
    }
  }, 
});
// when the map is created draw to map 
// make sure to use map.instance not just map 
Template.map2.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('exampleMap', function(map) {
    var links = Session.get('linksToMap');    
    // get the links from the previous page --> maybe see if you can do this with cookie data
    var polyGonsToMap = [];
    var colors = ["f48342","f4df41","94f441","41f4a0","f4415e","6b7a0b","ffffff","000000","7a1f0b"];
    var keyColors = ["orange","yellow","bright green","mint green","pink","tree green","white","black","dark brick"];    
    var colorTracker = 0; 
    // maps the data to the map
    for(var i = 0; i < links.length; i++){
      try {
        var data = getData(links[i].link); // gets all the data from the CDPHE 
        if(data.features[i].geometry.type == "Point"){ // if it's a point give it a color and put it on the map
          mapDot(getData(links[i].link),map.instance,colors[colorTracker], links[i].caller); 
          mapKey = mapKey + "The " + keyColors[colorTracker] + " marker represents: " + links[i].name + ". "          
          mapKey = mapKey + "The " + keyColors[colorTracker] + " marker represents: " + links[i].name + ". "          
          colorTracker++;
        } 
        if(data.features[i].geometry.type == "Polygon") { // if it's a polygon with a number make a list 
            polyGonsToMap.push(new CombinationMap(data, links[i].caller,links[i].subtype));          
        };  
      } catch (error) {
        console.log(error)
      }
    }
    // take a list of polygons with seperate score clean, scale, and average all of them. 
    var mapOne;
    if(polyGonsToMap.length >= 1){
      mapOne = polyGonsToMap[0]; 
      mapOne.map = mapOne.removeOutliers(mapOne.map, mapOne.firstCaller);         
      mapOne.map = mapOne.scaleMapFrom1to1000();
      //mapOne.map = mapOne.scaleMapFrom1to1000();
      for(var i = 1; i < polyGonsToMap.length; i++){
        var mapTwo = polyGonsToMap[i]; 
        mapTwo.map = mapTwo.removeOutliers(mapTwo.map, mapTwo.firstCaller);        
        mapTwo.map = mapTwo.scaleMapFrom1to1000();
        mapOne.map = mapOne.combineWithOtherMap(mapTwo.map, mapTwo.firstCaller,mapTwo.subtype);
        mapOne.map = mapOne.scaleMapFrom1to1000(); 

      }
      // map the composite map
      mapGraph(mapOne.returnMap(),mapOne.returnCaller(),map.instance,mapOne.subtype); 
    }
    // Hide spinner
    $(".spinner").css('visibility', 'hidden');
  });
});
// does a number exist in an array?
function doesAlreadyExist(arr, num){
  for(var m = 0; m < arr.length; m++){
    if(arr[m] == num) return true; 
  }
  return false; 
}
//gets data based on a url
function getData(url){  
  var x = ""
  var request = new XMLHttpRequest(); 
  request.open('GET',url,false)
  // add a timeout so that if it soen't come back after a given amount of time it will fail. 
  request.onload = function(){
    x = JSON.parse(request.responseText);
  }
  request.send();
  return x; 
}
  // finds the lowest number of whatevr term you are searching for in a given dataset 
  function findLowest(results, term){
    var lowest = results.features[0].properties[term]; 
    for(var  i = 0; i < results.features.length; i++){
      if(lowest > results.features[i].properties[term]) lowest = results.features[i].properties[term];
    }
    return lowest; 
  }
  // finds the highest number of whatevr term you are searching for in a given dataset 
  function findHighest(results, term){
    var highest = results.features[0].properties[term]; 
    for(var  i = 0; i < results.features.length; i++){
      if(highest < results.features[i].properties[term]) highest = results.features[i].properties[term];
    }
    return highest; 
  }
  
  // maps a graph that is purely geometry, no other value data 
  // not currentely used but will be implimented
  mapSingleColorGraph = function(results,fillColor){
    // create all ofthe polygons and and set them to the graph 
    for(var i = 0; i < results.features.length; i++){
      var coords = []; 
      if(results.features[i].geometry.type == "Polygon"){
        for(var j = 0; j < results.features[i].geometry.coordinates[0].length; j++){
          coords.push({lat: results.features[i].geometry.coordinates[0][j][1], lng: results.features[i].geometry.coordinates[0][j][0]});
        }    
        // create polygon          
        var poly = new google.maps.Polygon({
          paths: coords,
          strokeColor: "#000000", 
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor:  fillColor, 
          fillOpacity: 1
        });
        poly.setMap(map);
      } 
      // create all of the multipolygons and set them to the graph 
      if(results.features[i].geometry.type == "MultiPolygon"){
        for(var j = 0; j < results.features[i].geometry.coordinates.length ; j++){
          coords = []; 
          for(var k = 0; k < results.features[i].geometry.coordinates[j][0].length; k++){
            coords.push({lat: results.features[i].geometry.coordinates[j][0][k][1], lng: results.features[i].geometry.coordinates[j][0][k][0]});
          }
          // create polygon
          var poly = new google.maps.Polygon({
            paths: coords,
            strokeColor: "#000000", 
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor:  fillColor, 
            fillOpacity: 1
          });
          poly.setMap(map);
        }
      }
    }
  }
  // maps all of the point coordinates of a given data set 
  mapDot = function(results, mapRef,colorForPin,caller) {
    // gets the pin icon form google chart APIS, assigns it a given color
    var pinIcon = new google.maps.MarkerImage(
      "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + colorForPin,
      null, /* size is determined at runtime */
      null, /* origin is 0,0 */
      null, /* anchor is bottom center of the scaled image */
      new google.maps.Size(12, 18)
    );
    // makes a marker for each map element
    for (var i = 0; i < results.features.length; i++) {
      var coords = results.features[i].geometry.coordinates;
      var latLng = new google.maps.LatLng(coords[1],coords[0]);
      var marker = new google.maps.Marker({
        position: latLng,
        map: mapRef,
        icon: pinIcon
      });
      // assigns the marker a click button to display the name
      attachSecretMessage(marker, results.features[i].properties[caller]);      
      function attachSecretMessage(marker, secretMessage) {
        var infowindow = new google.maps.InfoWindow({
          content: secretMessage
        });
        marker.addListener('click', function() {
          infowindow.open(marker.get('map'), marker);
        });
      }
    }
  }
  // takes a map and displays in on the screen along with it's county and composite score.
  mapGraph = function(results,scaleTerm,mapRef,countyId) {
    // sets the info window to the county name and score
    function showArrays(event) {
      var contentString = '<b>'+ '</b><br>' +
          'county: ' + this.name +
          '<br>' + 'score ' + this.score;
      // Replace the info window's content and position.
      infoWindow.setContent(contentString);
      infoWindow.setPosition(event.latLng);
      infoWindow.open(mapRef);
    }
    for(var i = 0; i < results.features.length; i++){
      var k;
      var coords = []; 
      // creates polygons
      if(results.features[i].geometry.type == "Polygon"){
        for(var j = 0; j < results.features[i].geometry.coordinates[0].length; j++){
          coords.push({lat: results.features[i].geometry.coordinates[0][j][1], lng: results.features[i].geometry.coordinates[0][j][0]});
        }
        var lowest = findLowest(results, scaleTerm);
        var highest = findHighest(results,scaleTerm);
        var color = getColor(results.features[i].properties[scaleTerm],lowest,highest);
        var poly = new google.maps.Polygon({
          paths: coords,
          strokeColor: "#000000", 
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor:  color, 
          fillOpacity: 0.75,
          name : results.features[i].properties[countyId],
          score: results.features[i].properties[scaleTerm]
          
        });
        poly.setMap(mapRef); 
        k = results.features[i].properties[scaleTerm]        
        poly.addListener('click', showArrays);
        infoWindow = new google.maps.InfoWindow; 
      } 
      // creates multipolygons 
      if(results.features[i].geometry.type == "MultiPolygon"){
        for(var j = 0; j < results.features[i].geometry.coordinates.length ; j++){
          coords = []; 
          for(var k = 0; k < results.features[i].geometry.coordinates[j][0].length; k++){
            coords.push({lat: results.features[i].geometry.coordinates[j][0][k][1], lng: results.features[i].geometry.coordinates[j][0][k][0]});
          }
          var lowest = findLowest(results, scaleTerm);
          var highest = findHighest(results,scaleTerm);
          var color = getColor(results.features[i].properties[scaleTerm],lowest, highest);
          var poly = new google.maps.Polygon({
            paths: coords,
            strokeColor: "#000000", 
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor:  color, 
            fillOpacity: 0.75,
            name: results.features[i].properties.COUNTY, 
            score: results.features[i].properties[scaleTerm]
          });
          poly.setMap(mapRef);
          k = results.features[i].properties[scaleTerm]
          poly.addListener('click', showArrays);
          infoWindow = new google.maps.InfoWindow;          
        }
      }
    }
  }
  // object for any map that will be manipulated and not just drawn 
  var CombinationMap = function(mapOne, caller,subtype){
    // every variable that this map has been averaged with 
    this.trackers = [caller];
    // the map and it's prominent data set 
    this.subtype = subtype
    this.map = mapOne; 
    this.firstCaller = caller; 
    // scales the map so that every map can be the same size 
    this.scaleMapFrom1to1000 = function(){
      var shiftLeft = findLowest(this.map, this.firstCaller); 
      for(var i = 0; i < this.map.features.length; i++){
         this.map.features[i].properties[this.firstCaller] = this.map.features[i].properties[this.firstCaller] - shiftLeft;
      }  
      var max = findHighest(this.map, this.firstCaller); 
      var scaleFactor = 100/max;
      for(var i = 0; i < this.map.features.length; i++) this.map.features[i].properties[this.firstCaller] = this.map.features[i].properties[this.firstCaller]*scaleFactor;
      return this.map; 
    }
    // combines one maps data with ontehr maps data 
    this.combineWithOtherMap = function(otherMap,otherCaller,otherSubtype){
      // this assumes that the other map has been scaled from one to 1,000
      // be carefull of cencus and counties 
      this.trackers.push(otherCaller);
      for(var j = 0; j < this.map.features.length; j++){
        for(var i = 0; i < otherMap.features.length; i++){
          if(this.map.features[j].properties[this.subtype] == otherMap.features[i].properties[otherSubtype]){
            this.map.features[j].properties[this.firstCaller] = (this.map.features[j].properties[this.firstCaller] + otherMap.features[i].properties[otherCaller])/2;
          }
        }
      }
      return this.map; 
    }
    this.removeOutliers = function(results,keyWord){
      // return a map with outliers removes so it's no skewed. 
      this.dataList = []; 
      for(var i = 0; i < results.features.length; i++){
        this.dataList.push(results.features[i].properties[keyWord])
      }
      var newData = this.filterOutlier(this.dataList,"filteredValues"); // filters outliers and returns a list of new fitted values
      for(var i = 0; i < this.dataList.length; i++){
        if(this.dataList[i] > this.filterOutlier(this.dataList,0)) this.dataList[i] = this.filterOutlier(this.dataList,0); // gets the maximum within the standard deviation
        if(this.dataList[i] < this.filterOutlier(this.dataList,1)) this.dataList[i] = this.filterOutlier(this.dataList,1); // gets the minimum within the standard deviation
      }
      for(var i = 0; i < results.features.length; i++){
        results.features[i].properties[keyWord] = this.dataList[i]; 
      }
      return results; // returns a new list with values capped at the edges of the standard deviation 
    }
    this.filterOutlier = function(someArray,whatToReturn){
      //key 
      // 1 --> return the minimum of the standard deviation
      // 0 --> return the maximum of the standard deviation 
      // anything else --> return all values within standard deviation of an array of numbers
      var values = someArray.concat();
          // Then sort
          values.sort( function(a, b) {
                  return a - b;
               }); 
          var q1 = values[Math.floor((values.length / 4))];
          // Likewise for q3. 
          var q3 = values[Math.ceil((values.length * (3 / 4)))];
          var iqr = q3 - q1;
          // Then find min and max values
          var maxValue = q3 + iqr*1.5;
          var minValue = q1 - iqr*1.5;
          if(whatToReturn == 0) return maxValue; 
          if(whatToReturn == 1)return minValue; 
          //  Then filter anything beyond or beneath these values.
          var filteredValues = values.filter(function(x) {
              return (x <= maxValue) && (x >= minValue);
          });
          return filteredValues;
    }
    // some returns to be used in drawings 
    this.returnMap = function(){
      return this.map; 
    }
    this.returnCaller = function(){
      return this.trackers[0]; 
    }
  }
  // convets an RGB to a hex 
  function rgbToHex(rgb) { 
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }
    return hex;
  };
  //scales a given number to a value between 0 and 355 then turns it to a hex. Need bounds to scale 
  function getColor(val,lowerLim, uppperLim){
    var setZero = uppperLim - lowerLim;
    var scaleFactor = 255/setZero; 
    var color = 255- Math.round(val * scaleFactor + lowerLim);
    var color2 = Math.round(val * scaleFactor + lowerLim)
    color = rgbToHex(color);
    color2 = rgbToHex(color2)
    return "#" + color2  + "00" + color; 
  }
