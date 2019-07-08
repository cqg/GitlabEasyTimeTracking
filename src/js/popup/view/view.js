import { isTimerActive } from '../actions/timer';
import { updateTimerCounter } from './timerCounterView';

import imgStart from '../../../img/start-gray-16.png';
import imgStop from '../../../img/stop-red-16.png';

const timerBtn = document.getElementById("timerToggler");

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
  const timerButtonIcon = document.getElementsByClassName("timer-toggler-icon")[0];

  if (started) {
    timerButtonIcon.classList.replace("fa-play-circle", "fa-stop-circle");
    browser.browserAction.setIcon({path: imgStop});
  }
  else {
    timerButtonIcon.classList.replace("fa-stop-circle", "fa-play-circle");
    browser.browserAction.setIcon({path: imgStart});
  }
}

const projectEdit = document.getElementById("projectId");

function getProjectId() {
  return projectEdit.value;
}

function setProjectId(value) {
  projectEdit.value = value;
}

const mergeRequestEdit = document.getElementById("mergeRequestId");

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
