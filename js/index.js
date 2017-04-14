'use strict';

var height = 480,
    width = 800;
//
var chart = d3.select('.viz').append('svg').attr('id', 'chart').attr('width', width).attr('height', height);

chart.append('text').attr('transform', 'rotate(-90)').attr('x', -280).attr('y', 100).text('GDP (Billions)');

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', function (error, response) {

  var dataset = response.data;
  //console.log(response);

  var years = dataset.map(function (d) {
    return d[0].substr(0, 4);
  });
  var gdpValues = dataset.map(function (d) {
    return d[1];
  });

  var barWidth = (width - 100) / years.length;

  var yScale = d3.scaleLinear().domain([0, d3.max(gdpValues)]).range([0, height - 100]);

  // Axis setup
  var yAxisScale = d3.scaleLinear().domain([0, d3.max(gdpValues)]).range([height - 50, 50]);
  var yAxis = d3.axisLeft(yAxisScale);

  var xAxisScale = d3.scaleLinear().domain([d3.min(years), d3.max(years)]).range([50, width - 50]);

  var xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format("d"));

  chart.append("g").call(yAxis).attr('id', 'y-axis').attr('transform', 'translate(70, 0)');

  chart.append("g").call(xAxis).attr('id', 'x-axis').attr('transform', 'translate(20,' + (height - 50) + ")");

  var tooltip = d3.select('body').append('div').attr('id', 'tooltip').attr('data-date', '').style('position', 'absolute').style('padding', '0 10px').style('background', 'white').style('opacity', 0);

  var colors = d3.scaleLinear().domain([0, gdpValues.length * .33, gdpValues.length * .66, gdpValues.length]).range(['#B58929', '#C61C6F', '#268BD2', '#85992C']);

  var tempColor = undefined;

  var handle = chart.selectAll('rect').data(gdpValues).enter().append('rect').attr('class', 'bar').attr('data-date', function (d, i) {
    return dataset[i][0];
  }).attr('data-gdp', function (d, i) {
    return dataset[i][1];
  }).style('fill', function (d, i) {
    return colors(i);
  }).attr('width', barWidth).attr('x', function (d, i) {
    return i * barWidth + 70;
  }).attr('height', 0).attr('y', height - 50).on('mouseover', function (d, i) {
    var date = dataset[i][0];
    tooltip.transition().style('opacity', .9);
    tooltip.attr('data-date', date); //

    tooltip.html(getMonth(parseInt(date.substr(5, 2))) + '\' ' + date.substr(0, 4) + '<br>' + d.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion').style('left', (d3.event.pageX > 650 ? d3.event.pageX - 150 : d3.event.pageX + 20) + 'px').style('top', d3.event.pageY - 50 + 'px');

    tempColor = this.style.fill;
    d3.select(this).style('opacity', .9).style('fill', 'black');
  }) // end mouseover

  .on('mouseout', function (d) {

    tooltip.transition().style('opacity', 0);

    d3.select(this).style('opacity', 1).style('fill', tempColor);
  });

  handle.transition().attr('height', function (d) {
    return yScale(d);
  }).attr('y', function (d, i) {
    return height - yScale(d) - 50;
  }).delay(function (d, i) {
    return i * 5;
  }).duration(100);
  //.ease(d3.easeElasticOut);
}); // end d3.json

function getMonth(number) {
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[number];
}