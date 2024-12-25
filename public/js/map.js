mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. 
    zoom: 9 // starting zoom
});

// It is used to create the Marker on the Map.
const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)  // Here, we getting this coordinates from show.ejs file. Because we can't access those ejs related stuff her in this file.
.setPopup(new mapboxgl.Popup({offset: 25, className: 'my-class'})
.setHTML(`<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`))
.addTo(map);