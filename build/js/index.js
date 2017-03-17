window.onload = () => {
  if(window.localStorage.getItem('_workout_plan')) {
    window.location.replace('dashboard.html');
  } else {
    window.location.replace('landing.html');
  }
}
