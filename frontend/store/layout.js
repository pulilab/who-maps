export const state = () => ({
  digitalHealthInterventionsDialogState: null
});

export const getters = {
  getDigitalHealthInterventionsDialogState: state => state.digitalHealthInterventionsDialogState
};

export const actions = {
  setDigitalHealthInterventionsDialogState ({commit}, value) {
    commit('SET_DIGITAL_HEALTH_INTERVENTIONS_DIALOG_STATE', value);
  }
};

export const mutations = {
  SET_DIGITAL_HEALTH_INTERVENTIONS_DIALOG_STATE: (state, value) => {
    state.digitalHealthInterventionsDialogState = value;
  }
};
