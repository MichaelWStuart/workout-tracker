const createLine = (data, workoutNames) => {

  const margin = {top: 20, right: 100, bottom: 30, left: 50},
    width = 560,
    height = 500,
    color = d3.scaleOrdinal(d3.schemeCategory20b),
    minReps = d3.min(data.reduce((acc,val) => acc.concat(d3.min(val, d => d[1])),[]));
    maxReps = d3.max(data.reduce((acc,val) => acc.concat(d3.max(val, d => d[1])),[]));
    minDate = d3.min(data.reduce((acc,val) => acc.concat(d3.min(val, d => d[0])),[]));
    maxDate = d3.max(data.reduce((acc,val) => acc.concat(d3.max(val, d => d[0])),[]));

  const svg = d3.select('#line')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleTime()
    .range([0, width])
    .domain([minDate, maxDate]);

  const y = d3.scaleLinear()
    .range([height, 0])
    .domain([minReps, maxReps ]);

  const line = d3.line()
    .x(d => x(d[0]))
    .y(d => y(d[1]));

  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .select('.domain');

  g.append('g')
    .call(d3.axisLeft(y))
    .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', -40)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text('Number of reps completed in the first set');

  data.forEach((_, index) => {
    g.append('path')
      .datum(data[index])
      .attr('id', workoutNames[index])
      .attr('class', 'workout-line')
      .attr('fill', 'none')
      .attr('stroke', color(index))
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  });

  const key = svg.append('g');

  const keyItem = key.selectAll('g')
    .data(workoutNames)
    .enter().append('g');

  keyItem.append('rect')
    .attr('x', margin.left + 20)
    .attr('y', (d, i) => margin.top + (i * 27))
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', (d, i) => color(i));

  keyItem.append('text')
    .attr('x', margin.left + 40)
    .attr('y', (d, i) => margin.top + 13 + (i * 27))
    .text(d => d);
}
