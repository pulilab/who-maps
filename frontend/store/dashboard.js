import { stateGenerator, gettersGenerator, actionsGenerator, mutationsGenerator } from '../utilities/map';
export const state = () => ({
  ...stateGenerator(),
  columns: [
    {
      id: 1,
      label: 'Project name'
    },
    {
      id: 2,
      label: 'Country'

    },
    {
      id: 3,
      label: 'Organisation Name'
    },
    {
      id: 4,
      label: 'Donors'
    },
    {
      id: 5,
      label: 'Contact Name'
    },
    {
      id: 6,
      label: 'Overview of digital health implementation'
    },
    {
      id: 7,
      label: 'Geographic scope'
    },
    {
      id: 8,
      label: 'Health Focus Areas'
    }
  ],
  selectedColumns: [1, 2, 3, 4, 5, 6, 7, 8],
  projects: [
    { id: 1, country: 1, organisation: 1, donors: ['Donor1', 'donor2'], contact_name: 'Torben', contact_email: 't@pulilab.com', implementation_overview: 'Implementation', geographic_scope: 'Geo Scope', health_focus_areas: [1, 2, 3] },
    { id: 2, country: 2, organisation: 1, donors: ['Donor1', 'donor2'], contact_name: 'Torben', contact_email: 't@pulilab.com', implementation_overview: 'Implementation', geographic_scope: 'Geo Scope', health_focus_areas: [1, 2, 3] },
    { id: 3, country: 3, organisation: 1, donors: ['Donor1', 'donor2'], contact_name: 'Torben', contact_email: 't@pulilab.com', implementation_overview: 'Implementation', geographic_scope: 'Geo Scope', health_focus_areas: [1, 2, 3] },
    { id: 4, country: 4, organisation: 1, donors: ['Donor1', 'donor2'], contact_name: 'Torben', contact_email: 't@pulilab.com', implementation_overview: 'Implementation', geographic_scope: 'Geo Scope', health_focus_areas: [1, 2, 3] },
    { id: 5, country: 5, organisation: 1, donors: ['Donor1', 'donor2'], contact_name: 'Torben', contact_email: 't@pulilab.com', implementation_overview: 'Implementation', geographic_scope: 'Geo Scope', health_focus_areas: [1, 2, 3] },
    { id: 6, country: 6, organisation: 1, donors: ['Donor1', 'donor2'], contact_name: 'Torben', contact_email: 't@pulilab.com', implementation_overview: 'Implementation', geographic_scope: 'Geo Scope', health_focus_areas: [1, 2, 3] }
  ],
  selectedDHI: [],
  selectedHFA: [],
  selectedHSC: [],
  selectedHIS: [],
  selectedPlatforms: [],
  selectedRows: [],
  selectAll: false
});
export const getters = {
  ...gettersGenerator(),
  getAvailableColumns: state => [...state.columns.map(c => ({...c, selected: state.selectedColumns.includes(c.id)}))],
  getSelectedColumns: state => state.selectedColumns,
  getProjects: state => [...state.projects.map(r => ({...r}))],
  getSelectedDHI: state => state.selectedDHI,
  getSelectedHFA: state => state.selectedHFA,
  getSelectedHSC: state => state.selectedHSC,
  getSelectedHIS: state => state.selectedHIS,
  getSelectedPlatforms: state => state.selectedPlatforms,
  getSelectedRows: state => state.selectedRows,
  getSelectAll: state => state.selectAll
};

export const actions = {
  ...actionsGenerator(),
  setSelectedColumns ({commit}, columns) {
    commit('SET_SELECTED_COLUMNS', columns);
  },
  setSelectedDHI ({commit}, columns) {
    commit('SET_SELECTED_DHI', columns);
  },
  setSelectedHFA ({commit}, columns) {
    commit('SET_SELECTED_HFA', columns);
  },
  setSelectedHSC ({commit}, columns) {
    commit('SET_SELECTED_HSC', columns);
  },
  setSelectedHIS ({commit}, columns) {
    commit('SET_SELECTED_HIS', columns);
  },
  setSelectedPlatforms ({commit}, columns) {
    commit('SET_SELECTED_PLATFORMS', columns);
  },
  setSelectedRows ({commit}, rows) {
    commit('SET_SELECTED_ROWS', rows);
    commit('SET_SELECT_ALL', false);
  },
  setSelectAll ({commit}, all) {
    commit('SET_SELECT_ALL', all);
  }
};
export const mutations = {
  ...mutationsGenerator(),
  SET_SELECTED_COLUMNS: (state, columns) => {
    state.selectedColumns = columns;
  },
  SET_SELECTED_DHI: (state, dhi) => {
    state.selectedDHI = dhi;
  },
  SET_SELECTED_HFA: (state, hfa) => {
    state.selectedHFA = hfa;
  },
  SET_SELECTED_HSC: (state, hsc) => {
    state.selectedHSC = hsc;
  },
  SET_SELECTED_HIS: (state, his) => {
    state.selectedHIS = his;
  },
  SET_SELECTED_PLATFORMS: (state, platforms) => {
    state.selectedPlatforms = platforms;
  },
  SET_SELECTED_ROWS: (state, rows) => {
    state.selectedRows = rows;
  },
  SET_SELECT_ALL: (state, all) => {
    state.selectAll = all;
  }
};
