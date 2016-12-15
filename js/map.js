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
})