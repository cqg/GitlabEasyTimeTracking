import { logWorkTime } from '../api/gitlab';
import * as types from '../constants/ActionTypes';

function startTimer(projectId, mergeRequestId) {
  let startTime = (new Date()).getTime();

  return {
    type: types.START_TIMER,
    data: {
      startTime,
      projectId,
      mergeRequestId
    }
  };
}

function calculateSpentSeconds(start) {
  let end = new Date();
  let diff = end - new Date(start);
  let seconds = Math.round(diff / 1000);
  return seconds;
}

function stopTimer(timer, settings) {
  let projectId = timer.projectId;
  let mergeRequestId = timer.mergeRequestId;
  let spentTime = calculateSpentSeconds(timer.startTime);

  logWorkTime(settings.hostname, settings.token, projectId, mergeRequestId, spentTime);
  return { type: types.STOP_TIMER };
}

export function isTimerLoaded(data) {
  return data.timer != null;
}

export function isTimerActive(data) {
  return data.timer.startTime > 0;
}

export function onTimerClick(store, selectedProjectId, selectedMergeRequestId) {
  let data = store.getState();
  if (!isTimerLoaded(data)) return;

  if (!isTimerActive(data)) {
    store.dispatch(startTimer(selectedProjectId, selectedMergeRequestId));
  } else {
    store.dispatch(stopTimer(data.timer, data.settings));
  }
}

