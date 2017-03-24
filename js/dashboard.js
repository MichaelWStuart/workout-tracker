const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MUSCLES = ['','Biceps','Deltoids','Chest','Pecs','Triceps','Abs','Calves','Glutes','Traps','Quads','Hamstrings','Lats','Biceps','Obliques','Calves'];

const fetchLocalStorage = item => JSON.parse(window.localStorage.getItem(item) || null);

const formatLineData = (workoutPlan, workoutLog, logKeys) => {
  const lineData = []
  const workoutNames = () => {
    return DAYS.reduce((acc, day, i) => {
      workoutPlan[day].forEach(exercise => {
        if(acc.indexOf(exercise.name) === -1) {
          acc.push(exercise.name)
        }
      });
      return acc;
    },[]);
  }

  const convertLineData = (exerciseName) => {
    const list = [];
    workoutLog.forEach((workout, i) => {
      workout[logKeys[i]].exercises.forEach((exercise,j) => {
        const name = Object.keys(exercise)[0]
        if(name === exerciseName) {
          list.push([new Date(Number(logKeys[i])), exercise[name][0]])
        }
      });
    });
    return list;
  }

  workoutNames().forEach(exerciseName => {
    lineData.push(convertLineData(exerciseName))
  })

  return [lineData, workoutNames()]
}

const convertPieData = (workoutPlan, workoutLog, logKeys) => {
  const list = [];
  workoutLog.forEach((workout, i) => {
    const UTCdate = Number(logKeys[i])
    const day = DAYS[new Date(UTCdate).getDay()];
    workoutPlan[day].forEach(exercise => {
      exercise.muscles.forEach(muscle => {
        list.push(MUSCLES[muscle], MUSCLES[muscle]);
      });
      exercise.muscles_secondary.forEach(muscle => {
        list.push(MUSCLES[muscle]);
      });
    });
  });
  return list;
}

const convertBarData = (workoutLog, logKeys) => {
  const list = [];
  workoutLog.forEach((workout, i) => {
    workout[logKeys[i]].exercises.forEach((exercise,j) => {
      list.push(Object.keys(exercise)[0]);
    });
  });
  return list;
}

const isFound = (value, arr) => {
  for(let i = 0; i < arr.length; i++) {
    if(value === arr[i][0]) {
      return i;
    }
  }
  return -1;
}

// TODO: use filter instead of this inefficient garbage

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

const generateLog = () => {
  const plan = JSON.parse(window.localStorage.getItem('_workout_plan'));
  const twentyFourHours = 1000 * 60 * 60 * 24;
  const currentUTC = Date.parse(new Date);
  const days = Object.keys(plan);
  const NUMBER_OF_WEEKS = 8;
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

const handleNewClick = () => {
  if (window.confirm('Creating a new log will erase all data.')) {
    // window.localStorage.setItem('_workout_plan', '');
    // window.localStorage.setItem('_workout_log', '');
    window.location.replace('builder.html');
  }
}

const handleBarHover = target => {
  console.log(target)
}

const addButtonListeners = () => {
  document.getElementById('generate').addEventListener('click', generateLog);
  document.getElementById('new').addEventListener('click', handleNewClick);
};

const addBarListener = () => {
  document.querySelectorAll('.bar').forEach(bar => {
    bar.addEventListener('mouseover', e => handleBarHover(e.path[0].id));
  });
}

window.onload = () => {
  const workoutLog = fetchLocalStorage('_workout_log');
  const workoutPlan = fetchLocalStorage('_workout_plan');

  if(workoutLog && workoutPlan) {
    const logKeys = workoutLog.reduce((acc,val) => acc.concat(Object.keys(val)[0]),[]);
    const [lineData, workoutNames] = formatLineData(workoutPlan, workoutLog, logKeys);
    createPie(format(convertPieData(workoutPlan, workoutLog, logKeys)));
    createBar(format(convertBarData(workoutLog, logKeys)));
    createLine(lineData, workoutNames);
    addBarListener();
  };

  addButtonListeners();
}
