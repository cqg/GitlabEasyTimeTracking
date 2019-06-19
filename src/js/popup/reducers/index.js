import { combineReducers } from 'redux';
import { timer } from './timer';
import { settings } from './settings';

export default combineReducers({
  timer,
  settings
})

