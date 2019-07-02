import Timer from 'easytimer.js';
import { calculateSpentSeconds } from '../actions/timer';

const timer = new Timer();
const timerCounterElement = document.getElementById("timer-counter");

function updateTimerCounter(store) {
  const data = store.getState();
  const secodsPassed = calculateSpentSeconds(data.timer.startTime);
  timerCounterElement.innerText = secondsToFormattedTime(secodsPassed);
}

function secondsToFormattedTime(seconds) {
  let date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}

export function startTimerCounter(store) {
  //TODO: get already spent time from store.
  // const options = initialSeconds
  //   ? { precision: 'seconds', startValues: { seconds: initialSeconds } }
  //   : null;
  timer.start();
  timer.addEventListener('secondsUpdated', () => updateTimerCounter(store));
}

export function stopTimerCounter() {
  timer.stop();
}