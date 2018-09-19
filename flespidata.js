(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
	var cols = [{
		id: "time",
		dataType: tableau.dataTypeEnum.int
	    }, {
		id: "ident",
		dataType: tableau.dataTypeEnum.string
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

	    //incremental refresh
	/*var tableInfo = {
        alias: "Incremental Refresh Connector",
        id: "flespidata",
        columns: cols,
        incrementColumnId: "id"
    };*/

	    schemaCallback([tableSchema]);
	    //schemaCallback([tableInfo]);

    };

    myConnector.getData = function(table, doneCallback) {
    	$.ajax("https://flespi.io/gw/devices/" + localStorage.getItem("device") + "/messages?data=%7B%22count%22%3A1000%2C%22method%22%3A%22average%22%7D", {
    		success: function(resp) {
		    	var feat = resp.result,
		        	tableData = [];

				// Iterate over the JSON object
				for (var i = 0, len = feat.length; i < len; i++) {
				    tableData.push({
				        "time": feat[i].timestamp,
				        "ident": feat[i].ident,
				        "latitude": feat[i]["position.latitude"],
				        "longitude": feat[i]["position.longitude"],
				        "altitude": feat[i]["position.altitude"],
				        "ignition": feat[i]["engine.ignition.status"],
				        "speed": feat[i]["position.speed"]
				    });
				}

				table.appendRows(tableData);
				doneCallback();
			},
			headers: {
				"Accept": "application/json",
				"Authorization":"FlespiToken " + localStorage.getItem("token")
			}
		});
	};

    tableau.registerConnector(myConnector);

$(document).ready(function () {
    $("#submitButton").click(function () {
    	localStorage.setItem("token", $('#input_token').val())
    	localStorage.setItem("device", $('#input_device').val())
        tableau.connectionName = "flespidata";
        tableau.submit();
    });
});

})();
