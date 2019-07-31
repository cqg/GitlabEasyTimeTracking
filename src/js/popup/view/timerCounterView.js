/**
 * @file Contains UI of the timer, shows currently spent time to user
 */

import Timer from 'easytimer.js';
import { calculateSpentSeconds } from '../actions/timer';

const timer = new Timer();
const timerCounterElement = document.getElementById("timerCounter");
const timerCounterHelpElement = document.getElementById("timerCounterHelp");
const timerTotalElement = document.getElementById("timerTotal");

export function updateTimerCounter(state) {
  const secondsPassed = calculateSpentSeconds(state.timer.startTime);
  timerTotalElement.innerText = secondsToFormattedTime(secondsPassed + state.spentTime.time);
  timerCounterElement.innerText = secondsToFormattedTime(secondsPassed);
  timerCounterHelp.innerText = state.timer.startTime > 0 ? 'recording' : '';
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
