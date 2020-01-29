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
	    id: "location",
		dataType: tableau.dataTypeEnum.string
	    }, {
	    id: "duration",
		dataType: tableau.dataTypeEnum.int
	    }];

	var tableSchema = {
		id: "flespianalytics",
		alias: "flespi analytics data",
		columns: cols
	    };

	    schemaCallback([tableSchema]);

    };

// https://flespi.io/gw/calcs/162/devices/183982/intervals/all?data=%7B%22count%22%3A100%7D

    myConnector.getData = function(table, doneCallback) {
	        var tmpdata = JSON.parse(tableau.connectionData);
   		$.ajax("https://flespi.io/gw/calcs/" + tmpdata.calcid + "/devices/" + tmpdata.deviceid + "/intervals/all?data=%7B%22count%22%3A" + tmpdata.messagescount + "%7D", {
    		success: function(resp) {
		    	var feat = resp.result,
		        	tableData = [];

				// Iterate over the JSON object
				for (var i = 0, len = feat.length; i < len; i++) {
				    tableData.push({
				        "time": feat[i]["time"],
				        "latitude": feat[i]["position.latitude"],
				        "longitude": feat[i]["position.longitude"],
				        "location": feat[i]["location"],
				        "duration": feat[i]["duration"],
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
    	tableau.connectionName = "flespianalytics";
        // flespi token
        tableau.password = $("#input_token").val(); 
        tableau.connectionData = JSON.stringify({messagescount: $("#input_messages").val(), deviceid: parseInt($("#input_device").val()), calcid: parseInt($("#input_calc").val())})
        tableau.submit();
    });
});

})();