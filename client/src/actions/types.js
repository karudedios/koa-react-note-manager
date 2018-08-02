const actionTypes = [
  'SET_EDIT_MODE',

  'FETCH_NOTES_START',
  'FETCH_NOTES_SUCCESS',
  'FETCH_NOTES_FAILURE',

  'UPDATE_NOTE_START',
  'UPDATE_NOTE_SUCCESS',
  'UPDATE_NOTE_FAILURE',

  'DELETE_NOTE_START',
  'DELETE_NOTE_SUCCESS',
  'DELETE_NOTE_FAILURE',
].reduce((obj, actionType) => ({
  ...obj,
  [actionType]: actionType
}), {});

export default actionTypes;
