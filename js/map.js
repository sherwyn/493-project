// jQuery onLoad
$(function() {
  // Get address from localStorage.
  var address = localStorage.getItem("address");
  
  // Set the neighborhood label.
  $("#neighborhood-label").text(address);
  
  $("form").submit(function(e) {
    var address = $("#address").val();
    
    // Save input to localStorage. We'll access this later in map.js.
    localStorage.setItem("address", address);
  })
})