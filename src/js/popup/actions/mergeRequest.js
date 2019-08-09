/**
 * @file Actions to do on gitlab merge requests
 */

import {
  ON_USER_ID_LOAD,
  ON_NOTES_LOAD,
  ON_MR_CHANGED,
  ON_MR_NAME_LOAD
} from "../constants/ActionTypes";
import {
  requestUserId,
  requestNotes,
  requestMergeRequestName
} from "../api/gitlab";

function loadName(gitlabSettings, requestSettings) {
  return dispatch => {
    const onNameLoad = name => dispatch({ type: ON_MR_NAME_LOAD, data: name });
    return requestMergeRequestName(
      gitlabSettings.hostname,
      gitlabSettings.token,
      requestSettings.projectId,
      requestSettings.mergeRequestId
    ).then(onNameLoad);
  };
}

function loadNotes(gitlabSettings, requestSettings) {
  return dispatch => {
    const onNotesLoad = result => {
      dispatch({
        type: ON_NOTES_LOAD,
        data: {
          notes: result.notes,
          isFinal: !result.nextRequest,
          requestSettings
        }
      });
      if (result.nextRequest) {
        return result.nextRequest.then(onNotesLoad);
      }
      return Promise.resolve();
    };

    return requestNotes(
      gitlabSettings.hostname,
      gitlabSettings.token,
      requestSettings.projectId,
      requestSettings.mergeRequestId
    ).then(onNotesLoad);
  };
}

export function selectMergeRequest(selectedProjectId, selectedMergeRequestId) {
  return (dispatch, getState) => {
    const requestSettings = {
      projectId: selectedProjectId,
      mergeRequestId: selectedMergeRequestId
    };

    dispatch({ type: ON_MR_CHANGED, data: requestSettings });

    if (!selectedProjectId || !selectedMergeRequestId) return Promise.resolve();

    const settings = getState().settings;
    return Promise.all([
      dispatch(loadName(settings, requestSettings)),
      dispatch(loadNotes(settings, requestSettings))
    ]);
  };
}

export function initializeUserId() {
  return (dispatch, getState) => {
    const state = getState();
    return requestUserId(state.settings.hostname, state.settings.token).then(
      userId => dispatch({ type: ON_USER_ID_LOAD, data: userId })
    );
  };
}
