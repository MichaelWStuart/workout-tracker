window.onload = () => {

  if(!window.localStorage.getItem('_workout_plan')) {
    window.location.replace('dashboard.html')
  }

  let priorWorkouts;

  if(!window.localStorage.getItem('_workout_log')) {
    priorWorkouts = false;
  } else {
    priorWorkouts = JSON.parse(window.localStorage.getItem('_workout_log'));
  }

  const workoutPlan = JSON.parse(window.localStorage.getItem('_workout_plan'));
  const currentDate = new Date;

  const timestamp = Date.parse(currentDate);
  const exerciseKeys = [];
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  (() => {
    if(workoutPlan[days[currentDate.getDay()]].length === 0) {
      window.location.replace('dashboard.html');
    }
  })()

  const tableBody = document.getElementById('table-body');
  const topRow = document.getElementById('top-row')

  const state = {
    [timestamp]:{ exercises: [] }
  };

  const setState = exercise => {
    state[timestamp].exercises.push({[exercise.name]: []})
    exerciseKeys.push(exercise.name);
  }

  const formatDate = (date) => {
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  const appendTitle = exercise => {
    const node = document.createElement('th');
    node.className = 'exercise-name';
    node.innerHTML = `${exercise.name}`;
    topRow.appendChild(node);
  }

  const appendInputsRow = index => {
    const inputsRow = document.getElementById('inputs-row');
    const node = document.createElement('td');
    node.className = 'workout-input';
    node.id = `td-${index}`;
    inputsRow.appendChild(node);
  }

  const buildInputTds = (index, nodes) => {
    const td = document.getElementById(`td-${index}`);
    const slash1 = document.createTextNode('/');
    const slash2 = document.createTextNode('/');
    td.appendChild(nodes[0]);
    td.appendChild(slash1);
    td.appendChild(nodes[1]);
    td.appendChild(slash2);
    td.appendChild(nodes[2]);
  }

  const appendInputs = index => {
    const nodes = [];
    for(let i = 0; i < 3; i++) {
      const node = document.createElement('input');
      node.className = 'reps';
      node.id = `rep-${index}-${i}`
      nodes.push(node);
    }
    buildInputTds(index, nodes)
  }

  const appendPriorWorkoutData = (workout, index, timestampKeys, exerciseKeys) => {
    workout[timestampKeys[index]].exercises.forEach((exercise, i) => {
      const target = document.getElementById(timestampKeys[index]);
      const node = document.createElement('td');
      node.id = `${timestampKeys[index]}-${exerciseKeys[i]}`
      target.appendChild(node)
      exercise[exerciseKeys[i]].forEach((set, j) => {
        const targetNode = document.getElementById(`${timestampKeys[index]}-${exerciseKeys[i]}`);
        if(j) {
          const slash = document.createTextNode(' / ');
          targetNode.appendChild(slash);
        }
        if(!set) {
          set = 0;
        }
        const setNode = document.createTextNode(set);
        targetNode.appendChild(setNode);
      });
    });
  }

  const appendPriorWorkouts = () => {
    const timestampKeys = [];
    const workoutKeys = [];
    priorWorkouts.forEach(obj => timestampKeys.push(Object.keys(obj)[0]));
    priorWorkouts[0][timestampKeys[0]].exercises.forEach(obj => exerciseKeys.push(Object.keys(obj)[0]));
    priorWorkouts.forEach((workout, index) => {
      if(currentDate.getDay() === (new Date(Number(timestampKeys[index]))).getDay()) {
        let node = document.createElement('tr');
        node.id = `${timestampKeys[index]}`
        tableBody.append(node);
        node = document.createElement('td');
        document.getElementById(`${timestampKeys[index]}`).appendChild(node);
        node.innerHTML = formatDate(new Date(Number(timestampKeys[index])));
        appendPriorWorkoutData(workout, index, timestampKeys, exerciseKeys)
      }
    });
  }

  (() => {
    let node;
    if(priorWorkouts) {
      appendPriorWorkouts();
    }
    node = document.createElement('tr');
    node.id = 'inputs-row';
    tableBody.appendChild(node);
    node = document.createElement('td');
    node.id = 'current-date';
    document.getElementById('inputs-row').appendChild(node);
    node.innerHTML = formatDate(currentDate);
  })()

  workoutPlan[days[currentDate.getDay()]].forEach((exercise,index) => {
    setState(exercise);
    appendTitle(exercise);
    appendInputsRow(index);
    appendInputs(index);
  });

  document.getElementById('page-title').innerHTML = `Workout Plan For ${days[currentDate.getDay()]}`;

  const storeInputData = () => {
    document.querySelectorAll('.reps').forEach(item => {
      const set = item.id.slice(4,5);
      const rep = item.id.slice(6);
      state[timestamp].exercises[set][exerciseKeys[set]][rep] = item.value;
    });
  }

  document.getElementById('rep-0-0').setAttribute('autofocus','true');

  document.getElementById('finish').addEventListener('click', () => {
    storeInputData();
    if(priorWorkouts) {
      priorWorkouts.push(state);
    } else {
      priorWorkouts = [];
      priorWorkouts.push(state);
    }
    window.localStorage.setItem('_workout_log', JSON.stringify(priorWorkouts));
    window.location.replace('dashboard.html');
  });

}
