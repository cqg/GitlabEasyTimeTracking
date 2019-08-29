/**
 * @file Defines MainComponent.
 */

import { isTimerLoaded, isTimerActive } from "../actions/timer";
import TimerHandlingComponent from "./timerHandlingComponent";
import MergeRequestSelectComponent from "./mergeRequestSelectComponent";
import TimerCounterComponent from "./timerCounterComponent";

export default class MainComponent {
  constructor(store) {
    this._store = store;
    this._timerHandlingComponent = new TimerHandlingComponent();
    this._timerCounterComponent = new TimerCounterComponent(store);
    this._mergeRequestSelectComponent = new MergeRequestSelectComponent(store);
  }

  updateView() {
    const state = this._store.getState();
    this._timerHandlingComponent.updateView(
      state.mrInfo.name != "",
      isTimerLoaded(state) && isTimerActive(state)
    );
    this._mergeRequestSelectComponent.setMergeRequestName(state.mrInfo.name);
    this._timerCounterComponent.updateTimerCounter(
      state.timer.startTime,
      state.spentTime.time
    );
  }

  startTimerCounter() {
    this._timerCounterComponent.startTimerCounter();
  }

  stopTimerCounter() {
    this._timerCounterComponent.stopTimerCounter();
  }
}
