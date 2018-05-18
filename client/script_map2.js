import { Template } from 'meteor/templating';
// imports html page
import './page_map2.html';
// if meteor is running load up the google maps and insert the key 
if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load({key: 'AIzaSyCeW_dpmqryHSJ-95XXoapZRa_OzFGDRRI'});
  });
}
// uplods the data 
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
  }
});
// a click event to test weather data retrieval is working 
Template.map2.events({
  'click': function(event){
    event.preventDefault();
    var data = getData('https://opendata.arcgis.com/datasets/6566b786e56b4101b3076305e0beff00_18.geojson');
    console.log(data); 
  }
})
// when the map is created draw to map 
// make sure to use map.instance not just map 
Template.map2.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('exampleMap', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
    var results = getData('https://opendata.arcgis.com/datasets/1bd512211246436b83e9cb8377ba40b1_12.geojson'); 
    var mapOne = new CombinationMap(results, "SUICIDE_ADJRATE");
    mapOne.map = mapOne.scaleMapFrom1to1000(); 
    mapOne.map = mapOne.removeOutliers(results, "SUICIDE_ADJRATE");     
    mapGraph(mapOne.returnMap(),mapOne.returnCaller(),map.instance);
    var results2 = getData('https://opendata.arcgis.com/datasets/1bd512211246436b83e9cb8377ba40b1_12.geojson'); 
    mapDot(results2,map.instance);
  });
});
// returns data from a database
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
  // uploades different colored dots for the map 
  var image1 = "dot1.png";
  var image2 = "dot2.png"
  // maps a graph that is purely geometry, no other value data 
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
  mapDot = function(results, mapRef) {
    for (var i = 0; i < results.features.length; i++) {
      var coords = results.features[i].geometry.coordinates;
      var latLng = new google.maps.LatLng(coords[1],coords[0]);
      var marker = new google.maps.Marker({
        position: latLng,
        map: mapRef,
        //icon: image
      });
    }
  }
  // takes a map and displays in on the screen 
  mapGraph = function(results,scaleTerm,mapRef) {
    for(var i = 0; i < results.features.length; i++){
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
          fillOpacity: 1
        });
        poly.setMap(mapRef);
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
            fillOpacity: 1
          });
          poly.setMap(mapRef);
        }
      }
    }
  }
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
  // if it's a cencus, just average all the values of cencuses in the same county. 
  function makeCencusIntoCounty(results,varSearch){
    for(var i = 0; i < results.features.length; i++) {
      var county = results.features[i].properties.COUNTY;
      var sameCountyNums = []
      for(var j = 0; j < results.features.length; j++){
        if(results.features[j].properties.COUNTY === results.features[i].properties.COUNTY) sameCountyNums.push(results.features[j].properties.varSearch);
      }
      var avgNumb = avgNum(sameCountyNums); 
      for(var j = 0; j < results.features.length; j++){
        if(results.features[j].properties.COUNTY === results.features[i].properties.COUNTY) results.features[j].properties.varSearch = avgNumb;
      }
    }
    return results; 
  }
  // averages an array of numbers 
  function avgNum(nums){
    var total = 0;
    for(var i = 0; i < nums.length; i++){
      total+=i; 
    }
    return total/nums.length; 
  }
  // object for any map that will be manipulated and not just drawn 
  var CombinationMap = function(mapOne, caller){
    // every variable that this map has been averaged with 
    this.trackers = [caller];
    // the map and it's prominent data set 
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
    this.combineWithOtherMap = function(otherMap,otherCaller){
      // this assumes that the other map has been scaled from one to 1,000
      // be carefull of cencus and counties 
      this.trackers.push(otherCaller);
      for(var j = 0; j < this.map.features.length; j++){
        for(var i = 0; i < otherMap.features.length; i++){
          if(this.map.features[j].properties.COUNTY_NAME == otherMap.features[i].properties.COUNTY_NAME){
            this.map.features[j].properties[this.firstCaller] = (this.map.features[j].properties[this.firstCaller] + otherMap.features[i].properties[otherCaller])/2;
          }
        }
      }
      return this.map; 
    }
    this.removeOutliers = function(results,keyWord){
      this.dataList = []; 
      for(var i = 0; i < results.features.length; i++){
        this.dataList.push(results.features[i].properties[keyWord])
      }
      var newData = this.filterOutlier(this.dataList,"filteredValues");
      for(var i = 0; i < this.dataList.length; i++){
        if(this.dataList[i] > this.filterOutlier(this.dataList,0)) this.dataList[i] = this.filterOutlier(this.dataList,0);
        if(this.dataList[i] < this.filterOutlier(this.dataList,1)) this.dataList[i] = this.filterOutlier(this.dataList,1);              
      }
      for(var i = 0; i < results.features.length; i++){
        results.features[i].properties[keyWord] = this.dataList[i]; 
      }
      return results; 
    }
    this.filterOutlier = function(someArray,whatToReturn){
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
          // // Then filter anything beyond or beneath these values.
          // var filteredValues = values.filter(function(x) {
          //     return (x <= maxValue) && (x >= minValue);
          // });
          //return filteredValues;
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
// var mapOne = new CombinationMap(mortalityRates, "HD_ADJRATE");
// mapOne.map = mapOne.scaleMapFrom1to1000(); 
//asthmaPrevlaceInAdults = makeCencusIntoCounty(asthmaPrevlaceInAdults, "ASTHMA");        
//var mapTwo = new CombinationMap(asthma, "ASTHMA_ADJRATE"); 
// mapTwo.map = mapTwo.scaleMapFrom1to1000();
// mapOne.map = mapOne.combineWithOtherMap(mapTwo.returnMap(), mapTwo.returnCaller());
// mapOne.map = mapOne.scaleMapFrom1to1000(); 
//var mapThree = new CombinationMap(mortalityRates, "HD_ADJRATE");
//mapThree.map = mapThree.scaleMapFrom1to1000(); 
//mapOne.map = mapOne.combineWithOtherMap(mapThree.returnMap(), mapThree.returnCaller()); 
//mapOne.map = mapOne.scaleMapFrom1to1000(); 
//mapGraph(mapOne.returnMap(),mapOne.returnCaller());
//mapGraph(heartDisease, "HSR");
// mapGraph(asthmaPrevlaceInAdults, "ASTHMA");
// mapGraph(asthma, "ASTHMA_ADJRATE");
// mapGraph(mortalityRates, "HD_ADJRATE");
// mapGraph(heartDisease, "HSR");        
// mapDot(ts, image1);
//mapDot(behavioralCenters, image2);
