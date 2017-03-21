window.onload = () => {

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
