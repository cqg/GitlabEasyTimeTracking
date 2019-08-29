/**
 * @file Contains UI of the timer, shows currently spent time to user
 */

import Timer from "easytimer.js";
import { calculateSpentSeconds } from "../actions/timer";

export default class TimerConunterComponent {
  constructor(store) {
    this._store = store;
    this._timer = new Timer();
    this._timer.addEventListener("secondsUpdated", () => {
      const state = this._store.getState();
      this.updateTimerCounter(state.timer.startTime, state.spentTime.time);
    });
    this._timerCounterElement = document.querySelector("#timerCounter");
    this._timerTotalElement = document.querySelector("#timerTotal");
    this._timerCounterHelpElement = document.querySelector("#timerCounterHelp");
  }

  startTimerCounter() {
    this._timer.start();
  }

  stopTimerCounter() {
    this._timer.stop();
  }

  updateTimerCounter(currentStart, spentBefore) {
    const secondsPassed = calculateSpentSeconds(currentStart);
    this._timerCounterElement.innerText = this._secondsToFormattedTime(secondsPassed + spentBefore);
    this._timerCounterElement.innerText = this._secondsToFormattedTime(secondsPassed);
    this._timerCounterHelpElement.innerText = currentStart > 0 ? "recording" : "";
  }

  _secondsToFormattedTime(seconds) {
    let date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  }
}
