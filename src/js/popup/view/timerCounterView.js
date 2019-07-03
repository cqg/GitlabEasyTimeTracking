import Timer from 'easytimer.js';
import { calculateSpentSeconds } from '../actions/timer';

const timer = new Timer();
const timerCounterElement = document.getElementById("timer-counter");

export function updateTimerCounter(state) {
  const secondsPassed = calculateSpentSeconds(state.timer.startTime) + state.spentTime.time;
  timerCounterElement.innerText = secondsToFormattedTime(secondsPassed);
}

function secondsToFormattedTime(seconds) {
  let date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}

export function startTimerCounter(store) {
  timer.start();
  timer.addEventListener('secondsUpdated', () => updateTimerCounter(store.getState()));
}

export function stopTimerCounter() {
  timer.stop();
}
