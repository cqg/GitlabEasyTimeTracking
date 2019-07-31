/**
 * @file Actions that are needed to get already spent time from gitlab
 */

import { ON_USER_ID_LOAD, ON_NOTES_LOAD, ON_MR_CHANGED, ON_MR_NAME_LOAD } from '../constants/ActionTypes';
import { requestUserId, requestNotes, requestMergeRequestName } from '../api/gitlab';

export function onNewMergeRequest(selectedProjectId, selectedMergeRequestId) {
  return (dispatch, getState) => {
    if (!selectedProjectId || !selectedMergeRequestId) return Promise.resolve();

    const requestSettings = {
      projectId: selectedProjectId,
      mrId: selectedMergeRequestId
    };

    dispatch({ type: ON_MR_CHANGED, data: requestSettings });

    const onNotesLoad = (result) => {
      dispatch({ type: ON_NOTES_LOAD, data: { notes: result.notes, isFinal: !result.nextRequest, requestSettings } });
      if (result.nextRequest) {
        return result.nextRequest.then(onNotesLoad);
      }
      return Promise.resolve();
    };

    const onNameLoad = (name) => dispatch({ type: ON_MR_NAME_LOAD, data: name });

    const state = getState();
    return Promise.all([
      requestNotes(
        state.settings.hostname, state.settings.token,
        selectedProjectId, selectedMergeRequestId).then(onNotesLoad),
      requestMergeRequestName(
        state.settings.hostname, state.settings.token,
        selectedProjectId, selectedMergeRequestId).then(onNameLoad),
    ]);
  };
}

export function initializeUserId() {
  return (dispatch, getState) => {
    const state = getState();
    return requestUserId(state.settings.hostname, state.settings.token)
      .then((userId) => dispatch({ type: ON_USER_ID_LOAD, data: userId }));
  };
}
