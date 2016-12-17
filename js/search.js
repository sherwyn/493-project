// jQuery onLoad
$(function() {
  $("#go-button").click(function(e) {
    var address = $("#address").val();
    
    // Prevent form submit here. We'll submit the form after our ajax call.
    e.preventDefault()
    
    // If no address, return
    if (!address) {
      return;
    }
    
    var new_address = address.split(' ').join('+');
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + new_address+",+Detroit";
    
    $.ajax({
      url: url,
      success: function(data) {
        // Uncomment these lines to examine data
        // console.log(data);
        // return;
        
        // If valid address found
        if (data.status != "ZERO_RESULTS") {
          // Save data to locaStorage
          localStorage.setItem("address", data.results[0].formatted_address);
          localStorage.setItem("lat", data.results[0].geometry.location.lat);
          localStorage.setItem("lng", data.results[0].geometry.location.lng);
          
          // Submit form
          $("form").submit();
        }
        else {
          alert("Address not found. Try being more specific in your query.");
        }
      }
    })

  })
})
