import * as sharedStoreModule from './CDshared.js';

export const state = () => ({
  type: 'donor',
  data: {},
  editableData: {},
  userSelection: [],
  adminSelection: [],
  superadminSelection: []
});

export const getters = {
  ...sharedStoreModule.getters
};

export const actions = {
  ...sharedStoreModule.actions
};

export const mutations = {
  ...sharedStoreModule.mutations
};
