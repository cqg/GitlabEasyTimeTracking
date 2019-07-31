/**
 * @file Reducer to store timer state
 */

import { START_TIMER, STOP_TIMER, CANCEL_TIMER, ON_TIMER_DATA_LOAD } from '../constants/ActionTypes';

const idleState = { startTime: 0 };

function onDataLoad(data) {
  if (data && data.startTime && data.startTime > 0) {
    return data;
  }
  return idleState;
}

export function timer(state = null, action) {
  switch (action.type) {
    case START_TIMER:
      return action.data;
    case STOP_TIMER:
      return idleState;
    case CANCEL_TIMER:
      return idleState;
    case ON_TIMER_DATA_LOAD:
      return onDataLoad(action.data);
    default:
      return state;
  }
}

