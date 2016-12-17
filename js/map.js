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
  $("#date-range").text("Nov. 2: Dec. 2, 2016");
  
  // Violent Crime widget onHover
  $("#crime-report-violent").hover(function() {
    console.log("crime-report-violent");
  })
  
  // Property Crime widget onHover
  $("#crime-report-property").hover(function() {
    console.log("crime-report-property");
  })
  
  // Quality Crime widget onHover
  $("#crime-report-quality").hover(function() {
    console.log("crime-report-quality");
  })
  
  $("form").submit(function(e) {
    var address = $("#address").val();
    
    // If no address, prevent form submit
    if (!address) {
      e.preventDefault()
    }
    
    // Save input to localStorage. We'll access this later in map.js.
    localStorage.setItem("address", address);
  })

  // setup for leaflet map
  // setView for the centered point
  var mymap = L.map('mapid').setView([42.344365, -83.076050999999], 14);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaWFuenljIiwiYSI6ImNpd2I3bThjYTA0bmgyb3F1eHpiYXI2bTgifQ.uvJQRBGq8wA3BlyFcIXV8g', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> ' + 
      'Imagery &copy <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(mymap);

  // add marker, test
  L.marker([42.344365, -83.076050999999]).addTo(mymap)
    .bindPopup('<b style="font-size: 20px"> Commonwealth St, Detroit, MI 48208</b>').openPopup();

  var point = [-83.076050999999, 42.344365]; // coordinate
  var data; // geojson for all communities
  var dataLayer; // community layer for later search
  var polygons = {}; // map for (community, polygon) pair
  var communityIdMap = {}; // map for (community, community id) pair
  var communityArray = []; // array for all community names
  var circles = {} // map for (crime category, list of circles) pair
  var communityId; // current search community id
  var community; // current search community name
  communityIdMap['NULL'] = 0; // default community
  circles['Property Crime'] = [];
  circles['Violent Crime'] = [];
  circles['Quality-of-Life Crime'] = [];

  var colorMap = {
    "Violent Crime": "#B413A5",
    "Property Crime": "#E59127",
    "Quality-of-Life Crime": "#009E87"
  }

  // custom styles for rendering polygons and circles
  var styleEmpty = {
    "opacity": 0,
    "color": "#FFFFFF"
  }   
  var styleSearch = {
    "color": "#5a97ed",
    "weight": 3,
    "opacity": 0.9
  };
  var styleNormal = {
    "color": "#c0c6d1",
    "weight": 3,
    "opacity": 0.9
  }
  var styleMove = {
    "color": "#f7b24a",
    "weight": 3,
    "opacity": 0.9
  }
  var crimeNormal = {
    // "color": '#009E87',
    "weight": 2,
    "fill": true,
    "fillcolor": '#e52041',
    "fillOpacity": 1
  }


  var radius = 15;

  // global popup for polygon
  var polyPopup = L.popup({
   autoPan: false,
   keepInView: true
  });

  // 
  d3.json('/data/neighborhoods.geojson', function(error, collection) {
    if (error) throw error;

    // retrieve data
    data = collection['features'];
    dataLayer = L.geoJson(data);

    // create polygon for each community
    // add to communityArray
    for (var i = 0; i < data.length; i++) {
      var c = data[i]['properties']['name'];
      polygons[c] = L.geoJSON(data[i], { style: styleNormal});
      polygons[c].addTo(mymap);
      communityArray.push(c);
    }

    // sort communities and assign id
    communityArray.sort();
    for (var i = 0; i < communityArray.length; i++) {
      communityIdMap[communityArray[i]] = (i+1);
    }

    // search for current point
    var result = leafletPip.pointInLayer(point, dataLayer, true);
    console.log(result);
    var cName = result[0]['feature']['properties']['name'];
    console.log(cName);
    community = cName;
    communityId = communityIdMap[community];

    // open crime data for current community
    var crimeFile = '/data/crime_Oct30_Nov30/' + communityId + '.crime';
    
    d3.json(crimeFile, function(error, collection) {
      // Update summary widgets
      handleCommunityData(collection);

      // create circles for all crimes
      for (var j = 0; j < collection.length; j++) {
        var circle = L.circle([collection[j]['lat'], collection[j]['lot']], radius);
        var crimeCate = collection[j]['category'];
        circles[crimeCate].push(circle);
        crimeNormal['color'] = colorMap[crimeCate];
        circle.setStyle(crimeNormal);
        circle.addTo(mymap);
        circle.bringToFront();
        
        // add and bind popup for each crime
        var popup = L.popup().setContent(collection[j]['category'] + ': ' + collection[j]['date']);
        circle.bindPopup(popup);
        circle.on('mouseover', function(e) {
          this.openPopup();
        });
        circle.on('mouseout', function(e) {
          this.closePopup();
        });
      }
    });

    // find corresponding polygon the point is in
    var targetP = polygons[cName];
    targetP.setStyle(styleSearch);
    targetP.bringToFront();

    // add animation for all polygons except for current community
    for (var i = 0; i < communityArray.length; i++) {
      var c = communityArray[i];
      if (c !== community) {
        var p = polygons[c];
        p.on('mouseover', function(e) {
          this.setStyle(styleMove);
        });
        p.on('mouseout', function(e) {
          this.setStyle(styleNormal);
        });
      }
    }



    // event handler for moving on the map
    // it will update global polyPopup and display
    // at correct position
    function onMapMove(e) {
      console.log(circles['Violent Crime'].length);
      console.log(circles['Property Crime'].length);
      console.log(circles['Quality-of-Life Crime'].length);
      // for (var i = 0; i < circles['Violent Crime'].length; i++) {
      //   console.log("aha");
      //   console.log(circles['Violent Crime'][i]);
      // }

      // search polygon for current mouse position
      var movePoint = [e.latlng['lng'], e.latlng['lat']];
      var moveResult = leafletPip.pointInLayer(movePoint, dataLayer, true);

      // update polyPopup
      if (moveResult.length > 0 && moveResult[0]['feature']['properties']['name'] !== community) {
        var c = moveResult[0]['feature']['properties']['name'];
        polyPopup
          .setLatLng(e.latlng)
          .setContent(c);
        mymap.openPopup(polyPopup);
      }
      else {
        mymap.closePopup(polyPopup);
      }
    }

    mymap.on('mousemove', onMapMove);
  });
})

function handleCommunityData(data) {
  // Update map
  
  // Update summary widgets
  updateSummaryWidgets(data)
  
  // Update trends widgets
}

function updateSummaryWidgets(data) {
  // Summary
  $('#crime-summary-qty').text(data.length);

  // Violent
  var violentCount = data.filter(function(v) {
    return v["category"] == "Violent Crime"
  }).length;
  $('#crime-violent-qty').text(violentCount);
  
  var robberyCount = data.filter(function(v) {
    return v["sub category"] == "ROBBERY"
  }).length;
  $('#violent-robbery').text('Robbery: ' + robberyCount);
  
  var batteryCount = data.filter(function(v) {
    return v["sub category"] == "AGGRAVATED ASSAULT"
  }).length;
  $('#violent-battery').text('Battery: ' + batteryCount);
  
  var assaultCount = data.filter(function(v) {
    return v["sub category"] == "ASSAULT"
  }).length;
  $('#violent-assault').text('Assault: ' + assaultCount);
  
  var batteryCount = data.filter(function(v) {
    return v["sub category"] == "AGGRAVATED ASSAULT"
  }).length;
  
  // Property
  var propertySummary = data.filter(function(v) {
    return v["category"] == "Property Crime"
  }).length;
  
  var batteryCount = data.filter(function(v) {
    return v["sub category"] == "AGGRAVATED ASSAULT"
  }).length;
  $('#crime-property-qty').text(propertySummary);

  var theftCount = data.filter(function(v) {
    return v["sub category"] == "LARCENY"
  }).length;  
  $('#property-theft').text('Theft: ' + theftCount);
  
  var burglaryCount = data.filter(function(v) {
    return v["sub category"] == "BURGLARY"
  }).length;  
  $('#property-burglary').text('Burglary: ' + burglaryCount);
  
  var motorCount = data.filter(function(v) {
    return v["sub category"] == "STOLEN VEHICLE"
  }).length;  
  $('#property-motor').text('Motor vehicle theft: ' + motorCount);
  
  // Quality
  var qualityCount = data.filter(function(v) {
    return v["category"] == "Quality-of-Life Crime"
  }).length;
  $('#crime-quality-qty').text(qualityCount);

  var narcoticsCount = data.filter(function(v) {
    return v["sub category"] == "DANGEROUS DRUGS"
  }).length;
  $('#quality-narcotics').text('Narcotics: ' + narcoticsCount);
}