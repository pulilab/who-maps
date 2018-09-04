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
      label: 'Government Investor'
    },
    {
      id: 5,
      label: 'Region'
    },

    {
      id: 6,
      label: 'Donors'
    },
    {
      id: 7,
      label: 'Contact Name'
    },
    {
      id: 8,
      label: 'Overview of digital health implementation'
    },
    {
      id: 9,
      label: 'Geographic scope'
    },
    {
      id: 10,
      label: 'Health Focus Areas'
    }
  ],
  selectedColumns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  projects: [],
  selectedDHI: [],
  selectedHFA: [],
  selectedHSC: [],
  selectedHIS: [],
  selectedPlatforms: [],
  selectedRows: [],
  filteredCountries: [],
  filteredRegion: null,
  governmentApproved: null,
  governmentFinanced: null,
  selectAll: false,
  pageSize: 10,
  page: 1,
  total: 0,
  nextPage: 0,
  previousPage: 0
});
export const getters = {
  ...gettersGenerator(),
  getAvailableColumns: state => [...state.columns.map(c => ({...c, selected: state.selectedColumns.includes(c.id)}))],
  getSelectedColumns: state => state.selectedColumns,
  getSelectedDHI: state => state.selectedDHI,
  getSelectedHFA: state => state.selectedHFA,
  getSelectedHSC: state => state.selectedHSC,
  getSelectedHIS: state => state.selectedHIS,
  getSelectedPlatforms: state => state.selectedPlatforms,
  getSelectedRows: state => state.selectedRows,
  getFilteredCountries: state => state.filteredCountries,
  getFilteredRegion: state => state.filteredRegion,
  getGovernmentApproved: state => state.governmentApproved,
  getGovernmentFinanced: state => state.governmentFinanced,
  getSelectAll: state => state.selectAll,
  getPageSize: state => state.pageSize,
  getTotal: state => state.total,
  getNextPage: state => state.nextPage,
  getPreviousPage: state => state.previousPage,
  getCurrentPage: state => state.page,
  getSearchParameters: state => {
    const q = state.searchString && state.searchString.length > 1 ? state.searchString : undefined;
    return {
      page_size: state.pageSize,
      page: state.page,
      q,
      in: q ? state.searchIn : undefined,
      country: state.filteredCountries,
      region: state.filteredRegion,
      gov: state.governmentFinanced ? [1, 2] : 0,
      approved: state.governmentApproved ? 1 : undefined,
      sw: state.selectedPlatforms,
      dhi: state.selectedDHI,
      hfa: state.selectedHFA,
      hsc: state.selectedHSC,
      his: state.selectedHIS,
      type: 'list'
    };
  }
};

export const actions = {
  ...actionsGenerator(),
  async loadProjectList ({commit, dispatch}) {
    const data = await dispatch('loadProjects');
    commit('SET_SEARCH_STATUS', data);
  },
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
  setFilteredCountries ({commit}, value) {
    commit('SET_FILTERED_COUNTRIES', value);
  },
  setFilteredRegion ({commit}, value) {
    commit('SET_FILTERED_REGION', value);
  },
  setGovernmentApproved ({commit}, value) {
    commit('SET_GOVERNMENT_APPROVED', value);
  },
  setGovernmentFinanced ({commit}, value) {
    commit('SET_GOVERNMENT_FINANCED', value);
  },
  setSelectAll ({commit}, all) {
    commit('SET_SELECT_ALL', all);
  },
  setPageSize ({commit}, size) {
    commit('SET_PAGE_SIZE', size);
  },
  setCurrentPage ({commit}, page) {
    commit('SET_CURRENT_PAGE', page);
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
  SET_FILTERED_COUNTRIES: (state, value) => {
    state.filteredCountries = value;
  },
  SET_FILTERED_REGION: (state, value) => {
    state.filteredRegion = value;
  },
  SET_GOVERNMENT_APPROVED: (state, value) => {
    state.governmentApproved = value;
  },
  SET_GOVERNMENT_FINANCED: (state, value) => {
    state.governmentFinanced = value;
  },
  SET_SELECT_ALL: (state, all) => {
    state.selectAll = all;
  },
  SET_PAGE_SIZE: (state, size) => {
    state.pageSize = size;
  },
  SET_CURRENT_PAGE: (state, page) => {
    state.page = page;
  },
  SET_SEARCH_STATUS: (state, status) => {
    state.total = status.count;
    state.nextPage = status.next;
    state.previousPage = status.previous;
  }
};
