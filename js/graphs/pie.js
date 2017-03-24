function createPie(log, plan) {

  const pieData = formatPieData(),
    pieMargin = {top: 70, right: 100, bottom: 10, left: 10},
    pieWidth = 300,
    pieHeight = 250,
    radius = Math.min(pieWidth, pieHeight) / 2;

  const pieSvg = d3.select('#pie')
    .attr('width', pieWidth + pieMargin.left + pieMargin.right)
    .attr('height', pieHeight + pieMargin.top + pieMargin.bottom)

  const g = pieSvg.append('g')
    .attr('transform', `translate(${pieWidth / 2},${pieHeight / 2 + pieMargin.top})`);

  const color = d3.scaleOrdinal(d3.schemeCategory20);

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
    .attr('fill', d => color(d.data[0]));

  const key = pieSvg.append('g')

  const keyItem = key.selectAll('g')
    .data(pieData)
    .enter().append('g');

  keyItem.append('rect')
    .attr('x', pieWidth + pieMargin.left - 10)
    .attr('y', (d, i) => pieMargin.top + (pieData.length * 5) + (i * 27))
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', d => color(d[0]));

  keyItem.append('text')
    .attr('x', pieWidth + pieMargin.left + 10)
    .attr('y', (d, i) => pieMargin.top + (pieData.length * 6.9) + (i * 27))
    .text(d => d[0]);

  pieSvg.append('text')
    .attr('transform', `translate(${(pieWidth - pieMargin.left)/2},${pieMargin.top - 20})`)
    .attr('id', 'title')
    .text('Muscles Worked');

  function formatPieData() {

    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const muscles = ['','Biceps','Deltoids','Chest','Pecs','Triceps','Abs','Calves','Glutes','Traps','Quads','Hamstrings','Lats','Biceps','Obliques','Calves'];

    const convert = () => {
      const list = [];
      const keys = getKeys(log);
      log.forEach((workout, i) => {
        const UTCdate = Number(keys[i])
        const day = days[new Date(UTCdate).getDay()];
        plan[day].forEach(exercise => {
          exercise.muscles.forEach(muscle => {
            list.push(muscles[muscle]);
            list.push(muscles[muscle]);
          });
          exercise.muscles_secondary.forEach(muscle => {
            list.push(muscles[muscle]);
          });
        });
      });
      return list;
    }

    const isFound = (value, arr) => {
      for(let i = 0; i < arr.length; i++) {
        if(value === arr[i][0]) return i;
      }
      return -1;
    }

    const format = arr => {
      const list = [[0,0]];
      arr.forEach(name => {
        const index = isFound(name, list);
        if (index === -1) {
          list.push([name, 1]);
        } else {
          list[index][1]++;
        }
      });
      list.shift();
      return list;
    }

    return format(convert());
  }
}
