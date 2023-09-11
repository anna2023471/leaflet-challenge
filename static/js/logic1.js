// Define the query URL
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // 
    createFeatures(data.features);
});

    // Create map with all its elements based on data retrieved in request
    function createFeatures(earthquakeData) {

        // Define function to display a popup for each feature that shows the place, magnitude, and depth
        function onEachFeature(feature, layer) {
          layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude:\n${feature.properties.mag}</p><p>Depth:\n${feature.geometry.coordinates[2]}\nkm</p>`);
                  }
        
        // Create earthquakes layer based on data in the imported file
        let earthquakes = L.geoJSON(earthquakeData, {
            // Set circle marker colour to be dependent on earthquake depth
            style: function(feature) {let depth = feature.geometry.coordinates[2];
                                        if (depth >= 90) {return {fillColor: "#1A5276"}}
                                        else if (depth >= 90) {return {fillColor: "D4AC0D"}}
                                        else if (depth >= 70) {return {fillColor: "#8E44AD"}}
                                        else if (depth >=50) {return {fillColor: "#A93226"}}
                                        else if (depth >=30) {return {fillColor: "#F39C12"}}
                                        else if (depth >=10) {return {fillColor: "#F1C40F"}}
                                        else {return {fillColor: "#707B7C"}}},
            // At each feature, attach the popup
            onEachFeature: onEachFeature,
            // Set marker size to be dependent on earthquake magnitude
            pointToLayer: function (feature, latlng) {
                function getOptions(properties) {return {radius: parseInt(feature.properties.mag)*3, 
                                                        opacity: 0.9, 
                                                        fillOpacity: 1, 
                                                        weight:1, 
                                                        color: "#17202A"}}
                // Place circle marker at coordinates in each feature
                return L.circleMarker(latlng, getOptions(feature.properties))}                                                                 
        });

        // Create base layer for map
        let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  });
    
        // Create map with base and earthquakes layer
        let myMap = L.map("map", {
                center: [
                    0, 90
                ],
                zoom: 3,
                layers: [street, earthquakes]
            });

        // Attach the earthquakes layer to the map   
        earthquakes.addTo(myMap);    
    
        // Create legend icon
        let legend = L.control({position: 'bottomright'});
    
        // Create legend as new html element and populate with circle marker colours and earthquake depth categories
        legend.onAdd = function () {
        
                let div = L.DomUtil.create("div", "legend");
                  
                div.innerHTML += '<i style="background-color:#707B7C"></i><span>-10-10</span><br>';
                div.innerHTML += '<i style="background-color:#F1C40F""></i><span>10-30</span><br>';
                div.innerHTML += '<i style="background-color:#F39C12""></i><span>30-50</span><br>';
                div.innerHTML += '<i style="background-color:#A93226""></i><span>50-70</span><br>';
                div.innerHTML += '<i style="background-color:#8E44AD"></i><span>70-90</span><br>';
                div.innerHTML += '<i style="background-color:#1A5276"></i><span>90+</span>';
        
            return div;
        };
       
        // Attach legend to map
        legend.addTo(myMap);
     
    };