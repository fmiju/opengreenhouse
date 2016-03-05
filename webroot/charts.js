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