/**
 * @file Defines MainComponent.
 */

import { isTimerActive } from "../actions/timer";
import { updateTimerCounter } from "./timerCounterView";
import TimerHandlingComponent from "./timerHandlingComponent";
import MergeRequestSelectComponent from "./mergeRequestSelectComponent";

export default class MainComponent {
  constructor(store) {
    this._store = store;
    this.timerHandlingComponent = new TimerHandlingComponent();
    this.mergeRequestSelectComponent = new MergeRequestSelectComponent(store);
  }

  updateView() {
    const state = this._store.getState();
    this.timerHandlingComponent.updateView(isTimerActive(state));
    this.mergeRequestSelectComponent.setMergeRequestName(state.mrInfo.name);
    updateTimerCounter(state);
  }
}