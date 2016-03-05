function createChart(dataFile)
{
	d3.json(dataFile, function(data) {
    data = MG.convert.date(data, 'date');
    MG.data_graphic({
        title: "Line Chart",
        description: "This is a simple line chart. You can remove the area portion by adding area: false to the arguments list.",
        data: data,
        width: 600,
        height: 200,
        right: 40,
        target: document.getElementById('fake_users1'),
        x_accessor: 'date',
        y_accessor: 'value'
    });
});
}


function updateChart(dataName)
{}

createChart("moistureData.json");



