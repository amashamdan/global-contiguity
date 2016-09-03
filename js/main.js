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
	var nodeWidth = 13;
	var nodeHeight = 8;

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
					.style("stroke", "white")
					.style("stroke-width", 1);

	var nodes = svg.selectAll("rect")
					.data(dataSet.nodes)
					.enter()
					.append("rect")
					.attr("width", nodeWidth)
					.attr("height", nodeHeight)
					.style("fill", "red")
					.call(force.drag);


	force.on("tick", function() {
		edges.attr("x1", function(d) {return d.source.x + nodeWidth/2;})
			.attr("y1", function(d) {return d.source.y + nodeHeight/2;})
			.attr("x2", function(d) {return d.target.x + nodeWidth/2;})
			.attr("y2", function(d) {return d.target.y + nodeHeight/2;});
		nodes.attr("x", function(d) {return d.x;})
			.attr("y", function(d) {return d.y;});
	})
}