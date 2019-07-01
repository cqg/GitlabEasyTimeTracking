import Timer from 'easytimer.js';

const timer = new Timer();
function updateTimerCounter(element, timer) {
  element.innerText = timer.getTimeValues().toString();
}

export function startTimerCounter(initialSeconds) {
  var options = initialSeconds
    ? { precision: 'seconds', startValues: { seconds: initialSeconds } }
    : null;
  timer.start(options);

  var element = document.getElementById("timer-counter");
  timer.addEventListener('secondsUpdated', () => updateTimerCounter(element, timer));
}

export function stopTimerCounter() {
  timer.stop();
}