// jQuery onLoad
$(function() {
	// Load community data
	$.ajax({
		url: '/js/test-community.json',
		dataType: 'json',
		success: handleCommunityData
	})
	
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

	var mymap = L.map('mapid').setView([42.344365, -83.076050999999], 12);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaWFuenljIiwiYSI6ImNpd2I3bThjYTA0bmgyb3F1eHpiYXI2bTgifQ.uvJQRBGq8wA3BlyFcIXV8g', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> ' + 
			'Imagery &copy <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);

	L.marker([42.344365, -83.076050999999]).addTo(mymap)
		.bindPopup('<b style="font-size: 20px"> Commonwealth St, Detroit, MI 48208</b>').openPopup();

	var point = [-83.076050999999, 42.344365]; // 3935 commonwealth st
	var data;
	var dataLayer;
	var polygons = {};
	var communityIdMap = {};
	var communityArray = [];
	var communityId;
	var community;

	communityIdMap['NULL'] = 0;

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

	d3.json('data/neighborhoods.geojson', function(error, collection) {
		if (error) throw error;

		data = collection['features'];
		for (var i = 0; i < data.length; i++) {
			var c = data[i]['properties']['name'];
			polygons[c] = L.geoJSON(data[i], { style: styleNormal});
			polygons[c].addTo(mymap);
      communityArray.push(c);
    }
    
    communityArray.sort();
    for (var i = 0; i < communityArray.length; i++) {
    	communityIdMap[communityArray[i]] = (i+1);
    }

    // search
		dataLayer = L.geoJson(data);
		var result = leafletPip.pointInLayer(point, dataLayer, true);
		console.log(result);
		var cName = result[0]['feature']['properties']['name'];
		console.log(cName);
		community = cName;
		var targetP = polygons[cName];
		targetP.setStyle(styleSearch);
		targetP.bringToFront();
		// L.geoJSON(data, {
		// 	style: function(feature) {
		// 		switch (feature.properties.name) {
		// 			case cName: return styleEmpty;
		// 			default: return styleNormal;
		// 		}
		// 	}
		// }).addTo(mymap);

		// var testL = L.geoJSON(result[0]['feature'], {
		// 	style: styleSearch
		// });

		// testL.addTo(mymap);

		// // testL.setStyle(styleEmpty);
		// testL.setStyle(styleMove);

	});

	var popup = L.popup({
		autoPan: false,
		keepInView: true,
		// autoPanPaddingTopLeft: -5
	});

  function onMapMove(e) {
  	var movePoint = [e.latlng['lng'], e.latlng['lat']];
    var moveResult = leafletPip.pointInLayer(movePoint, dataLayer, true);

    if (moveResult.length > 0) {
			var c = moveResult[0]['feature']['properties']['name'];
			// console.log(moveResult[0]['feature']['properties']['name']);

			for (var i = 0; i < communityArray.length; i++) {
				polygons[communityArray[i]].setStyle(styleNormal);
			}

			polygons[c].setStyle(styleMove);
			polygons[c].bringToFront();

			polygons[community].setStyle(styleSearch);
			polygons[community].bringToFront();

	    popup
	      .setLatLng(e.latlng)
	      .setContent(c);
	      // .openOn(mymap);

	    mymap.openPopup(popup);
	  }
	  else {
	  	mymap.closePopup(popup);

	  	for (var i = 0; i < communityArray.length; i++) {
				polygons[communityArray[i]].setStyle(styleNormal);
			}
			polygons[community].setStyle(styleSearch);
			polygons[community].bringToFront();
	  }
  }

	mymap.on('mousemove', onMapMove);

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
	$('#violent-robbery').text('Robbery - ' + robberyCount);
	
	var batteryCount = data.filter(function(v) {
		return v["sub category"] == "AGGRAVATED ASSAULT"
	}).length;
	$('#violent-battery').text('Battery - ' + batteryCount);
	
	var assaultCount = data.filter(function(v) {
		return v["sub category"] == "ASSAULT"
	}).length;
	$('#violent-assault').text('Assault - ' + assaultCount);
	
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
	$('#property-theft').text('Theft - ' + theftCount);
	
	var burglaryCount = data.filter(function(v) {
		return v["sub category"] == "BURGLARY"
	}).length;  
	$('#property-burglary').text('Burglary - ' + burglaryCount);
	
	var motorCount = data.filter(function(v) {
		return v["sub category"] == "STOLEN VEHICLE"
	}).length;  
	$('#property-motor').text('Motor vehicle theft - ' + motorCount);
	
	// Quality
	var qualityCount = data.filter(function(v) {
		return v["category"] == "Quality-of-Life Crime"
	}).length;
	$('#crime-quality-qty').text(qualityCount);

	var narcoticsCount = data.filter(function(v) {
		return v["sub category"] == "DANGEROUS DRUGS"
	}).length;
	$('#quality-narcotics').text('Narcotics - ' + narcoticsCount);
}