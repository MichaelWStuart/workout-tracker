const lineSvg = d3.select('#line'),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 300,
    height = 300,
    g = lineSvg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);



const x = d3.scaleTime()
  .rangeRound([0, width]);

const y = d3.scaleLinear()
  .rangeRound([height, 0]);


// domain/range are static
// default fill blank area with instructions

const renderLine = (lineData) => {

  const line = d3.line()
    .x(d => x(new Date(d[1])))
    .y(d => y(d[1]));

    x.domain(d3.extent(lineData, d => new Date(d[0])));
    y.domain(d3.extent(lineData, d => d[1]));

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .select('.domain')
      .remove();

    g.append('path')
      .datum(lineData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line);
}
