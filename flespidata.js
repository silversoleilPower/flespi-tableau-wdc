(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
	var cols = [{
		id: "time",
		dataType: tableau.dataTypeEnum.int
	    }, {
		id: "latitude",
		dataType: tableau.dataTypeEnum.float
	    }, {
	    id: "longitude",
		dataType: tableau.dataTypeEnum.float
	    }, {
	    id: "altitude",
		dataType: tableau.dataTypeEnum.float
	    }, {
	    id: "ignition",
		dataType: tableau.dataTypeEnum.bool
	    }, {
	    id: "speed",
		dataType: tableau.dataTypeEnum.float
	    }];

	var tableSchema = {
		id: "flespidata",
		alias: "flespi devices location data",
		columns: cols
	    };

	    schemaCallback([tableSchema]);

    };

    myConnector.getData = function(table, doneCallback) {
   		$.ajax("https://flespi.io/gw/devices/" + tableau.connectionData + "/messages?data=%7B%22count%22%3A" + tableau.platformEdition + "%2C%22method%22%3A%22average%22%2C%22reverse%22%3Atrue%7D", {
    		success: function(resp) {
		    	var feat = resp.result,
		        	tableData = [];

				// Iterate over the JSON object
				for (var i = 0, len = feat.length; i < len; i++) {
				    tableData.push({
				        "time": feat[i].timestamp,
				        "latitude": feat[i]["position.latitude"],
				        "longitude": feat[i]["position.longitude"],
				        "altitude": feat[i]["position.altitude"],
				        "ignition": feat[i]["engine.ignition.status"],
				        "speed": feat[i]["position.speed"],
				     });
				}
				// append rows (messages) to the table
				table.appendRows(tableData);
				doneCallback();
			},
			headers: {
				"Accept": "application/json",
				"Authorization":"FlespiToken " + tableau.password
			}
		});
	};

    tableau.registerConnector(myConnector);

$(document).ready(function () {
    $("#submitButton").click(function () {
    	tableau.connectionName = "flespidata";
        // flespi token
        tableau.password = $("#input_token").val();
        // flespi device ID
        tableau.connectionData = $("#input_device").val();
        //number of messages to fetch
        tableau.platformEdition = $("#input_messages").val(); 
        tableau.submit();
    });
});

})();
