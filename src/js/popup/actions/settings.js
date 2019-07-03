import { retrieveSettings, retrieveTimerData } from '../api/browser';
import { ON_SETTINGS_LOAD, ON_TIMER_DATA_LOAD } from '../constants/ActionTypes';

function onError(err) { 
  console.log('Error:', err);
}

export function initializeData(store) {
  retrieveTimerData().then((data) => store.dispatch({ type: ON_TIMER_DATA_LOAD, data }), onError);
  retrieveSettings().then((data) => store.dispatch({ type: ON_SETTINGS_LOAD, data }), onError);
}

