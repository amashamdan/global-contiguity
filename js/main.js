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

function plot(dataSet) {
	var chartWidth = 900;
	var chartHeight = 700;
	var svg = d3.select("#chart-area")
				.append("svg")
				.attr("width", chartWidth)
				.attr("height", chartHeight)
				.style("background-color", "rgba(0, 0, 0, 0.2)");

	var force = d3.layout.force()
					.nodes(dataSet.nodes)
					.links(dataSet.links)
					.size([chartWidth, chartHeight])
					.linkDistance([25])
					.charge([-75])
					.start();

	var edges = svg.selectAll("line")
					.data(dataSet.links)
					.enter()
					.append("line")
					.style("stroke", "green")
					.style("stroke-width", 1);

	var nodes = svg.selectAll("circle")
					.data(dataSet.nodes)
					.enter()
					.append("circle")
					.attr("r", 5)
					.style("fill", "red")
					.call(force.drag);

	force.on("tick", function() {
		edges.attr("x1", function(d) {return d.source.x;})
			.attr("y1", function(d) {return d.source.y;})
			.attr("x2", function(d) {return d.target.x;})
			.attr("y2", function(d) {return d.target.y;});
		nodes.attr("cx", function(d) {return d.x;})
			.attr("cy", function(d) {return d.y;});
	})
}