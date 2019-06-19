import { START_TIMER, STOP_TIMER, ON_TIMER_DATA_LOAD } from '../constants/ActionTypes';

const idleState = { startTime: 0 };

function onStart(data) {
  return data;
}

function onStop() {
  return idleState;
}

function onDataLoad(data) {
  if (data != null && data.startTime != undefined && data.startTime > 0) {
    return data;
  }
  return idleState;
}

export function timer(state = null, action) {
  switch (action.type) {
    case START_TIMER:
      return onStart(action.data);
    case STOP_TIMER:
      return onStop();
    case ON_TIMER_DATA_LOAD:
      return onDataLoad(action.data);
    default:
      return state;
  }
}

