// jQuery onLoad
$(function() {
  $("form").submit(function(e) {
    var address = $("#address").val();
    
    // If no address, prevent form submit
    if (!address) {
      e.preventDefault()
      return
    }
    var new_address = address.split(' ').join('+');
    // Save input to localStorage. We'll access this later in map.js.
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + new_address+",+Detroit";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); 
    xmlHttp.send();
    var str = xmlHttp.responseText;

    var result = jQuery.parseJSON(str);
    if (result.status =="ZERO_RESULTS") {
      e.preventDefault()
      return
    }
    console.log(result.results.length);
    localStorage.setItem("address", result.results[0].formatted_address);
    localStorage.setItem("coordinates", result.results[0].geometry.location);
  })
})
