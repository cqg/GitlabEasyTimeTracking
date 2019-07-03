import { isTimerActive } from '../actions/timer';
import { updateTimerCounter } from './timerCounterView';

import imgStart from '../../../img/start-gray-16.png';
import imgStop from '../../../img/stop-red-16.png';

const timerBtn = document.getElementById("timer");

function updateView(data) {
  updateButtonView(isTimerActive(data));
  updateInputsView(data.timer.projectId, data.timer.mergeRequestId);
  updateTimerCounter(data);
}

function updateInputsView(projectId, mergeRequestId) {
  if (projectId == undefined || mergeRequestId == undefined) {
    return;
  }
  setProjectId(projectId);
  setMergeRequestId(mergeRequestId);
}

function updateButtonView(started) {
  const timerBtn = document.getElementById("timer");

  if (started) {
    timerBtn.classList.add("started");
    browser.browserAction.setIcon({path: imgStop});
  }
  else {
    timerBtn.classList.remove("started");
    browser.browserAction.setIcon({path: imgStart});
  }
}

const projectEdit = document.getElementById("project-id");

function getProjectId() {
  return projectEdit.value;
}

function setProjectId(value) {
  projectEdit.value = value;
}

const mergeRequestEdit = document.getElementById("merge-request-id");

function getMergeRequestId() {
  return mergeRequestEdit.value;
}

function setMergeRequestId(value) {
  mergeRequestEdit.value = value;
}

function addMergeRequestChangeListener(listener) {
  mergeRequestEdit.addEventListener('change', listener);
}

// TODO: don't export timerBtn.
export {updateView, updateInputsView, getProjectId, getMergeRequestId, addOnTimerClickEventHandler, timerBtn, addMergeRequestChangeListener};
