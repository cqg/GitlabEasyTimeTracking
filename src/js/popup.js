/**
 * @file Main file for add-on popup
 */

import "../css/popup.css";
import "../css/lib/bootstrap.min.css";

import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";

import { storeTimerData, retrievePageUrl } from "./popup/api/browser";
import {
  initializeTimerData,
  initializeSettingsData
} from "./popup/actions/settings";
import {
  isTimerActive,
  isTimerLoaded,
  toggleTimer,
  cancelTimer
} from "./popup/actions/timer";
import {
  selectMergeRequest,
  initializeUserId
} from "./popup/actions/mergeRequest";
import MainComponent from "./popup/components/mainComponent";
import { startTimerCounter } from "./popup/components/timerCounterView";
import reducer from "./popup/reducers";

class Popup {
  constructor() {
    this._store = createStore(reducer, applyMiddleware(reduxThunk));
    this._mainComponent = new MainComponent(this._store);
    this._subscribeToStore();
    this._subscribeToEvents();

    this._initializeData();
  }

  async _initializeData() {
    const [, , url] = await Promise.all([
      // Load timer state from browser storage and put it to the store.
      this._store.dispatch(initializeTimerData()),
      // Load plugin parameters from browser storage and put it to the store.
      this._store.dispatch(initializeSettingsData()),
      // Load current url.
      retrievePageUrl()
    ]);

    this._store.dispatch(initializeUserId());

    const [projectId, mergeRequestId] = (() => {
      const state = this._store.getState();
      if (isTimerActive(state)) {
        startTimerCounter(state);
        return [state.timer.projectId, state.timer.mergeRequestId];
      } else {
        return this._getMrInfoFromPath(new URL(url).pathname);
      }
    })();

    return await this._store.dispatch(
      selectMergeRequest(projectId, mergeRequestId)
    );
  }

  _getMrInfoFromPath(path) {
    let elems = path.split("/");
    const project = elems.length > 2 ? elems[1] + "/" + elems[2] : "";
    const mergeRequestId =
      elems.length > 4 && elems[3] == "merge_requests" ? elems[4] : "";
    return [project, mergeRequestId];
  }

  _subscribeToStore() {
    this._store.subscribe(() => {
      const state = this._store.getState();
      console.log("state", state);

      if (!isTimerLoaded(state)) {
        return;
      }
      storeTimerData(state.timer);
      this._mainComponent.updateView();
    });
  }

  _subscribeToEvents() {
    document.addEventListener("onTimerToggled", () => {
      this._store.dispatch(toggleTimer());
    });

    document.addEventListener("onTimerCancelled", () => {
      this._store.dispatch(cancelTimer());
    });

    document.addEventListener("onMergeRequestChanged", event => {
      const state = this._store.getState();
      this._store.dispatch(
        selectMergeRequest(state.mrInfo.projectId, event.detail.mergeRequestId)
      );
    });
  }
}

new Popup();
