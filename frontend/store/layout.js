export const state = () => ({
  digitalHealthInterventionsDialogState: null,
  dashboardFiltersDialogState: null,
  saveFiltersDialogState: null,
  sendEmailDialogState: null,
  showEmptyProfileWarning: false,
  editSubLevelDialogState: null,
  howToDialogState: false,
  howToDialogGuide: 0, // overview
})

export const getters = {
  getDigitalHealthInterventionsDialogState: state => state.digitalHealthInterventionsDialogState,
  getDashboardFiltersDialogState: state => state.dashboardFiltersDialogState,
  getSaveFiltersDialogState: state => state.saveFiltersDialogState,
  getSendEmailDialogState: state => state.sendEmailDialogState,
  getShowEmptyProfileWarning: state => state.showEmptyProfileWarning,
  getEditSubLevelDialogState: state => state.editSubLevelDialogState,
  getHowToDialogState: state => state.howToDialogState,
  getHowToDialogGuide: state => state.howToDialogGuide
}

export const actions = {
  setDigitalHealthInterventionsDialogState ({ commit }, value) {
    commit('SET_DATA', { type: 'digitalHealthInterventionsDialogState', value })
  },
  setDashboardFiltersDialogState ({ commit }, value) {
    commit('SET_DATA', { type: 'dashboardFiltersDialogState', value })
  },
  setSaveFiltersDialogState ({ commit }, value) {
    commit('SET_DATA', { type: 'saveFiltersDialogState', value })
  },
  setSendEmailDialogState ({ commit }, value) {
    commit('SET_DATA', { type: 'sendEmailDialogState', value })
  },
  setShowEmptyProfileWarning ({ commit }, value) {
    commit('SET_DATA', { type: 'showEmptyProfileWarning', value })
  },
  setEditSubLevelDialogState ({ commit }, value) {
    commit('SET_DATA', { type: 'editSubLevelDialogState', value })
  },
  setHowToDialogState ({ commit }, value) {
    commit('SET_DATA', { type: 'howToDialogState', value })
  },
  setHowToDialogGuide ({ commit }, value) {
    commit('SET_DATA', { type: 'howToDialogGuide', value })
  },
  openHowToDialog({ dispatch }, guide) {
    dispatch('setHowToDialogGuide', guide)
    dispatch('setHowToDialogState', true)
  }
}

export const mutations = {
  SET_DATA: (state, { type, value }) => {
    state[type] = value
  }
}
