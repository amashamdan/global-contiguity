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
var timer;
function plot(dataSet) {
	var chartWidth = 900;
	var chartHeight = 800;
	var nodeWidth = 30;
	var nodeHeight = 20;

	for (country in dataSet.nodes) {
		var counter = 0;
		for (var link in dataSet.links) {
			if (dataSet.links[link].source == country || dataSet.links[link].target == country) {
				counter++;
			}
		}
		dataSet.nodes[country].neighbours = counter;
	}

	var svg = d3.select("#chart-area")
				.append("svg")
				.attr("width", chartWidth)
				.attr("height", chartHeight)
				.style("background-color", "rgba(0, 0, 0, 0.5)");

	var force = d3.layout.force()
					.nodes(dataSet.nodes)
					.links(dataSet.links)
					.size([chartWidth, chartHeight])
					.linkDistance([50])
					.charge([-100])
					.start();

	var edges = svg.selectAll("line")
					.data(dataSet.links)
					.enter()
					.append("line")
					.style("stroke", "white")
					.style("stroke-width", 1);

	/* USING SVG IMAGES AS BACKGROUND FOR NODES IS MAKING THE CODE RUN REALLY SLOW. */
	var nodes = svg.selectAll("image")
					.data(dataSet.nodes)
					.enter()
					.append("image")
					.attr("xlink:href", function(d) {
						return "flags/"+d.code+".png"
					})
					.attr("width", nodeWidth)
					.attr("height", nodeHeight)
					.attr("country", function(d) {
						return d.country;
					})
					.attr("neighbours", function(d) {
						return d.neighbours;
					})
					.attr("code", function(d) {
						return d.code;
					})
					.attr("class", "countryNode")
					.call(force.drag)

	force.on("tick", function() {
		edges.attr("x1", function(d) {return d.source.x + nodeWidth/2;})
			.attr("y1", function(d) {return d.source.y + nodeHeight/2;})
			.attr("x2", function(d) {return d.target.x + nodeWidth/2;})
			.attr("y2", function(d) {return d.target.y + nodeHeight/2;});
		nodes.attr("x", function(d) {return d.x;})
			.attr("y", function(d) {return d.y;});
	})



	$(".countryNode").hover(function(e) {
			/* Mouse position is detected and stored. */
			clearInterval(timer);
			var xPosition = e.pageX 
			var yPosition = e.pageY
			$(".tooltip").css({"left": xPosition + 20, "top": yPosition})
			$(".tooltip").html($(this).attr("country"));
			$(".information").css({"left":$("svg").offset().left, "top": $("svg").offset().top})
			$(".information").html("<p/>"+$(this).attr("country") + 
									"<p><img src='flags/"+
									$(this).attr("code")+".png'></p>" +
									"<p/>Borders with "+ $(this).attr("neighbours") +" countries</p>");
			$(".information").show();
			$(".tooltip").show();
		}
		, function() {
			timer = setTimeout(function() {
				$(".information").fadeOut(200);
			}, 2000)
			
			$(".tooltip").hide();
		})
}
