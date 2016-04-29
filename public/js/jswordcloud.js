
var width= window.innerWidth,
      height= window.innerHeight;
var fill = d3.scale.category20();
console.log('kwd width: ' + kwd_width);
var kwd_width = 0.5*width;
var kwd_height= 0.8*height;
var ent_width = 0.5*width;
var ent_height = 0.8*height;

// scale to map relevance of words to font size
var fontSizeRange = d3.scale.linear();

function d3_draw_words(keywords,divref) {

//var kwds = keywords.slice(1,5);
var kwds = keywords;

  var words;
  if(divref === "keywords-cloud") {
     words = kwds.map(function(d) {
    //return {text: d.text, size: 10 + d.relevance * 90};
	return {text: d.text, size: 6 + d.relevance * 70};
    //return {text: d.text, size: 5 + d.relevance * 30};
     }); 
  } else if(divref === "entities-cloud") {
     words = kwds.map(function(d) {
    	return {text: d.text + '_' + d.type, size: 6 + d.relevance*70};
     });
  }
  
// Find range of relevance values
  var max = words[0].size;
  var min = words[words.length-1].size;
  fontSizeRange
	.domain([min,max])
	.range([8,20]);

  //console.log('words in drawcloud: ' + JSON.stringify(words));

  if(divref === "keywords-cloud") {
    d3.layout.cloud().size([kwd_width, kwd_height])
      .words(words)
      .padding(10)
      .rotate(function() { return 0; })
      //.font("Impact")
      .font("Times New Roman")
      .text(function(d) {return d.text;})
      .fontSize(function(d) {return fontSizeRange(d.size); })
      .on("end", drawKwds)
        .start();
   } else if (divref === "entities-cloud") {
    d3.layout.cloud().size([ent_width, ent_height])
      .words(words)
      .padding(10)
      .rotate(function() { return 0; })
      //.font("Impact")
      .font("Times New Roman")
      .text(function(d) {return d.text;})
      .fontSize(function(d) { return fontSizeRange(d.size); })
      .on("end", drawEntities)
	.start();
   } else if (divref === "concepts-cloud") {
    d3.layout.cloud().size([concepts_width, concepts_height])
      .words(words)
      .padding(10)
      .rotate(function() { return 0; })
      //.font("Impact")
      .font("Times New Roman")
      .text(function(d) {return d.text;})
      .fontSize(function(d) { return d.size; })
      .on("end", drawConcepts)
 	.start();
   }
}

function drawKwds(words) {
  d3.select("#keywords-cloud").append("svg")
	.attr("width",kwd_width)
	.attr("height",kwd_height)
    .append("g")
      .attr("transform", "translate(" + kwd_width/2 + "," + kwd_height/2 + ")")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      //.style("font-family", "Impact")
      .style("font-family", "Times New Roman")
      .style("fill", function(d, i) {return fill(i); })
      .attr("text-anchor", "left")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
}


function drawEntities(words) {
  var maxSize = words[0].size;
  var minSize = words[words.length-1].size;

  d3.select("#entities-cloud").append("svg")
      .attr("width", ent_width)
      .attr("height", ent_height)
    .append("g")
      .attr("transform", "translate(" + ent_width/2 + "," + ent_height/2 + ")")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) {
	console.log('font size ' + d.size + ' and text is: ' + d.text); 
	return d.size + "px"; })
      .style("font-family", "Times New Roman")
      .style("fill", function(d, i) {
	 //return fill(i);
	 //return "#aec7e8";
	 return "#00ff00";
	})
      .style("opacity", function(d) {
	var op = d.size/maxSize;
	return op;
       })
      .attr("text-anchor", "left")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
}

