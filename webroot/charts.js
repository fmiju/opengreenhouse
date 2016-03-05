function fillChartData(chartId, data)
{
	var chartElement = document.getElementById(chartId);
	if(chartElement == undefined)
		return;

	obj = JSON.parse(data);

	var test = obj.value.time;
	test = test.toString()
	chartElement.innerHTML = test;
}

function createChart(chartId)
{
	var chartElement = document.createElement('div');
	chartElement.id = chartId;
	chartElement.innerHTML = '<img class="chart" src="images/chartPlaceholder.jpeg">';
	return chartElement;
}

function createWidget(widgetId, imageSrc)
{
	var widget = document.createElement('div');
	widget.id = widgetId;
	widget.className = "momentValueWidget";
	var img = document.createElement('img');
	img.src = imageSrc;
	widget.appendChild(img);
	var valueDiv = document.createElement('div');
	valueDiv.innerHTML = "??";
	widget.appendChild(valueDiv);
	return widget;
}