/**
 * @file Contains UI of the timer, shows currently spent time to user
 */

import Timer from "easytimer.js";
import { calculateSpentSeconds } from "../actions/timer";

const timer = new Timer();
const timerCounterElement = document.querySelector("#timerCounter");
const timerTotalElement = document.querySelector("#timerTotal");
const timerCounterHelpElement = document.querySelector("#timerCounterHelp");

export function updateTimerCounter(state) {
  const secondsPassed = calculateSpentSeconds(state.timer.startTime);
  timerTotalElement.innerText = secondsToFormattedTime(
    secondsPassed + state.spentTime.time
  );
  timerCounterElement.innerText = secondsToFormattedTime(secondsPassed);
  timerCounterHelpElement.innerText =
    state.timer.startTime > 0 ? "recording" : "";
}

function secondsToFormattedTime(seconds) {
  let date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}

export function startTimerCounter(state) {
  timer.start();
  timer.addEventListener("secondsUpdated", () => updateTimerCounter(state));
}

export function stopTimerCounter() {
  timer.stop();
}
