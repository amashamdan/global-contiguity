$.ajax({
	url: "js/countries.json",
	dataType: "json",
	success: function(data) {
		plot(data);
	},
	error: function() {
		alert("Error retreiving data, please try again later.");
	}
});

function plot(data) {
	var chartWidth = 900;
	chartHeight = 700;
	var chart = d3.select("#chart-area")
				.append("svg")
				.attr("width", chartWidth)
				.attr("height", chartHeight)
				.style("background-color", "rgb(255, 240, 240)");
}