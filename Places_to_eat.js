 // Variables to store user location and displayed places
 let userLatitude = null;
 let userLongitude = null;
 let displayedPlaces = new Set(); // Use a Set to track displayed places quickly

 // Function to fetch place data
 async function fetchPlaceData(placeId, nameId) {
     if (userLatitude && userLongitude) {
         const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:8046.7,${userLatitude},${userLongitude})[amenity=restaurant];out;`;
         
         try {
             const response = await fetch(overpassUrl);
             const data = await response.json();

             // Filter out already displayed places
             const filteredPlaces = data.elements.filter(place => place.tags.name && !displayedPlaces.has(place.tags.name));
             if (filteredPlaces.length > 0) {
                 const place = filteredPlaces[Math.floor(Math.random() * filteredPlaces.length)];
                 const placeName = place.tags.name;

                 // Display place name and update displayedPlaces
                 displayedPlaces.add(placeName);
                 document.getElementById(nameId).innerText = placeName;
             } else {
                 document.getElementById(nameId).innerText = "No new restaurants found nearby.";
             }
         } catch (error) {
             console.error('Error fetching place data:', error);
         }
     }
 }

 // Function to handle place choice and refresh the other option
 function pickPlace(selectedPlace) {
     document.getElementById('result').innerText = `You chose ${selectedPlace}. Refreshing options...`;

     // Refresh the other option to a new random place
     if (selectedPlace === 'Place1') {
         fetchPlaceData('place2', 'place2-name');
     } else {
         fetchPlaceData('place1', 'place1-name');
     }
 }

 // Function to request user location once and initialize the page
 function initializePage() {
     navigator.geolocation.getCurrentPosition((position) => {
         userLatitude = position.coords.latitude;
         userLongitude = position.coords.longitude;

         // Fetch initial options
         fetchPlaceData('place1', 'place1-name');
         fetchPlaceData('place2', 'place2-name');
     }, (error) => {
         console.error('Error getting location:', error);
     });
 }

 // Initialize page once location is obtained
 document.addEventListener("DOMContentLoaded", initializePage);