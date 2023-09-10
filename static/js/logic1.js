let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

    function createFeatures(earthquakeData) {

        // Define a function that we want to run once for each feature in the features array.
        // Give each feature a popup that describes the place and time of the earthquake.
        function onEachFeature(feature, layer) {
          layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude:\n${feature.properties.mag}</p><p>Depth:\n${feature.geometry.coordinates[2]}\nkm</p>`);
                  }
        

    let earthquakes = L.geoJSON(earthquakeData, {
        style: function(feature) {let depth = feature.geometry.coordinates[2];
                                                        if (depth >= 90) {return {fillColor: "#1A5276"}}
                                                        else if (depth >= 90) {return {fillColor: "D4AC0D"}}
                                                        else if (depth >= 70) {return {fillColor: "#8E44AD"}}
                                                        else if (depth >=50) {return {fillColor: "#A93226"}}
                                                        else if (depth >=30) {return {fillColor: "#F39C12"}}
                                                        else if (depth >=10) {return {fillColor: "#F1C40F"}}
                                                        else {return {fillColor: "#707B7C"}}},
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            function getOptions(properties) {return {radius: parseInt(feature.properties.mag)*3, opacity: 0.9, fillOpacity: 1, weight:1, color: "#17202A"}}
            return L.circleMarker(latlng, getOptions(feature.properties))}                                                        
        
            
    });

    

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  });

    let myMap = L.map("map", {
        center: [
            0, 90
        ],
        zoom: 3,
        layers: [street, earthquakes]
        });

        
        earthquakes.addTo(myMap);    
        
    let legend = L.control({position: 'bottomright'});

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
            
      legend.addTo(myMap);
     
    };