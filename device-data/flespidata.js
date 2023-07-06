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
	    }, {
		id: "cell_1",
		dataType: tableau.dataTypeEnum.float
		},
		{
		id: "cell_2",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "cell_3",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "cell_4",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "cell_5",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "cell_6",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "cell_7",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "cell_8",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "cell_1",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "cell_9",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "cell_10",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "cell_11",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "cell_12",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "cell_13",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "cell_14",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "cell_15",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "Remaining_Capacity",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "RSoC",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "Temp_1",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "Temp_2",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "Voltage",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "Current",
		dataType: tableau.dataTypeEnum.float
		},
	    	{
		id: "Cycles",
		dataType: tableau.dataTypeEnum.int
		},
	    	{
		id: "Device_Name",
		dataType: tableau.dataTypeEnum.string
		}];

	var tableSchema = {
		id: "flespidata",
		alias: "flespi devices location data",
		columns: cols
	    };

	    schemaCallback([tableSchema]);

    };

    myConnector.getData = function(table, doneCallback) {
			var tmpdata = JSON.parse(tableau.connectionData);
			var host = 'flespi.io'
			if (tmpdata.region === 'ru') {
				host = 'ru.flespi.io'
			}
   		$.ajax("https://" + host + "/gw/devices/" + tmpdata.deviceid + "/messages?data=%7B%22count%22%3A" + tmpdata.messagescount + "%2C%22method%22%3A%22average%22%2C%22reverse%22%3Atrue%7D", {
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
					"cell_1": feat[i]["bms.cell.1"],
					"cell_2": feat[i]["bms.cell.2"],
					"cell_3": feat[i]["bms.cell.3"],
					"cell_4": feat[i]["bms.cell.4"],
					"cell_5": feat[i]["bms.cell.5"],
					"cell_6": feat[i]["bms.cell.6"],
					"cell_7": feat[i]["bms.cell.7"],
					"cell_8": feat[i]["bms.cell.8"],
					"cell_9": feat[i]["bms.cell.9"],
					"cell_10": feat[i]["bms.cell.10"],
					"cell_11": feat[i]["bms.cell.11"],
					"cell_12": feat[i]["bms.cell.12"],
					"cell_13": feat[i]["bms.cell.13"],
					"cell_14": feat[i]["bms.cell.14"],
					"cell_15": feat[i]["bms.cell.15"],
					"Remaining_Capacity": feat[i]["bms.remaining.capacity"],
					"RSoC": feat[i]["bms.RSoC"],
					"Temp_1": feat[i]["bms.Temp.1"],
					"Temp_2": feat[i]["bms.Temp.2"],
					"Voltage": feat[i]["bms.voltage"],
					"Current": feat[i]["bms.current"],
					"Cycles": feat[i]["bms.cycles"],
					"Device_Name": feat[i]["device.name"],
					    
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
        tableau.connectionData = JSON.stringify({messagescount: $("#input_messages").val(), deviceid: parseInt($("#input_device").val()), region: $("#input_region").val()})
        tableau.submit();
    });
});

})();
