
Template.removeSymptoms.events({
    'click .showMap': function(){
        var selectedConditions = Session.get('selectedCondition'); 
        var links = []  
        for(var i = 0; i < mapData.maps.length; i++){
            if(typeof mapData.maps[i].relatedSymptoms !== 'undefined'){
                if(checkSymptomsAgainstList(mapData.maps[i],selectedConditions[0]["text-list"][0].text["html"])){
                    links.push(mapData.maps[i]);
                }
            }
        }
        Session.set('linksToMap',links); 
        Router.go("map2");
    },
    'click .removeMap': function(event){
        debugger
        var c = Session.get('linksToMap');
        for(var i = 0; i < c.length; i++){
            if(c[i].name === event.currentTarget.id) c.splice(i,1);
        }
        Session.set('linksToMap',c) 
        
    }
});
Template.removeSymptoms.helpers({
    returnMapsWereDisplayingForSymptoms() {
        var selectedConditions = Session.get('selectedCondition'); 
        var maps = []  
        for(var i = 0; i < mapData.maps.length; i++){
            if(typeof mapData.maps[i].relatedSymptoms !== 'undefined'){
                if(checkSymptomsAgainstList(mapData.maps[i],selectedConditions[0]["text-list"][0].text["html"])){
                    maps.push(mapData.maps[i].name);
                }
            }
        }
        return maps; 
    }
})

function checkSymptomsAgainstList(MD,TTLK){
    if(typeof MD.relatedSymptoms !== 'undefined'){
        for(var j = 0; j < MD.relatedSymptoms.length; j++){
            if(TTLK.indexOf(MD.relatedSymptoms[j]) !== -1) return true ;
        }
    }
    return false; 
}
var mapData = {
    "maps": [
        {
            "id": 1,
            "name":"Trauma Center Designation",
            "link": "https://opendata.arcgis.com/datasets/3d1927123c2b42baa710029c122ae21c_0.geojson",
            "type":"point",
            "relatedSymptoms": ["cancer","cough","breath","smoke","heart","arteries","cardiovascular","blood","stroke","bladder","cervix","colon","Esophagus","Kidney","Larynx","Liver","Oropharynx","Pancreas","Stomach","Trachea","Preterm","Stillbirth","Low birth weight","pregnancy","Orofacial clefts"]            
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
            "name":"Resource Providers: Colorado Community Inclusion",
            "link": "https://opendata.arcgis.com/datasets/f50f455df69a4841ba95a0df3957df11_0.geojson",
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
            "type":"point"
        },
        {
            "id": 10,
            "name":"Self Care Difficulty (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/e084d34fcbec41488ddfd9fd84d08cef_17.geojson",
            "type":"range",
            "caller":"Disability_Population_Total_Civilian_Noninstitutionalized"
        },
        {
            "id": 11,
            "name":"Low Weight Birth Rate (Counties)",
            "link": "https://opendata.arcgis.com/datasets/6f782c21fb6c4eb69a71316dd2a7293e_8.geojson",
            "type":"range",
            "caller":"LWB_ADJRATE"
        },
        {
            "id": 12,
            "name":"No Regular Medical Checkup in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/0bff29614fba4cc8b3a36b56a61f8e69_13.geojson",
            "type":"range",
            "caller":"NOCHCKUP"
        },
        {
            "id": 13,
            "name":"Cigarette Smoking in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/37f465fabfaa4e5db52fdd1ec8d72203_0.geojson",
            "type":"range",
            "caller":"SMOKER",
            "relatedSymptoms": ["cancer","cough","breath","smoke","heart","arteries","cardiovascular","blood","stroke","bladder","cervix","colon","Esophagus","Kidney","Larynx","Liver","Oropharynx","Pancreas","Stomach","Trachea","Preterm","Stillbirth","Low birth weight","Ectopic pregnancy","Orofacial clefts"
            ]
        },
        {
            "id": 14,
            "name":"Alcohol Consumption in Adults: Heavy Drinking - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/f3119526b98a47f7bf1babf54c111c5d_6.geojson",
            "type":"range",
            "caller":"HVYDRK",
            "relatedSymptoms": ["addiction","alchohol","aggression", "agitation","compulsive behavior", "self-destructive behavior", "lack of restraint"]
        },
        {
            "id": 15,
            "name":"Suicide Mortality Rate (Counties)",
            "link": "https://opendata.arcgis.com/datasets/1bd512211246436b83e9cb8377ba40b1_12.geojson",
            "type":"range",
            "caller":"SUICIDE_ADJRATE",
            "relatedSymptoms":["mental illness","depression","teenager", "alchohol", "Bipolar", "Borderline personality", "Drug use", "addiction","PTSD","Schizophrenia"]

        },
        {
            "id": 16,
            "name":"Influenza Hospitalization Rate (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/6f7e3ea2e0f3452db685980e5621ed08_7.geojson",
            "type":"range",
            "caller":"INFLUENZA_ADJRATE",
            "relatedSymptoms": ["runny nose"," nasal congestion","sneezing", "sore throat", "cough", "headache"]
        },
        {
            "id": 17,
            "name":"Asthma Hospitalization Rate (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/a176548521c546f0b9be512197d7d8f4_1.geojson",
            "type":"range",
            "caller":"ASTHMA_ADJRATE",
            "relatedSymptoms" : ["breath","Wheezing","Coughing","Chest tightness","Shortness of breath"]
        },
        {
            "id": 18,
            "name":"Mobility/Ambulatory Difficulty (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/6566b786e56b4101b3076305e0beff00_18.geojson",
            "type":"range",
            "caller":"Disability_TCNPop_With_An_Ambulatory_Difficulty_Age_Over_4"
        },
        {
            "id": 19,
            "name":"Obesity in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/d7f4afc451b5495d9984bd4a5d98b200_8.geojson",
            "type":"range",
            "caller":"OBESE"
        },
        {
            "id": 20,
            "name":"Delayed Medical Care in Adults ($) - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/927939a6c52145bebe2acfdd6c7fa97d_4.geojson",
            "type":"range",
            "caller":"DELMCC"
        },
        {
            "id": 21,
            "name":"Alcohol Consumption: Adults Who Binge Drink - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/b3e3108f65634da5a931a75793f65ab1_2.geojson",
            "type":"range",
            "caller":"BINGED"
        },
        {
            "id": 22,
            "name":"Influenza Hospitalization Rate (Counties)",
            "link": "https://opendata.arcgis.com/datasets/dd655a512f884f72a8fa03de2c0730a2_6.geojson",
            "type":"range",
            "caller":"INFLUENZA_ADJRATE"
        },
        {
            "id": 23,
            "name":"Asthma Hospitalization Rate (Counties)",
            "link": "https://opendata.arcgis.com/datasets/3ca3d95062394449b245dab65e6d882d_0.geojson",
            "type":"range",
            "caller":"ASTHMA_ADJRATE"
        },
        {
            "id": 24,
            "name":"Independent Living Difficulty (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/9eaebfa432f04eabb2e405a4f1256d68_19.geojson",
            "type":"range",
            "caller":"Disability_TCNPop_With_A_Disability"
        },
        {
            "id": 25,
            "name":"Overweight and Obese Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/3702d9b48efb49a8870bf0e375ea3817_9.geojson",
            "type":"range",
            "caller":"OWOBESE"
        },
        {
            "id": 26,
            "name":"Diabetes in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/8f2dfdf3435e45929c1a391e03f214c9_5.geojson",
            "type":"range",
            "caller":"DIAB"
        },
        {
            "id": 27,
            "name":"Heart Disease Mortality Rate (Census Tracts)",
            "link":"https://opendata.arcgis.com/datasets/f1a592eef8384946b0ae64701bece065_5.geojson",
            "type":"range",
            "caller":"HD_ADJRATE"
        },
        {
            "id": 28,
            "name":"Asthma Prevalence in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/99d966b6ab75450c93569a3f112f3002_1.geojson",
            "type":"range",
            "caller":"ASTHMA"
        },
        {
            "id": 29,
            "name":"Physical Health in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/a2ba9f872094417782f70fc65cde2f11_10.geojson",
            "type":"range",
            "caller":"PHYSH"
        },
        {
            "id": 30,
            "name":"Motor Vehicle Accident Mortality Rate (Counties)",
            "link": "https://opendata.arcgis.com/datasets/953c4e17929646938c262374e2c2e014_10.geojson",
            "type":"range",
            "caller":"MVA_ADJRATE"
        },
        {
            "id": 31,
            "name":"Drug Poisoning or Overdose involving Rx Opioid Analgesic or Heroin Mortality Rate (Census Tract)",
            "link": "https://opendata.arcgis.com/datasets/4cb7534bb73341f4aa2f76b8069f2428_19.geojson",
            "type":"range",
            "caller":"POD_DEATH_ADJRATE"
        },
        {
            "id": 32,
            "name":"Hearing Difficulty (Census Tract)",
            "link":"https://opendata.arcgis.com/datasets/830436b761f24ee589216266feac5640_14.geojson",
            "type":"range",
            "caller":"Disability_TCNPop_With_A_Hearing_Difficulty"
        },
        {
            "id": 33,
            "name":"Health Status in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/23ae398f235f471c8b482a67bdb6b141_12.geojson",
            "type":"range",
            "caller":"POPOVER18"
        },
        {
            "id": 34,
            "name":"Low Weight Birth Rate (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/7673fa687a7a43b29c2f602db4d33cd9_9.geojson",
            "type":"range",
            "caller":"LWB_ADJRATE"
        },
        {
            "id": 35,
            "name":"Mental Health in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/e81e76791f7f47e080f39aafd79516f8_7.geojson",
            "type":"range",
            "caller":""
        },
        {
            "id": 36,
            "name":"Physical Activity in Adults - CDPHE Community Level Estimates (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/b3a561e7cd584586a724aaff31bde04f_11.geojson",
            "type":"range",
            "caller":"POPOVER18"
        },
        {
            "id": 37,
            "name":"Diabetes Hospitalization Rate (Census Tracts)",
            "link": "https://opendata.arcgis.com/datasets/9567507342654bb1bf8cfaaa3b498b3f_3.geojson",
            "type":"range",
            "caller":"DIABETES_ADJRATE"
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
