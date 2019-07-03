import { retrieveSettings, retrieveTimerData } from '../api/browser';
import { ON_SETTINGS_LOAD, ON_TIMER_DATA_LOAD } from '../constants/ActionTypes';

export function initializeTimerData() {
  return (dispatch) => {
    return retrieveTimerData().then((data) => dispatch({ type: ON_TIMER_DATA_LOAD, data }));
  };
}

export function initializeSettingsData() {
  return (dispatch) => {
    return retrieveSettings().then((data) => dispatch({ type: ON_SETTINGS_LOAD, data }));
  };
}

