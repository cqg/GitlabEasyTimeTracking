import '../css/popup.css';
import '../css/bootstrap.min.css';

import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { faPlayCircle, faStopCircle } from '@fortawesome/free-regular-svg-icons';
import { library as svgCoreLib, dom as svgCoreDom } from '@fortawesome/fontawesome-svg-core';

import { storeTimerData, retrievePageUrl } from './popup/api/browser';
import { initializeTimerData, initializeSettingsData } from './popup/actions/settings';
import { onTimerClick, isTimerActive, isTimerLoaded } from './popup/actions/timer';
import { onNewMergeRequest, initializeUserId } from './popup/actions/spentTime';
import { updateView, updateInputsView, getProjectId, getMergeRequestId, timerBtn, addMergeRequestChangeListener } from './popup/view/view';
import { startTimerCounter } from './popup/view/timerCounterView';
import reducer from './popup/reducers';

const store = createStore(reducer, applyMiddleware(reduxThunk));

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
  retrievePageUrl().then(initializeFromUrl, onError);
  timerBtn.addEventListener("click", () => onTimerClick(store, getProjectId(), getMergeRequestId()), false);
  addMergeRequestChangeListener(() => store.dispatch(onNewMergeRequest(getProjectId(), getMergeRequestId())));
}

function loadFontAwsomeIcons() {
  svgCoreLib.add(faPlayCircle, faStopCircle);
  svgCoreDom.watch();
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

loadFontAwsomeIcons();
initializeInterface();

store.dispatch(initializeTimerData())
  .then(() => {
    if (isTimerActive(store.getState())) {
      startTimerCounter(store);
      return store.dispatch(onNewMergeRequest(getProjectId(), getMergeRequestId()))
    }
  });

store.dispatch(initializeSettingsData())
  .then(() => Promise.all([
    store.dispatch(initializeUserId()),
    store.dispatch(onNewMergeRequest(getProjectId(), getMergeRequestId()))
  ]));