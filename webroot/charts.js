function fillChartData(chartId, data)
{
	var chartElement = document.getElementById(chartId);
	if(chartElement == undefined)
		return;

	obj = JSON.parse(data);

	var time = obj.value.time;
	var value = obj.value.value;

	var data = [];	
	var txtData = '[';
	for(i = 0; i < time.length; i++){
		text = '{"time": "' + time[i] + '",\n"value": ' + value[i] + '}';
		txtData += text;
		if(i < time.length-1) 
			txtData += ',';
	}

	txtData += ']';
//	chartElement.innerHTML = txtData;
	data = JSON.parse(txtData);
	
	MG.data_graphic({
        title: chartId,
        description: chartId,
        data: data,
        width: 400,
        height: 200,
        right: 40,
        target: chartElement,
	    x_accessor: 'time',
        y_accessor: 'value'
    });

//	var test = obj.value.value;

	}

fillChartData("temperatureChart", "exampleData.json");
