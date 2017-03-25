// TODO: add exercises to piechart tooltip

const createPie = pieData => {

  const pieMargin = {top: 10, right: 80, bottom: 10, left: 25},
    pieWidth = 300,
    pieHeight = 220,
    radius = Math.min(pieWidth, pieHeight) / 2,
    color = d3.scaleOrdinal(d3.schemeCategory20b);

  const tooltip = d3.select('body').append('div')
    .attr('id', 'tooltip');

  const pieSvg = d3.select('#pie')
    .attr('width', pieWidth + pieMargin.left + pieMargin.right)
    .attr('height', pieHeight + pieMargin.top + pieMargin.bottom);

  const g = pieSvg.append('g')
    .attr('transform', `translate(${pieWidth / 2 + pieMargin.left},${pieHeight / 2 + pieMargin.top})`);

  const pie = d3.pie()
    .sort(null)
    .value(d => d[1]);

  const path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  const arc = g.selectAll('.arc')
    .data(pie(pieData))
    .enter()
    .append('g')
    .attr('class', 'arc');

  arc.append('path')
    .attr('d', path)
    .attr('fill', d => color(d.data[0]))
    .on('mousemove', (d) => {
      tooltip.transition()
        .duration(100)
        .style('opacity', .9);
      tooltip.text(d.data[0])
        .style('left', `${d3.event.pageX + 15}px`)
        .style('top', `${d3.event.pageY - 20}px`);
    })
    .on('mouseout', () => {
      tooltip.transition()
      .duration(400)
      .style('opacity', 0);
    });

  const key = pieSvg.append('g');

  const keyItem = key.selectAll('g')
    .data(pieData)
    .enter().append('g');

  keyItem.append('circle')
    .attr('cx', pieWidth + pieMargin.left - 20)
    .attr('cy', (d, i) => pieMargin.top + (pieData.length * 3.5) - 28 + (i * 18))
    .attr('r', 5)
    .attr('fill', d => color(d[0]));

  keyItem.append('text')
    .attr('x', pieWidth + pieMargin.left - 8)
    .attr('y', (d, i) => pieMargin.top + (pieData.length * 3.5) - 25.5 + (i * 18.1))
    .text(d => d[0])
    .attr('class','pie-keys');

  pieSvg.append('text')
    .attr('transform', `translate(${(pieWidth - pieMargin.left - 170)/2},${pieMargin.top + 150}) rotate(-90)`)
    .attr('id', 'pie-title')
    .text('Muscles Worked');


}
