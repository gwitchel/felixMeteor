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
// when the map is created draw to map 
// make sure to use map.instance not just map 
Template.map2.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('exampleMap', function(map) {
    debugger;
    console.log(Session.get('selectedCondition'))
    var links = Session.get('linksToMap');    
    // get the links from the previouse page --> maybe see if you can do this with cookie data
    //var links = convertToMappingTables();
    var polyGonsToMap = [];
    // maps the data to the map
    for(var i = 0; i < links.length; i++){
      var data = getData(links[i].link);
      if(data.features[i].geometry.type == "Point") mapDot(getData(links[i].link),map.instance); 
      if(data.features[i].geometry.type == "Polygon") {
        polyGonsToMap.push(new CombinationMap(data, links[i].caller));
        //var mapOne = 
        //mapOne.map = mapOne.scaleMapFrom1to1000(); 
        //mapGraph(mapOne.returnMap(), links[i].caller, map.instance);
      };
    } 
    var mapOne;
    if(polyGonsToMap.length > 1){
      mapOne = polyGonsToMap[0];
      //mapOne.map = mapOne.scaleMapFrom1to1000();
      for(var i = 1; i < polyGonsToMap.length; i++){
        var mapTwo = polyGonsToMap[i]; 
        //console.log("one")
        //logData(mapOne.returnMap(),mapOne.returnCaller())
        //logData(mapTwo.returnMap(),mapTwo.returnCaller())
        mapTwo.map = mapTwo.scaleMapFrom1to1000();
        //console.log("two")
        //logData(mapOne.returnMap(),mapOne.returnCaller())
        //logData(mapTwo.returnMap(),mapTwo.returnCaller())
        debugger;
        mapOne.map = mapOne.combineWithOtherMap(mapTwo.returnMap(), mapTwo.returnCaller());
        console.log("three")
        logData(mapOne.returnMap(),mapOne.returnCaller())
        logData(mapTwo.returnMap(),mapTwo.returnCaller())
        mapOne.map = mapOne.scaleMapFrom1to1000(); 
        console.log("four")
        logData(mapOne.returnMap(),mapOne.returnCaller())
        logData(mapTwo.returnMap(),mapTwo.returnCaller())
      }
      mapGraph(mapOne.returnMap(),mapOne.returnCaller(),map.instance); 
    } 
  });
});
function logData(results, term){
  var highest = results.features[0].properties[term]; 
  var foo = []
  for(var  i = 0; i < results.features.length; i++){
    foo.push(results.features[i].properties[term])
  }
  console.log(foo);
}
// returns data from a database
function doesAlreadyExist(arr, num){
  for(var m = 0; m < arr.length; m++){
    if(arr[m] == num) return true; 
  }
  return false; 
}
function convertToMappingTables(){
  // get the diseases 
  var toMap = Diseases.find({}).fetch(); 
  var mappy = []; 
  // put each array into a big array
  for(var i = 0; i < toMap.length; i++){
    mappy.push(toMap[i].id);
  }
  //remove elements from the array
  var linksToMapsNeed = [];
  for(var i = 0; i < mapToDisease.length; i++){
    for(var j = 0; j < mappy.length; j++){
      if(mapToDisease[i].diseaseID == parseInt(mappy[j])) linksToMapsNeed.push(mapToDisease[i].linkedMapsId)
    }
  }
  // remove doubles
  var n = []; 
  for(var i = 0; i < linksToMapsNeed.length; i++){
    for(var j = 0; j < linksToMapsNeed[i].length; j++){
      if(!doesAlreadyExist(n, linksToMapsNeed[i][j])) n.push(linksToMapsNeed[i][j]);
    }
  }
  // add in the corrolative table object 
  linksToMapsNeed = n;
  n = [] 
  for(var i = 0; i < linksToMapsNeed.length; i++){
    for(var j = 0; j < mapTable.length; j++){
      if (linksToMapsNeed[i] === mapTable[j].id) n.push(mapTable[j]); 
    }
  }
  linksToMapsNeed = n; 
  // return the tables
  return linksToMapsNeed;
}
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
      debugger;         
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
          if(this.map.features[j].properties.COUNTY == otherMap.features[i].properties.COUNTY){
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

var mapTable = [
    {
        "id": 1,
        "name":"Trauma Center Designation",
        "link": "https://opendata.arcgis.com/datasets/3d1927123c2b42baa710029c122ae21c_0.geojson",
        "type":"point"
    },
    {
        "id": 2,
        "name":"Colorado Drug Treatment Programs and Resources",
        "link": "https://opendata.arcgis.com/datasets/3d1927123c2b42baa710029c122ae21c_0.geojson",
        "type":"point"
    },
    {
        "id": 3,
        "name":"EMS and Ambulance Agencies",
        "link": "https://opendata.arcgis.com/datasets/5a7d931d53dd436ab0544c9e76eafa3a_0.geojson",
        "type":"point"
    },
    {
        "id": 4,
        "name":"Community Behavioral Health Centers",
        "link": "https://opendata.arcgis.com/datasets/47c5f7f84d8a4740acd9acd4ee7c2caa_0.geojson",
        "type":"point"
    },
    {
        "id": 5,
        "name":"WIC Clinic Locations",
        "link": "https://opendata.arcgis.com/datasets/1f51d2a2de3642e594d19d02c9950576_0.geojson",
        "type":"point"
    },
    {
        "id": 6,
        "name":"Air Ambulance Agencies",
        "link": "https://opendata.arcgis.com/datasets/a5236c32b2c64c7cb785dd0dca42142e_1.geojson",
        "type":"point"
    },
    {
        "id": 7,
        "name":"Health Facilities",
        "link": "https://opendata.arcgis.com/datasets/914bc3a28a644f95b13829128e69ede4_0.geojson",
        "type":"point"
    },
    {
        "id": 8,
        "name":"Colorado Local Public Health Agency Locations",
        "link": "https://opendata.arcgis.com/datasets/982070ee811e4961bcc24afc45c7b745_0.geojson",
        "type":"point"
    },
    {
        "id": 9,
        "name":"Colorado Licensed Childcare Providers",
        "link": "https://opendata.arcgis.com/datasets/ba8161673d734074a081006adc7ea496_0.geojson",
        "type":""
    },
    {
        "id": 10,
        "name":"Self Care Difficulty (Census Tracts)",
        "link": "https://opendata.arcgis.com/datasets/e084d34fcbec41488ddfd9fd84d08cef_17.geojson",
        "type":"Polygon",
        "caller":"Disability_TCNPop_With_A_Disability"
    },
    {
      "id": 11,
      "name":"Cigarette Smoking in Adults",
      "link": "https://opendata.arcgis.com/datasets/37f465fabfaa4e5db52fdd1ec8d72203_0.geojson",
      "type":"Polygon",
      "caller":"SMOKER"
  }
    
]

var mapToDisease = [
  {
     "diseaseID":1,
     "linkedMapsId":[1,2,6,7,10] 
  },{
      "diseaseID":2,
      "linkedMapsId":[1,2,6,7,10] 
  },
  {
      "diseaseID":3,
      "linkedMapsId":[1,2,6,7,10] 
  },
  {
      "diseaseID":4,
      "linkedMapsId":[1,5,7,8,9,10,11] 
  },
  {
      "diseaseID":5,
      "linkedMapsId":[2,3,5,7] 
  },
  {
      "diseaseID":6,
      "linkedMapsId":[1,2,6,7,10] 
  },
  {
      "diseaseID":7,
      "linkedMapsId":[1,2,6,7,10] 
  },{
      "diseaseID":8,
      "linkedMapsId":[2,4]
  },
  {
      "diseaseID":9,
      "linkedMapsId":[2,4,5,10] 
  },
  {
      "diseaseID":10,
      "linkedMapsId":[1,2,5,6,7,10] 
  } 
] 