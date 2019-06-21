import "../css/popup.css";
import { createStore } from 'redux';
import { storeTimerData, retrievePageUrl } from './popup/api/browser';
import { initializeData } from './popup/actions/settings';
import { onTimerClick, isTimerActive, isTimerLoaded } from './popup/actions/timer';
import reducer from './popup/reducers';

const store = createStore(reducer);

const timerBtn = document.getElementById("timer");
const projectEdit = document.getElementById("project-id");
const mergeRequestEdit = document.getElementById("merge-request-id");

// TODO: Move UI logic to separate file
// {
function getPathFromUrl(url) {
  let pattern = RegExp("://[\.a-zA-Z]*(/.*)\?");
  let matches = url.match(pattern);
  return matches[1];
}

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

function updateIcons(started) {
  if (started) {
    timerBtn.classList.add("started");
    browser.browserAction.setIcon({path: "stop-16.png"});
  }
  else {
    timerBtn.classList.remove("started");
    browser.browserAction.setIcon({path: "start-16.png"});
  }
}

function updateEdits(projectId, mergeRequestId) {
  if (projectId != undefined && mergeRequestId != undefined) {
    projectEdit.value = projectId;
    mergeRequestEdit.value = mergeRequestId;
  }
}

function updateInterface(data) {
  if (!isTimerLoaded(data)) return;

  updateIcons(isTimerActive(data), data.timer);
  updateEdits(data.timer.projectId, data.timer.mergeRequestId);
}

function initializeFromUrl(url) {
  let data = store.getState();
  if (!isTimerLoaded(data) || !isTimerActive(data))
  {
    let path = getPathFromUrl(url);
    updateEdits(getProjectFromPath(path), getMergeRequestIdFromPath(path));
  }
}

function onError(err) {
  console.log('Error:', err);
}

function initializeInterface() {
  retrievePageUrl(initializeFromUrl, onError);
  timerBtn.addEventListener("click", e => onTimerClick(store, projectEdit.value, mergeRequestEdit.value), false);
}
// }

store.subscribe(() => {
  let state = store.getState();
  console.log('state', state);

  if (isTimerLoaded(state.timer)) storeTimerData(state.timer);
  updateInterface(state);
});

initializeInterface();
initializeData(store);

