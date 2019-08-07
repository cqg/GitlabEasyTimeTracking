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
  onTimerToggled,
  isTimerActive,
  isTimerLoaded,
  cancelTimer
} from "./popup/actions/timer";
import { onNewMergeRequest, initializeUserId } from "./popup/actions/spentTime";
import MainComponent from "./popup/components/mainComponent";
import { startTimerCounter } from "./popup/components/timerCounterView";
import reducer from "./popup/reducers";

class Popup {
  constructor() {
    this._store = createStore(reducer, applyMiddleware(reduxThunk));
    this._mainComponent = new MainComponent(this._store);
    this._subscribeToStore();
    this._subscribeToEvents();

    Promise.all([
      // Get timer data from browser local storage.
      this._store.dispatch(initializeTimerData()),
      // Get data from current url.
      retrievePageUrl(),
      this._store.dispatch(initializeSettingsData())
    ])
    .then( (values) => {
      this._store.dispatch(initializeUserId())

      let projectId;
      let mergeRequestId;
      const state = this._store.getState();

      if (isTimerActive(state)) {
        projectId = state.timer.projectId;
        mergeRequestId = state.timer.mergeRequestId;
        //TODO: Pass state instead of store.
        startTimerCounter(this._store);
      }
      else {
        const url = values[1];
        const path = new URL(url).pathname;
        projectId = this._getProjectFromPath(path);
        mergeRequestId = this._getMergeRequestIdFromPath(path);
      }
      return this._store.dispatch(
        onNewMergeRequest(projectId, mergeRequestId)
      );
    },
      err => {
        console.log("Error:", err);
      }
    );
  }

  _getProjectFromPath(path) {
    let elems = path.split("/");
    if (elems.length > 2) {
      return elems[1] + "/" + elems[2];
    }
    return "";
  }

  _getMergeRequestIdFromPath(path) {
    let elems = path.split("/");
    if (elems.length > 4 && elems[3] == "merge_requests") {
      return elems[4];
    }
    return "";
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
      onTimerToggled(this._store);
    });

    document.addEventListener("onTimerCancelled", () => {
      this._store.dispatch(cancelTimer());
    });

    document.addEventListener("onMergeRequestChanged", event => {
      const state = this._store.getState();
      this._store.dispatch(
        onNewMergeRequest(state.mrInfo.projectId, event.detail.mrId)
      );
    });
  }
}

new Popup();
