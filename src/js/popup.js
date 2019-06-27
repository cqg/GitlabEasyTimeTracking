import "../css/popup.css";
import '../css/bootstrap.min.css';

import { createStore } from 'redux';
import { storeTimerData, retrievePageUrl } from './popup/api/browser';
import { initializeData } from './popup/actions/settings';
import { onTimerClick, isTimerActive, isTimerLoaded } from './popup/actions/timer';
import { updateView, updateInputsView, getProjectId, getMergeRequestId, timerBtn } from './popup/view/view';
import reducer from './popup/reducers';

const store = createStore(reducer);

function getProjectFromPath(path) {
  let elems = path.split("/");
  if (elems.length > 2) {
    return elems[1] + '/' + elems[2];
  }
  return "";
}

function getMergeRequestIdFromPath(path) {
  let elems = path.split("/");
  if (elems.length > 4 && elems[3] == "merge_requests") {
    return elems[4];
  }
  return "";
}

function initializeFromUrl(url) {
  let data = store.getState();
  if (!isTimerLoaded(data) || !isTimerActive(data))
  {
    let path = (new URL(url)).pathname;
    updateInputsView(getProjectFromPath(path), getMergeRequestIdFromPath(path));
  }
}

function onError(err) {
  console.log('Error:', err);
}

function initializeInterface() {
  retrievePageUrl(initializeFromUrl, onError);
  timerBtn.addEventListener("click", () => onTimerClick(store, getProjectId(), getMergeRequestId()), false);
}

store.subscribe(() => {
  let state = store.getState();
  console.log('state', state);

  if (!isTimerLoaded(state)){
      return;
  }
  storeTimerData(state.timer);
  updateView(state);
});

initializeInterface();
initializeData(store);

