const createBar = barData => {

  const barMargin = {top: 10, right: 10, bottom: 250, left: 60},
    barWidth = 500,
    barHeight = 200,
    color = d3.scaleOrdinal(d3.schemeCategory20c);

  const bar = d3.select('#bar')
    .attr('width', barWidth + barMargin.left + barMargin.right)
    .attr('height', barHeight + barMargin.top + barMargin.bottom)
    .append('g')
    .attr('transform', `translate(${barMargin.left}, ${barMargin.top})`);

  const x = d3.scaleBand()
    .range([0, barWidth])

  const y = d3.scaleLinear()
    .range([barHeight, 0]);

  x.domain(barData.map(d => d[0]));
  y.domain([0, d3.max(barData.map(d => d[1]))]);

  bar.selectAll('.bar')
    .data(barData)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('fill', (d, i) => color(i))
    .attr('id', d => d[0])
    .attr('x', d => x(d[0]))
    .attr('width', x.bandwidth())
    .attr('y', d => y(d[1]))
    .attr('height', d => barHeight - y(d[1]));

  bar.append('g')
    .attr('transform', `translate(0,${barHeight})`)
    .call(d3.axisBottom(x).ticks(10))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-1em')
    .attr('dy', '-.5em')
    .attr('transform', 'rotate(-90)')
    .attr('class', 'bar-muscles');

  bar.append('g')
    .call(d3.axisLeft(y));

  bar.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('dx', '-10.5em')
    .attr('dy', '-2.5em')
    .text('Sets Completed')
    .attr('id', 'bar-caption')
}
