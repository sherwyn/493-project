// jQuery onLoad
$(function() {
  $("#go-button").click(function(e) {
    var address = $("#address").val();
    
    // Prevent form submit here. We'll submit the form after our ajax call.
    e.preventDefault()
    
    // Just reload the page if user entered no address
    if (!address) {
      return location.reload();
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
        var flag = true;
        num = 0;
        while (flag && num < data.results.length){
          var i;
          for (i = 0; i<data.results[num].address_components.length; i++){
            if ((data.results[num].address_components[i].long_name == "Detroit") && 
              (data.results[num].address_components[i].types[0] == "locality")){
              flag = false; 
            }
          }
          num++;
        }
        num--;
        if (!flag) {
          // Save data to locaStorage
          localStorage.setItem("address", data.results[num].formatted_address);
          localStorage.setItem("lat", data.results[num].geometry.location.lat);
          localStorage.setItem("lng", data.results[num].geometry.location.lng);
          
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
