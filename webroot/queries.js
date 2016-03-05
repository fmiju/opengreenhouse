function queryData(name, start, end, resolution, callback)
{
	var command = "rpc/sensor/?name="+name+"&start="+start+"&end="+end+"&resolution="+resolution;
	SendToServer(g_ServerURL, command, "", callback)
}

function runQuery()
{
	var name;
	var timeStart = 0;
	var timeEnd = 0;
	var timeResolution = 0;
	var inputField = document.getElementById("sensorName");
	if(inputField != undefined)
		name = inputField.value;
	inputField = document.getElementById("timeStart");
	if(inputField != undefined)
		timeStart = inputField.value;
	inputField = document.getElementById("timeEnd");
	if(inputField != undefined)
		timeEnd = inputField.value;
	inputField = document.getElementById("timeResolution");
	if(inputField != undefined)
		timeResolution = inputField.value;
	if(name=="temp")
		queryData(name, timeStart, timeEnd, timeResolution, 
		function(data){ fillChartData("temperatureChart", data) });
	if(name=="airHumidity")
		queryData(name, timeStart, timeEnd, timeResolution, 
		function(data){ fillChartData("airHumidityChart", data) });
	if(name=="soilHumidity")
		queryData(name, timeStart, timeEnd, timeResolution, 
		function(data){ fillChartData("soilHumidityChart", data) });
	if(name=="wind")
		queryData(name, timeStart, timeEnd, timeResolution, 
		function(data){ fillChartData("windChart", data) });
}
