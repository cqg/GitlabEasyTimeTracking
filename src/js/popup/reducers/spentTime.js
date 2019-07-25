import { ON_USER_ID_LOAD, ON_NOTES_LOAD, ON_MR_CHANGED, STOP_TIMER } from '../constants/ActionTypes';
import { calculateSpentTime } from '../services/gitlabParser';

const initialState = {
  userId: -1,
  time: 0
};

function addSpentTimeIfPossible(state) {
  if (!state.notes || state.userId == -1) return state;

  const time = calculateSpentTime(state.notes, state.userId) + state.time;

  if (state.isComplete) {
    return {
      userId: state.userId,
      time
    };
  }
  return {
    userId: state.userId,
    notes: [],
    time,
    pendingRequest: state.pendingRequest,
  };
}

export function spentTime(state = initialState, action) {
  switch (action.type) {
    case ON_USER_ID_LOAD:
      return addSpentTimeIfPossible({ ...state, userId: action.data });
    case ON_NOTES_LOAD:
      if (action.data.requestSettings == state.pendingRequest) {
        return addSpentTimeIfPossible({
          ...state,
          notes: [ ...state.notes, ...action.data.notes ],
          isComplete: action.data.isFinal,
        });
      }
      return state;
    case ON_MR_CHANGED:
      return { ...state, notes: [], time: 0, pendingRequest: action.data };
    case STOP_TIMER:
      return {...state, time: state.time + action.data.spentTime };
  }
  return state;
}
