import { ON_USER_ID_LOAD, ON_NOTES_LOAD, ON_NOTES_PENDING, STOP_TIMER } from '../constants/ActionTypes';
import { calculateSpentTime } from '../services/gitlabParser';

const initialState = {
  userId: -1,
  time: 0
};

function addSpentTimeIfPossible(state) {
  if (!state.notes || state.userId == -1) return state;

  return {
    userId: state.userId,
    time: calculateSpentTime(state.notes, state.userId)
  };
}

export function spentTime(state = initialState, action) {
  switch (action.type) {
    case ON_USER_ID_LOAD:
      return addSpentTimeIfPossible({ ...state, userId: action.data });
    case ON_NOTES_LOAD:
      if (action.data.requestSettings == state.pendingRequest) {
        return addSpentTimeIfPossible({ ...state, notes: action.data.notes });
      }
      return state;
    case ON_NOTES_PENDING:
      return { ...state, time: 0, pendingRequest: action.data };
    case STOP_TIMER:
      return {...state, time: state.time + action.data.spentTime };
  }
  return state;
}

