/**
 * @file Reducer to store current MR data (ids and the name)
 */

import { ON_MR_CHANGED, ON_MR_NAME_LOAD } from '../constants/ActionTypes';

const initialState = {
  projectId: '',
  mrId: '',
  name: ''
};

export function mrInfo(state = initialState, action) {
  switch (action.type) {
    case ON_MR_CHANGED:
      return { ...action.data, name: '' };
    case ON_MR_NAME_LOAD:
      return { ...state, name: action.data };
  }
  return state;
}
