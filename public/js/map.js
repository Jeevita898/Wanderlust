//onst { coordinates } = require("@maptiler/sdk");

  const mapTilerKey = mapKey;
   console.log(mapTilerKey);
const map = new maplibregl.Map({
 
  container: 'map',
  style: `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerKey}`,
  center:listing.geometry.coordinates, 
  zoom: 10
});

//console.log(listing.geometry.coordinates);

const marker = new maplibregl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)//Listing.geometrry.coordinates
  .setPopup(new maplibregl .Popup ({offset: 25 }).setHTML(`<h4>${listing.title}</h4> <p>Exact Location Will be Provided Aftre Booking</p>`))
  .addTo(map);
