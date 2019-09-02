/**
 * @file Reducer to store current error
 */

import { ON_ERROR } from "../constants/ActionTypes";

const initialState = {
  text: ""
};

export function error(state = initialState, action) {
  switch (action.type) {
    case ON_ERROR:
      return { text: action.data };
  }
  return state;
}
