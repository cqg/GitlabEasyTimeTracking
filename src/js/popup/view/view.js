import { isTimerActive } from '../actions/timer';

import imgStart from '../../../img/start-gray-16.png';
import imgStop from '../../../img/stop-red-16.png';

const timerBtn = document.getElementById("timer");

function updateView(data) {
  updateButtonView(isTimerActive(data));
  updateInputsView(data.timer.projectId, data.timer.mergeRequestId);
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

function getProjectId() {
  return document.getElementById("project-id").value;
}

function setProjectId(value) {
  document.getElementById("project-id").value = value;
}

function getMergeRequestId() {
  return document.getElementById("merge-request-id").value;
}

function setMergeRequestId(value) {
  document.getElementById("merge-request-id").value = value;
}

// TODO: don't export timerBtn.
export {updateView, updateInputsView, getProjectId, getMergeRequestId, addOnTimerClickEventHandler, timerBtn}
