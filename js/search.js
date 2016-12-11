// jQuery onLoad
$(function() {
  $("form").submit(function(e) {
    var address = $("#address").val();
    
    // Save input to localStorage. We'll access this later in map.js.
    localStorage.setItem("address", address);
  })
})