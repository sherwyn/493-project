// jQuery onLoad
$(function() {
  // Get address from localStorage.
  var address = localStorage.getItem("address");
  
  // Set the neighborhood label.
  $("#neighborhood-label").text(address);
  
  // Set the neighborhood label.
  $("#crime-trends").text("Crime Trends in " + address);
  
  // Set the neighborhood label.
  $("#crime-reports").text("Crime Reports in " + address);
  
  // Set the date label.
  $("#date-range").text("Nov. 2 - Dec. 2, 2016");
  
  $("form").submit(function(e) {
    var address = $("#address").val();
    
    // If no address, prevent form submit
    if (!address) {
      e.preventDefault()
    }
    
    // Save input to localStorage. We'll access this later in map.js.
    localStorage.setItem("address", address);
  })

  var mymap = L.map('mapid').setView([42.3314, -83.0458], 11);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaWFuenljIiwiYSI6ImNpd2I3bThjYTA0bmgyb3F1eHpiYXI2bTgifQ.uvJQRBGq8wA3BlyFcIXV8g', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> ' + 
      'Imagery &copy <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(mymap);

  L.marker([42.344365, -83.076050999999]).addTo(mymap)
    .bindPopup('<b style="font-size: 20px"> Commonwealth St, Detroit, MI 48208</b>').openPopup();



})