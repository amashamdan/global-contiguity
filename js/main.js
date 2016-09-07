/* AJAX request to grab information about the countries. File is saved locally. */
$.ajax({
	url: "js/countries.json",
	dataType: "json",
	success: function(data) {
		/* Upon retreiving data, the plot function is called to draw the chart. */
		plot(data);
	},
	error: function() {
		/* Error message if data could not be retreived. */
		alert("Error retreiving data, please try again later.");
	}
});

/* The timer is used to control the visibility of the information window. */
var timer;

/* The plot function which draws the chart. */
function plot(dataSet) {
	/* The dimesnions of the main svg. */
	var chartWidth = 900;
	var chartHeight = 900;
	/* The base dimensions of the flags at the nodes. */
	var nodeWidth = 27;
	var nodeHeight = 17;
	/* This for loop counts the number of neighbours of a country and saves it as property of each country. */
	for (country in dataSet.nodes) {
		/* Counter is reset for each country. */
		var counter = 0;
		/* Another for loop to find the occurances of the country (represented by its index in nodes) in links. */
		for (var link in dataSet.links) {
			/* If a country is detected as a source or target the counter is increased. */
			if (dataSet.links[link].source == country || dataSet.links[link].target == country) {
				counter++;
			}
		}
		/* neighbours property is given to each node. */
		dataSet.nodes[country].neighbours = counter;
	}
	/* A linear which will be used to change the flag size depending on its number of neighbours. In domain: range starts from 1 to the maximum number of neighbours a country has. In range: the number returned is a flag size multiplier, so the flag size can remain unchanged (1 border)... The country with maximum number of border will have its flag size doubled. */
	var nodeScale = d3.scale.linear()
						.domain([1, d3.max(dataSet.nodes, function(d) {
							return d.neighbours;
						})])
						.range([1, 2]);
	/* Main svg is defined and given properties. */
	var svg = d3.select("#chart-area")
				.append("svg")
				.attr("width", chartWidth)
				.attr("height", chartHeight)
				.style("background-color", "rgba(0, 0, 0, 0.5)");
	/* force layout is initialized. */
	var force = d3.layout.force()
					/* Nodes and links defined */
					.nodes(dataSet.nodes)
					.links(dataSet.links)
					.size([chartWidth, chartHeight])
					/* The minimum distance between nodes. */
					.linkDistance([75])
					/* The negative charge specifies how far the nodes would repel. */
					.charge([-100])
					.start();
	/* Create svg line for each link */
	var edges = svg.selectAll("line")
					.data(dataSet.links)
					.enter()
					.append("line")
					.style("stroke", "white")
					.style("stroke-width", 1);
	/* Create an image for each node. */
	/* USING SVG IMAGES AS BACKGROUND FOR NODES IS MAKING THE CODE RUN REALLY SLOW. */
	var nodes = svg.selectAll("image")
					.data(dataSet.nodes)
					.enter()
					.append("image")
					/* Specify image link using the country's code. */
					.attr("xlink:href", function(d) {
						return "flags/"+d.code+".png"
					})
					.attr("width", function(d) {
						/* The node width is multplied by the multiplier returned from nodeScale. */
						return nodeWidth * nodeScale(d.neighbours)
					})
					.attr("height", function(d) {
						/* The node height is multplied by the multiplier returned from nodeScale. */
						return nodeHeight * nodeScale(d.neighbours)
					})
					/* Four attributes are given to each node, They will be needed for tooltips and information window. The class attribute used for hover function. */
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
					/* This line enables dragging the node. */
					.call(force.drag)
	/* With each tick (passage of time), the positions of nodes and links change. This tells the code how to update the positions of drawn lines and images/ */
	force.on("tick", function() {
		/* Each link has start and end points, x and y coordinates for each point must be given. */
		edges.attr("x1", function(d) {return d.source.x + nodeWidth/2;})
			.attr("y1", function(d) {return d.source.y + nodeHeight/2;})
			.attr("x2", function(d) {return d.target.x + nodeWidth/2;})
			.attr("y2", function(d) {return d.target.y + nodeHeight/2;});
		/* A node has one point only. '- d.neighbours' and '- d.neighbours/2' are offsets applied to x and y position of the node to have the links end and start and the center of the node (approximately). */
		nodes.attr("x", function(d) {return d.x - d.neighbours;})
			.attr("y", function(d) {return d.y - d.neighbours/2;});
	})
	/* Hover function for a node (flag) */
	$(".countryNode").hover(function(e) {
			/* In the hover out function, a timer is started to fade out the information window. If another flag is hovered before the timer ends, the timer will be reset. */
			clearInterval(timer);
			/* Mouse position is detected and stored. */
			var xPosition = e.pageX 
			var yPosition = e.pageY
			/* Tooltip position is specified as an offset of the pointer position. */
			$(".tooltip").css({"left": xPosition + 20, "top": yPosition})
			/* The contents of the tooltip is changed to the country's name. */
			$(".tooltip").html($(this).attr("country"));
			/* Information window position is specified, it is has a display fixed property so it will always be shown in the same position. */
			$(".information").css({"left":$("svg").offset().left, "top": $("svg").offset().top})
			/* The contents of the information window is changed. It shows the hovered country's name, flag and number of neighbours. */
			$(".information").html("<p/>"+$(this).attr("country") + 
									"<p><img src='flags/"+
									$(this).attr("code")+".png'></p>" +
									"<p/>Borders with "+ $(this).attr("neighbours") +" countries</p>");
			/* The information window and tooltip are shown. */
			$(".information").show();
			$(".tooltip").show();
		}
		/* hover out function. */
		, function() {
			/* timer to fadeOut the information window is started and set to 2 seconds. */
			timer = setTimeout(function() {
				$(".information").fadeOut(200);
			}, 2000)
			/* The tooltip is hidden immediately. */
			$(".tooltip").hide();
		})
}
