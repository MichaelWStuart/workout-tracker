const workoutLogData = verifyWorkoutLog();

function verifyWorkoutLog() {
  const log = window.localStorage.getItem('_workout_log');
  return (log ? JSON.parse(log) : null);
}

const getKeys = arr => arr.reduce((acc,val) => acc.concat(Object.keys(val)[0]),[]);

window.onload = () => {

  (() => {
    if(workoutLogData) {
      createBar(workoutLogData);
      createPie(workoutLogData);
    }
  })()

  const generateLog = () => {
    const plan = JSON.parse(window.localStorage.getItem('_workout_plan'));
    const twentyFourHours = 1000 * 60 * 60 * 24;
    const currentUTC = Date.parse(new Date);
    const days = Object.keys(plan);
    const NUMBER_OF_WEEKS = 12;
    const log = [];
    let j = 1;
    for (let i = 1; i <= (NUMBER_OF_WEEKS * 7); i++) {
      const date = currentUTC - (twentyFourHours * i);
      const day = days[new Date(date).getDay()]
      if(plan[day].length > 0) {
        const workout = {[date]:{"exercises":[]}}
        plan[day].forEach((exercise, index) => {
          workout[date].exercises.push({[exercise.name]: []});
          for(let k = 0; k < 3; k++) {
            workout[date].exercises[index][exercise.name].push((((NUMBER_OF_WEEKS * 7) + 30) - (Math.floor(Math.random() * 5) + j)) - (k * 5));
          }
        })
        log.push(workout)
        j++;
      }
    }
    window.localStorage.setItem('_workout_log', JSON.stringify(log.reverse()));
    alert('Workout Log Created')
  }

  document.getElementById('generate').addEventListener('click', () => {
    generateLog();
  })

  let alerted;

  document.getElementById('new').addEventListener('click', () => {
    if(alerted) {
      window.location.replace('builder.html');
    } else {
      alert('Creating a new workout will wipe out existing data');
      alerted = true;
      window.localStorage.setItem('_workout_plan', '')
      window.localStorage.setItem('_workout_log', '')
    }
  });
}
