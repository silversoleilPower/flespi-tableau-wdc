(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
	var cols = [{
		id: "time",
		dataType: tableau.dataTypeEnum.string
	    }, {
		id: "latitude",
		dataType: tableau.dataTypeEnum.geometry
	    }, {
	    id: "longitude",
		dataType: tableau.dataTypeEnum.geometry
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
    	$.ajax("https://flespi.io/gw/devices/5811/messages?data=%7B%22count%22%3A1000%2C%22method%22%3A%22average%22%7D", {
    		success: function(resp) {
		    	var feat = resp.result,
		        	tableData = [];

				// Iterate over the JSON object
				for (var i = 0, len = feat.length; i < len; i++) {
				    tableData.push({
				        "time": feat[i].timestamp,
				        "latitude": feat[i]["position.latitude"],
				        "longitude": feat[i]["position.longitude"],
				        "speed": feat[i]["position.speed"]
				    });
				}

				table.appendRows(tableData);
				doneCallback();
			},
			headers: {
				"Accept": "application/json",
				"Authorization":"FlespiToken eABpFu7l33yt4yHrRg9lDj1UTsbTZne1NDgjYesP7Q6ZeBfTIe29nUT4aVNZ6QRJ"
			}
		});
	};

    tableau.registerConnector(myConnector);

$(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "flespidata";
        tableau.submit();
    });
});

})();


