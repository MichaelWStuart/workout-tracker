window.onload = () => {

  const today = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
  const priorWorkouts = window.localStorage.getItem('_workout_log');
  const workoutPlan = verifyWorkoutPlan();
  let parsedPriors;

  function verifyWorkoutPlan() {
    let plan = window.localStorage.getItem('_workout_plan');
    if(plan) {
      plan = JSON.parse(plan);
      if(plan[today].length) {
        return plan[today];
      }
    }
    window.location.replace('dashboard.html');
  }

  const getKeys = arr => arr.reduce((acc,val) => acc.concat(Object.keys(val)[0]),[]);

  const appendPageTitle = () => {
    document.getElementById('page-title').innerHTML = `Workout plan for ${today}`;
  }

  const appendWorkoutTitles = () => {
    const topRow = document.getElementById('top-row');
    workoutPlan.forEach(exercise => {
      const title = document.createElement('th');
      title.innerHTML = `${exercise.name}`;
      topRow.appendChild(title);
    });
  }

  const createDateCell = UTCdate => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const date = new Date(Number(UTCdate));
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const dateCell = document.createElement('td');
    dateCell.innerHTML = `${month} ${day}, ${year}`;
    return dateCell;
  }

  const appendTheWorkout = (prior, timestamp) => {
    const exerciseNames = getKeys(prior);
    const row = document.createElement('tr');
    document.getElementById('table-body').appendChild(row);
    row.appendChild(createDateCell(timestamp));
    prior.forEach((exercise, i) => {
      const name = exerciseNames[i];
      const set = exercise[name];
      const exerciseCell = document.createElement('td');
      row.appendChild(exerciseCell);
      set.forEach((reps, j) => {
        if(j) exerciseCell.appendChild(document.createTextNode(' / '));
        if(!reps) reps = 0;
        exerciseCell.appendChild(document.createTextNode(reps));
      });
    });
  }

  const workoutsAreSimilar = prior => {
    for(let i = 0; i < workoutPlan.length; i++) {
      if(!prior[i].hasOwnProperty(workoutPlan[i].name)) {
        return false;
      }
    }
    return true;
  }

  const appendPriorWorkouts = () => {
    if(priorWorkouts) {
      parsedPriors = JSON.parse(priorWorkouts);
      const timestamps = getKeys(parsedPriors);
      timestamps.forEach((timestamp, index) => {
        const prior = parsedPriors[index][timestamp].exercises;
        if(workoutsAreSimilar(prior)) {
          appendTheWorkout(prior, timestamp);
        }
      });
    }
  }

  const appendInputsRow = () => {
    const UTCdate = Date.parse(new Date());
    const row = document.createElement('tr');
    document.getElementById('table-body').appendChild(row);
    row.id = 'inputs-row';
    row.appendChild(createDateCell(UTCdate));
    workoutPlan.forEach((exercise, set) => {
      const inputCell = document.createElement('td');
      inputCell.id = `${exercise.name}-${set}`;
      inputCell.className = 'workout-input';
      row.appendChild(inputCell);
      for(let rep = 0; rep < 3; rep++) {
        const repInput = document.createElement('input');
        repInput.id = `${set}-${rep}`;
        repInput.className = 'reps';
        if(rep) inputCell.appendChild(document.createTextNode('/'));
        inputCell.appendChild(repInput);
      }
    });
  }

  const storeInputData = () => {
    const inputData = [];
    document.querySelectorAll('.workout-input').forEach(inputElement => {
      const setData = [];
      const id = inputElement.id;
      const name = id.slice(0, id.lastIndexOf('-'));
      const setList = inputElement.children;
      for(let set = 0; set < setList.length; set++) {
        setData.push(setList[set].value);
      }
      inputData.push({[name]:setData});
    });
    return inputData;
  }

  const assignAndStore = () => {
    document.getElementById('0-0').setAttribute('autofocus','true');
    document.getElementById('finish').addEventListener('click', () => {
      const inputData = {[Date.parse(new Date())]:{exercises: storeInputData()}};
      window.localStorage.setItem('_workout_log', JSON.stringify((parsedPriors || []).concat(inputData)));
      window.location.replace('dashboard.html');
    });
  }

  (() => {
    appendPageTitle();
    appendWorkoutTitles();
    appendPriorWorkouts();
    appendInputsRow();
    assignAndStore();
  })();

}
