/**
 * @file Combines all reducers to get one to use in redux
 */

import { combineReducers } from "redux";
import { timer } from "./timer";
import { settings } from "./settings";
import { spentTime } from "./spentTime";
import { mrInfo } from "./mrInfo";
import { error } from "./error";

export default combineReducers({
  timer,
  settings,
  spentTime,
  mrInfo,
  error
});
