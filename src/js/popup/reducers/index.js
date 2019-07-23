import { combineReducers } from 'redux';
import { timer } from './timer';
import { settings } from './settings';
import { spentTime } from './spentTime';
import { mrInfo } from './mrInfo';

export default combineReducers({
  timer,
  settings,
  spentTime,
  mrInfo,
});

