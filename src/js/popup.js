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
import reducer from "./popup/reducers";

class Popup {
  constructor() {
    this._store = createStore(reducer, applyMiddleware(reduxThunk));
    this._mainComponent = new MainComponent(this._store);
    this._subscribeToStore();
    this._subscribeToEvents();

    this._initializeData().catch(error => {
      const state = this._store.getState();
      if (
        state.settings &&
        (!state.settings.hostname || !state.settings.token)
      ) {
        console.log("Please fill GitLab hostname and token in add-on options");
      } else if (error instanceof TypeError) {
        console.log(`URL is invalid, check your GitLab server in options`);
      } else if (error.status && error.status == 401) {
        console.log(`Unathorized, check your GitLab token in options`);
      }
    });
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

    const state = this._store.getState();

    // Start displaying spent time changes if timer is active.
    if (isTimerActive(state)) {
      this._mainComponent.startTimerCounter();
    }
    const [projectId, mergeRequestId] = isTimerActive(state)
      ? [state.timer.projectId, state.timer.mergeRequestId]
      : this._getMrInfoFromPath(new URL(url).pathname);

    return await Promise.all([
      this._store.dispatch(initializeUserId()),
      this._store.dispatch(selectMergeRequest(projectId, mergeRequestId))
    ]);
  }

  _getMrInfoFromPath(path) {
    let elems = path.split("/");
    const projectId = elems.length > 2 ? elems[1] + "/" + elems[2] : "";
    const mergeRequestId =
      elems.length > 4 && elems[3] == "merge_requests" ? elems[4] : "";
    return [projectId, mergeRequestId];
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
      this._store.dispatch(toggleTimer()).then(() => {
        const state = this._store.getState();
        if (!isTimerLoaded(state)) return;

        if (isTimerActive(state)) {
          this._mainComponent.startTimerCounter();
        } else {
          this._mainComponent.stopTimerCounter();
        }
      });
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
