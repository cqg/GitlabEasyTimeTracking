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
import MainComponent from "./popup/view/mainComponent";
import { startTimerCounter } from "./popup/view/timerCounterView";
import reducer from "./popup/reducers";

export default class Popup {
  constructor() {
    this._store = createStore(reducer, applyMiddleware(reduxThunk));
    this._mainComponent = new MainComponent(this._store);
    this._initializeStore();
    this._subscribeToEvents();
    retrievePageUrl().then(
      url => this._initializeFromUrl(url),
      err => {
        console.log("Error:", err);
      }
    );
  }

  _initializeFromUrl(url) {
    const data = this._store.getState();
    if (!isTimerLoaded(data) || !isTimerActive(data)) {
      const path = new URL(url).pathname;
      const projectId = this.getProjectFromPath(path);
      const mergeRequestId = this.getMergeRequestIdFromPath(path);
      this._store.dispatch(onNewMergeRequest(projectId, mergeRequestId));
    }
  }

  getProjectFromPath(path) {
    let elems = path.split("/");
    if (elems.length > 2) {
      return elems[1] + "/" + elems[2];
    }
    return "";
  }

  getMergeRequestIdFromPath(path) {
    let elems = path.split("/");
    if (elems.length > 4 && elems[3] == "merge_requests") {
      return elems[4];
    }
    return "";
  }

  _initializeStore() {
    this._store.dispatch(initializeTimerData()).then(() => {
      const state = this._store.getState();
      if (!isTimerActive(state)) {
        return;
      }
      //TODO: Pass state instead of store.
      startTimerCounter(this._store);
      return this._store.dispatch(
        onNewMergeRequest(state.mrInfo.projectId, state.mrInfo.mrId)
      );
    });

    this._store.dispatch(initializeSettingsData()).then(() => {
      const state = this._store.getState();
      Promise.all([
        this._store.dispatch(initializeUserId()),
        this._store.dispatch(
          onNewMergeRequest(state.mrInfo.projectId, state.mrInfo.mrId)
        )
      ]);
    });

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
