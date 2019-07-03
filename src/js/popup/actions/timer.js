import { logWorkTime } from '../api/gitlab';
import * as types from '../constants/ActionTypes';
import { startTimerCounter, stopTimerCounter } from '../view/timerCounterView';

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

function stopTimer(timer, settings) {
  let projectId = timer.projectId;
  let mergeRequestId = timer.mergeRequestId;
  let spentTime = calculateSpentSeconds(timer.startTime);

  logWorkTime(settings.hostname, settings.token, projectId, mergeRequestId, spentTime)
    .then((response) => console.log('response', response))
    .catch((error) => {
      console.log(error);
      alert(`Error: ${error.status}, ${error.statusText}\nPlease enter spent time manually via command: /spend ${spentTime}s`)
    });

  return { type: types.STOP_TIMER, data: { spentTime } };
}

export function isTimerLoaded(data) {
  return data.timer != null;
}

export function isTimerActive(data) {
  return data.timer.startTime > 0;
}

export function onTimerClick(store, selectedProjectId, selectedMergeRequestId) {
  const data = store.getState();
  if (!isTimerLoaded(data)) return;

  if (!isTimerActive(data)) {
    store.dispatch(startTimer(selectedProjectId, selectedMergeRequestId));
    startTimerCounter(store);
  } else {
    store.dispatch(stopTimer(data.timer, data.settings));
    stopTimerCounter();
  }
}

export function calculateSpentSeconds(start) {
  if (start <= 0) return 0;
  let end = new Date();
  let diff = end - new Date(start);
  let seconds = Math.round(diff / 1000);
  return seconds;
}

