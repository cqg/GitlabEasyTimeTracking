import { ON_SETTINGS_LOAD } from '../constants/ActionTypes';

export function settings(state = null, action) {
  switch (action.type) {
    case ON_SETTINGS_LOAD:
      return action.data;
    default:
      return state;
  }
}

