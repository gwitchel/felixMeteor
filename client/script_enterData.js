
Template.quiz.events({
    'click .next': function(){ 
        // when the entire enter data form is submitted get the selected conditions from enterSymptomData template and add in maps assocciated with quiz
        var selectedConditions = Session.get('selectedCondition'); 
        var links = []  
        for(var i = 0; i < mapData.maps.length; i++){
            if(typeof mapData.maps[i].relatedSymptoms !== 'undefined' && typeof selectedConditions !== 'undefined'){
                // if the symptoms from any of the maps exist in condition descriptions gotten from the gene refrence add them
                if(checkSymptomsAgainstList(mapData.maps[i],selectedConditions[0]["text-list"][0].text["html"])){ 
                    links.push(mapData.maps[i]);
                }
            }
        }
        var quizLinks = returnLinksToMapsWithQuiz(); // gets all of the information from the quiz and adds in maps reccomended by quiz
        for(var i = 0; i < quizLinks.length; i++){
            links.push(quizLinks[i]); // adds quiz items to ongoig list
        }
        if(links.length < 1){ // no maps found
            window.alert("oops, looks like we don't have enough information to generate your map, try answering some questions or adding a condition") 
        } else {
            links = removeDoubles(links); // remove any maps listed twice                        
            Session.set('linksToMap',links);  // all maps needing to be mapped are set to session
            Router.go("map2");  // routes to map
        }
    }
})

Template.enterSymptomData.helpers({
    returnDiseases() {
        // Returns a list of conditions that should be shown because the user selected them
        var c = Session.get('selectedCondition')
        if(typeof c !== 'undefined'){
            var conditionsToList = []; 
            for(var i = 0; i < c.length;i++){
                conditionsToList.push( 
                    c[i].name);
            }
            return conditionsToList;
        } else {
            return;
        }
    },
    returnIsError(){
        // checks if something went wrong retreiving data from the gene reference and if the help page eeds to be shown
        if(Session.get('isError') === true  ) return true; 
        return false;                                 
    } 
});
Template.enterSymptomData.events({
    'click .removeCondition': function(event){
        // removes a condition already selected 
        var c = Session.get('selectedCondition');
        for(var i = 0; i < c.length; i++){
            if(c[i].name === event.currentTarget.id) c.splice(i,1);
        }
        Session.set('selectedCondition',c)
        //console.log(event.currentTarget.id);

    }
});
function returnLinksToMapsWithQuiz(){
    // adds in reccomended datasets based on the quiz
    // maps/symptoms related to conditions checked or needs are sourced from information provided by medline plus
    var mapNames = []; 
    if($("#unexpectedMedicleTreatment").is(':checked')) mapNames.push(getMapById(1),getMapById(3),getMapById(6));
    if($("#becommingPregnant").is(':checked')) mapNames.push(getMapById(9),getMapById(11),getMapById(13),getMapById(15),getMapById(34));
    if($("#difficultyAttendingAppointments").is(':checked')) mapNames.push(getMapById(5),getMapById(10),getMapById(12),getMapById(18),getMapById(20),getMapById(24));
    if($("#interestInGeneralHealth").is(':checked')) mapNames.push(getMapById(13),getMapById(19),getMapById(29),getMapById(33),getMapById(35),getMapById(36),getMapById(30));
    if($("#needDrugTreatmentProgram").is(':checked')) mapNames.push(getMapById(2));    
    var bodyFat = $("#bodyFat").val();
    var age = $("#age").val();
    if(parseInt(bodyFat) > 37) mapNames.push(getMapById(18),getMapById(19),getMapById(24),getMapById(25),getMapById(26),getMapById(27),getMapById(29),getMapById(33),getMapById(36),getMapById(37));
    if(parseInt(age) > 65) mapNames.push(getMapById(5),getMapById(10),getMapById(12),getMapById(18),getMapById(20),getMapById(24));
    return mapNames; 
}  
function getMapById(id){
    // finds the map object related to it's id 
    for(var i = 0; i < mapData.maps.length; i++){
        if(mapData.maps[i].id === id){
            console.log(mapData.maps[i])
             return mapData.maps[i];
        }
    }
}
function removeDoubles(listOfMaps){
    // takes the list of map and removes any maps occuring twice
    var ids = [];
    var finalMaps = []; 
    for(var i = 0; i < listOfMaps.length; i++){
        ids.push(listOfMaps[i].id);
    }
    for(var i = 1; i < mapData.maps[mapData.maps.length-1].id + 1; i++){
        if(listOfMaps.indexOf(getMapById(i)) !== -1 ) finalMaps.push(getMapById(i));
    }
    return finalMaps; 
}
function checkSymptomsAgainstList(MD,TTLK){
    // checks a list of symptoms related to a map and if they exist in a symptom description from a condition from the gene database
    if(typeof MD.relatedSymptoms !== 'undefined'){
        for(var j = 0; j < MD.relatedSymptoms.length; j++){
            if(TTLK.indexOf(MD.relatedSymptoms[j]) !== -1) return true ;
        }
    }
    return false; 
}
// list of map objects
var mapData = {
    "maps": [
        {
            "id": 1,
            "name":"Trauma Center Designation",
            "link": "https://opendata.arcgis.com/datasets/3d1927123c2b42baa710029c122ae21c_0.geojson",
            "type":"point",
            "caller": "HOSPITAL_NAME"               
        },
        {
            "id": 2,
            "name":"Colorado Drug Treatment Programs and Resources",
            "link": "https://opendata.arcgis.com/datasets/93746151117947fbaf2f4d76ff257cda_0.geojson",
            "type":"point",
            "caller": "CLINIC_NAME"  
        },
        {
            "id": 3,
            "name":"EMS and Ambulance Agencies",
            "link": "https://opendata.arcgis.com/datasets/5a7d931d53dd436ab0544c9e76eafa3a_0.geojson",
            "type":"point",
            "caller": "Organization_Name" 
        },
        {
            "id": 4,
            "name":"Community Behavioral Health Centers",
            "link": "https://opendata.arcgis.com/datasets/47c5f7f84d8a4740acd9acd4ee7c2caa_0.geojson",
            "type":"point",
            "caller":"AGENCY_NAME" 
        },
        {
            "id": 5,
            "name":"Resource Providers: Colorado Community Inclusion",
            "link": "https://opendata.arcgis.com/datasets/f50f455df69a4841ba95a0df3957df11_0.geojson",
            "type":"point",
            "caller":"RESOURCE_NAME"
        },
        {
            "id": 6,
            "name":"Air Ambulance Agencies",
            "link": "https://opendata.arcgis.com/datasets/a5236c32b2c64c7cb785dd0dca42142e_1.geojson",
            "type":"point",
            "caller":"AGENCY_NAME"
            
        },
        {
            "id": 7,
            "name":"Health Facilities",
            "link": "https://opendata.arcgis.com/datasets/914bc3a28a644f95b13829128e69ede4_0.geojson",
            "type":"point",
            "caller":"FAC_NAME"
        },
        {
            "id": 8,
            "name":"Colorado Local Public Health Agency Locations",
            "link": "https://opendata.arcgis.com/datasets/982070ee811e4961bcc24afc45c7b745_0.geojson",
            "type":"point",
            "caller":"PUBLIC_HEALTH_AGENCY"
        },
        {
            "id": 9,
            "name":"Colorado Licensed Childcare Providers",
            "link": "https://opendata.arcgis.com/datasets/ba8161673d734074a081006adc7ea496_0.geojson",
            "type":"point",
            "caller":"PROVIDER_NAME"
        },
        {
            "id": 10,
            "name":"Self Care Difficulty (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/e084d34fcbec41488ddfd9fd84d08cef_17.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"Disability_Population_Total_Civilian_Noninstitutionalized"
        },
        {
            "id": 11,
            "name":"Low Weight Birth Rate (Counties)",
            "link": "https://opendata.arcgis.com/datasets/6f782c21fb6c4eb69a71316dd2a7293e_8.geojson",
            "type":"range",
            "subtype":"COUNTY_NAME",
            "caller":"LWB_ADJRATE"
        },
        {
            "id": 12,
            "name":"No Regular Medical Checkup in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/0bff29614fba4cc8b3a36b56a61f8e69_13.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"NOCHCKUP"
        },
        {
            "id": 13,
            "name":"Cigarette Smoking in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/37f465fabfaa4e5db52fdd1ec8d72203_0.geojson",
            "type":"range",
            "subtype":"COUNTY",
            "caller":"SMOKER",
            "relatedSymptoms": ["cancer","cough","breath","smoke","heart","arteries","cardiovascular","blood","stroke","bladder","cervix","colon","Esophagus","Kidney","Larynx","Liver","Oropharynx","Pancreas","Stomach","Trachea","Preterm","Stillbirth","Low birth weight","pregnancy","Orofacial clefts"
            ]
        },
        {
            "id": 14,
            "name":"Alcohol Consumption in Adults: Heavy Drinking - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/f3119526b98a47f7bf1babf54c111c5d_6.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"HVYDRK",
            "relatedSymptoms": ["addiction","alchohol","aggression", "agitation","compulsive behavior", "self-destructive behavior", "lack of restraint"]
        },
        {
            "id": 15,
            "name":"Suicide Mortality Rate (Counties)",
            "link": "https://opendata.arcgis.com/datasets/1bd512211246436b83e9cb8377ba40b1_12.geojson",
            "type":"range",
            "subtype":"COUNTY_NAME",
            "caller":"SUICIDE_ADJRATE",
            "relatedSymptoms":["mental illness","depression","teenager", "alchohol", "Bipolar", "Borderline personality", "Drug use", "addiction","PTSD","Schizophrenia"]

        },
        {
            "id": 16,
            "name":"Influenza Hospitalization Rate (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/6f7e3ea2e0f3452db685980e5621ed08_7.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"INFLUENZA_ADJRATE",
            "relatedSymptoms": ["runny nose"," nasal congestion","sneezing", "sore throat", "cough", "headache"]
        },
        {
            "id": 17,
            "name":"Asthma Hospitalization Rate (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/a176548521c546f0b9be512197d7d8f4_1.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"ASTHMA_ADJRATE",
            "relatedSymptoms" : ["breath","Wheezing","Coughing","Chest tightness","Shortness of breath"]
        },
        {
            "id": 18,
            "name":"Mobility/Ambulatory Difficulty (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/6566b786e56b4101b3076305e0beff00_18.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"Disability_TCNPop_With_An_Ambulatory_Difficulty_Age_Over_4",
            "relatedSymptoms" : ["joint", "swelling","movement","wheelchair", "arthritis","move","hypomobility"]
        },
        {
            "id": 19,
            "name":"Obesity in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/d7f4afc451b5495d9984bd4a5d98b200_8.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"OBESE",
            "relatedSymptoms" : ["weight","fat","leptin","hyperphagia","overating","binge eating"]
        },
        {
            "id": 20,
            "name":"Delayed Medical Care in Adults ($) - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/927939a6c52145bebe2acfdd6c7fa97d_4.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"DELMCC"
        },
        {
            "id": 21,
            "name":"Alcohol Consumption: Adults Who Binge Drink - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/b3e3108f65634da5a931a75793f65ab1_2.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"BINGED",
            "relatedSymptoms" : ["alcoholism","addiction","seizures","cancer"]
        },
        {
            "id": 22,
            "name":"Influenza Hospitalization Rate (Counties)",
            "link": "https://opendata.arcgis.com/datasets/dd655a512f884f72a8fa03de2c0730a2_6.geojson",
            "type":"range",
            "subtype":"COUNTY_NAME",
            "caller":"INFLUENZA_ADJRATE",
            "relatedSymptoms" : ["Body or muscle aches", "Chills","Cough","Fever","Headache","Sore throat"]
            
        },
        {
            "id": 23,
            "name":"Asthma Hospitalization Rate (Counties)",
            "link": "https://opendata.arcgis.com/datasets/3ca3d95062394449b245dab65e6d882d_0.geojson",
            "type":"range",
            "subtype":"COUNTY_NAME",
            "caller":"ASTHMA_ADJRATE",
            "relatedSymptoms" : ["breath","Wheezing","Coughing","Chest tightness","Shortness of breath"]
        },
        {
            "id": 24,
            "name":"Independent Living Difficulty (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/9eaebfa432f04eabb2e405a4f1256d68_19.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"Disability_TCNPop_With_A_Disability"
        },
        {
            "id": 25,
            "name":"Overweight and Obese Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/3702d9b48efb49a8870bf0e375ea3817_9.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"OWOBESE",
            "relatedSymptoms" : ["weight","fat","leptin","hyperphagia","overating","binge eating"]
        },
        {
            "id": 26,
            "name":"Diabetes in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/8f2dfdf3435e45929c1a391e03f214c9_5.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"DIAB",
            "relatedSymptoms" : ["weight","fat","leptin","hyperphagia","pancreas"," beta cells", "insulin", "glucose","polyuria","polydipsia","hypoglycemia"]
        },
        {
            "id": 27,
            "name":"Heart Disease Mortality Rate (Census Tracts)",
            "link":"https://opendata.arcgis.com/datasets/f1a592eef8384946b0ae64701bece065_5.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"HD_ADJRATE",
            "relatedSymptoms" : ["heart","oxygen","blood","heart murmur","tachypnea","hypotension", "hypoxemia", "cyanosis","aorta","coarctation of the aorta","double-outlet right ventricle","D-transposition of the great arteries","Ebstein anomaly", "hypoplastic left heart syndrome", "interrupted aortic arch", "pulmonary atresia", "single ventricle", "total anomalous pulmonary venous connection", "tetralogy of Fallot", "tricuspid atresia", "truncus arteriosus"]          
        },
        {
            "id": 28,
            "name":"Asthma Prevalence in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/99d966b6ab75450c93569a3f112f3002_1.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"ASTHMA",
            "relatedSymptoms" : ["breath","Wheezing","Coughing","Chest tightness","Shortness of breath"]
            
        },
        {
            "id": 29,
            "name":"Physical Health in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/a2ba9f872094417782f70fc65cde2f11_10.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"PHYSH"
        },
        {
            "id": 30,
            "name":"Motor Vehicle Accident Mortality Rate (Counties)",
            "link": "https://opendata.arcgis.com/datasets/953c4e17929646938c262374e2c2e014_10.geojson",
            "type":"range",
            "subtype":"COUNTY_NAME",
            "caller":"MVA_ADJRATE"
        },
        {
            "id": 31,
            "name":"Drug Poisoning or Overdose involving Rx Opioid Analgesic or Heroin Mortality Rate (Census Tract)",
            "link": "https://opendata.arcgis.com/datasets/4cb7534bb73341f4aa2f76b8069f2428_19.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"POD_DEATH_ADJRATE",
            "relatedSymptoms" : ["addiction","overdose","Opioids","drug"]
            
        },
        {
            "id": 32,
            "name":"Hearing Difficulty (Census Tract)",
            "link":"https://opendata.arcgis.com/datasets/830436b761f24ee589216266feac5640_14.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"Disability_TCNPop_With_A_Hearing_Difficulty",
            "relatedSymptoms" : ["Nonsyndromic","hearing","deafness","hearing loss","sensorineural"]            
        },
        {
            "id": 33,
            "name":"Health Status in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/23ae398f235f471c8b482a67bdb6b141_12.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"POPOVER18"
        },
        {
            "id": 34,
            "name":"Low Weight Birth Rate (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/7673fa687a7a43b29c2f602db4d33cd9_9.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"LWB_ADJRATE"
        },
        {
            "id": 35,
            "name":"Mental Health in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/e81e76791f7f47e080f39aafd79516f8_7.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"MNTLD",
            "relatedSymptoms" : ["mental","depression","Panic","Obsessive-compulsive","Post-traumatic stress","Phobias","Generalized anxiety disorder","Anxiety" , "panic","Bipolar","Depression","Mood","Personality","Psychotic"
            ]                        
        },
        {
            "id": 36,
            "name":"Physical Activity in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/b3a561e7cd584586a724aaff31bde04f_11.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"POPOVER18"
        },
        {
            "id": 37,
            "name":"Diabetes Hospitalization Rate (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/9567507342654bb1bf8cfaaa3b498b3f_3.geojson",
            "type":"range",
            "subtype":"County",
            "caller":"DIABETES_ADJRATE",
            "relatedSymptoms" : ["weight","fat","leptin","hyperphagia","overating","binge eating","preeclampsia"]
        },
        {
            "id": 38,
            "name":"Queried Sources of Air Pollution (Permit Modeling)",
            "link": "https://opendata.arcgis.com/datasets/011a49216f314ff3b2473910f87cfb5b_0.geojson",
            "type":"point 2",
            "caller":""
        },
        {
            "id": 39,
            "name":"Particulate Matter (PM) 10 microns Attainment Maintenance Area Colorado",
            "link": "https://opendata.arcgis.com/datasets/df5ac5b9ae4a439fa48c5f841b99beae_3.geojson",
            "type":"single_color_range"
        },
        {
            "id": 40,
            "name":"Smoke-Sensitive Areas (for health, safety and/or aesthetic reasons)",
            "link": "https://opendata.arcgis.com/datasets/ed5f93d81e4e4bf5b9b5ade98141be41_0.geojson",
            "type":"single_color_range"
        },
        {
            "id": 41,
            "name":"Population Density (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/2128d5e4260a47c28b3fd124f79008a1_0.geojson",
            "type":"range",
            "caller":"Population_Density_PerLandSquareMile"
        }
    ] 
}

