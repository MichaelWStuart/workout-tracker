window.onload = () => {

  const muscleName = document.getElementById('muscle-name');
  const exerciseList = document.getElementById('exercise-list');
  const workoutList = document.getElementById('workout-list');
  const finishButton = document.getElementById('finish');

  const state = {
    exercises: {
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: []
    },
    day: 'Monday',
  };

  const elementLookup = key => document.getElementById(key);

  const exerciseListItemTemplate = exercise => `
    <h3>${exercise.name}</h3>
    <p>${exercise.description}</p>
    <button class='add-exercise'>Add</button>
  `;

  // <select class='drop-down'>
  //   <option value='1'>1</option>
  //   <option value='2'>2</option>
  //   <option value='3' selected>3</option>
  //   <option value='4'>4</option>
  //   <option value='5'>5</option>
  // </select>

  const workoutListItemTemplate = exercise => `
    <h3>${exercise.name}</h3>
    <button id='${exercise.name}${state.exercises[state.day].length}'>Remove</button>
  `;

  const repopulateWorkoutListByDay = () => {
    workoutList.innerHTML = '';
    state.exercises[state.day].forEach(exercise => {
      const node = document.createElement('li');
      node.innerHTML = workoutListItemTemplate(exercise);
      workoutList.appendChild(node);
      const removeButton = document.getElementById(`${exercise.name}${state.exercises[state.day].length}`)
      removeButton.addEventListener('click', (e) => {
        removeExercise(e);
      });
    });
  }

  const appendData = muscle => {
    muscleName.innerHTML = muscle;
    JSON.parse(lookUp[muscle]).results.forEach(exercise => {
      const node = document.createElement('li');
      node.innerHTML = exerciseListItemTemplate(exercise);
      exerciseList.appendChild(node);

    });
  }

  const highlightActiveMuscles = children => {
    for(let i = 0; i < children.length; i++) {
      children[i].style.opacity = .5;
      children[i].style.fill = '#00BCD4';
    }
  }

  const removeHighlightMuscles = children => {
    for(let i = 0; i < children.length; i++) {
      children[i].style.opacity = .2;
      children[i].style.fill = '#1a1a1a';
    }
  }

  const removeExercise = e => {
    const index = e.srcElement.id.slice(-1) - 1
    state.exercises[state.day].splice(index, 1)
    workoutList.removeChild(e.target.parentNode);
  }

  const addExercise = exercise => {
    if(state.exercises[state.day].length > 9) {
      alert('You have added the maximum number of exercises for that day');
    } else {
      state.exercises[state.day].push(exercise);
      const node = document.createElement('li');
      node.innerHTML = workoutListItemTemplate(exercise);
      state.exercises[state.day].forEach(() => {
        workoutList.appendChild(node);
      });
      const removeButton = document.getElementById(`${exercise.name}${state.exercises[state.day].length}`)
      removeButton.addEventListener('click', e => {
        removeExercise(e);
      });
    }
  }

  const setAddButtonEvents = muscle => {
    document.querySelectorAll('.add-exercise').forEach((button, index) => {
      button.addEventListener('click', () => {
        addExercise(JSON.parse(lookUp[muscle]).results[index]);
      });
    });
  }

  const handleDiagramClick = element => {
    if(element.id !== 'diagram-box') {
      if(state.muscle) {
        removeHighlightMuscles(elementLookup(state.muscle).children);
      }
      exerciseList.innerHTML = '';
      appendData(element.id);
      highlightActiveMuscles(element.children);
      setAddButtonEvents(element.id);
      state.muscle = element.id;
    }
  }

  const handleDayClick = day => {
    elementLookup(state.day).classList.toggle('active-day');
    elementLookup(day).classList.toggle('active-day');
    state.day = day;
    repopulateWorkoutListByDay();
  }

  const isValid = () => {
    let valid;
    for(let key in state.exercises) {
      if(state.exercises[key].length > 0) {
        valid = true;
      }
    }
    return valid;
  }

  document.querySelectorAll('.day').forEach(day => {
    day.addEventListener('click', target => {
      handleDayClick(target.path[0].id);
    });
  });

  document.querySelectorAll('#diagram-box svg').forEach(group => {
    group.addEventListener('click', target => {
      handleDiagramClick(target.path[1]);
    });
  });

  finishButton.addEventListener('click', () => {
    if(isValid()) {
      window.localStorage.setItem('_workout_plan', JSON.stringify(state.exercises));
      window.location.replace('dashboard.html');
    } else {
      alert('You haven\'t selected any exercises');
    }
  });

}
