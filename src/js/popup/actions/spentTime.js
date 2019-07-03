import { ON_USER_ID_LOAD, ON_NOTES_LOAD, ON_NOTES_PENDING } from '../constants/ActionTypes';
import { requestUserId, requestNotes } from '../api/gitlab';

export function onNewMergeRequest(selectedProjectId, selectedMergeRequestId) {
  return (dispatch, getState) => {
    if (!selectedProjectId || !selectedMergeRequestId) return Promise.resolve();

    const requestSettings = {
      projectId: selectedProjectId,
      mergeRequestId: selectedMergeRequestId
    };

    dispatch({ type: ON_NOTES_PENDING, data: requestSettings });
    const state = getState();
    return requestNotes(state.settings.hostname, state.settings.token, selectedProjectId, selectedMergeRequestId)
      .then((notes) => dispatch({ type: ON_NOTES_LOAD, data: { notes, requestSettings } }));
  }
}

export function initializeUserId() {
  return (dispatch, getState) => {
    const state = getState();
    return requestUserId(state.settings.hostname, state.settings.token)
      .then((userId) => dispatch({ type: ON_USER_ID_LOAD, data: userId }));
  };
}

