export const state = () => ({
  digitalHealthInterventionsDialogState: null,
  dashboardFiltersDialogState: null,
  saveFiltersDialogState: null
});

export const getters = {
  getDigitalHealthInterventionsDialogState: state => state.digitalHealthInterventionsDialogState,
  getDashboardFiltersDialogState: state => state.dashboardFiltersDialogState,
  getSaveFiltersDialogState: state => state.saveFiltersDialogState
};

export const actions = {
  setDigitalHealthInterventionsDialogState ({commit}, value) {
    commit('SET_DIGITAL_HEALTH_INTERVENTIONS_DIALOG_STATE', value);
  },
  setDashboardFiltersDialogState ({commit}, value) {
    commit('SET_DASHBOARD_FILTERS_DIALOG_STATE', value);
  },
  setSaveFiltersDialogState ({commit}, value) {
    commit('SET_SAVE_FILTERS_DIALOG_STATE', value);
  }
};

export const mutations = {
  SET_DIGITAL_HEALTH_INTERVENTIONS_DIALOG_STATE: (state, value) => {
    state.digitalHealthInterventionsDialogState = value;
  },
  SET_DASHBOARD_FILTERS_DIALOG_STATE: (state, value) => {
    state.dashboardFiltersDialogState = value;
  },
  SET_SAVE_FILTERS_DIALOG_STATE: (state, value) => {
    state.saveFiltersDialogState = value;
  }
};
