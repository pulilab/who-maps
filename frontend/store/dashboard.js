import { stateGenerator, gettersGenerator, actionsGenerator, mutationsGenerator, searchIn } from '../utilities/map';
import { intArrayFromQs } from '../utilities/api';

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
  projectsList: [],
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
  previousPage: 0,
  sorting: null,
  savedFilters: [],
  dashboardType: 'user'
});
export const getters = {
  ...gettersGenerator(),
  getProjectsList: state => [...state.projectsList.map(r => ({...r}))],
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
  getSorting: state => state.sorting,
  getSavedFilters: state => state.savedFilters,
  getDashboardType: state => state.dashboardType,
  getSearchParameters: state => {
    const q = state.searchString && state.searchString.length > 1 ? state.searchString : undefined;
    return {
      page_size: state.pageSize,
      page: state.page,
      ordering: state.sorting,
      q,
      in: q ? state.searchIn : undefined,
      country: state.filteredCountries,
      region: state.filteredRegion,
      gov: state.governmentFinanced ? [1, 2] : undefined,
      approved: state.governmentApproved ? 1 : undefined,
      sw: state.selectedPlatforms,
      dhi: state.selectedDHI,
      hfa: state.selectedHFA,
      hsc: state.selectedHSC,
      his: state.selectedHIS
    };
  }
};

export const actions = {
  ...actionsGenerator(),
  async loadProjectList ({commit, dispatch}) {
    const data = await dispatch('loadProjects', {type: 'list'});
    commit('SET_PROJECT_LIST', data.results.projects);
    commit('SET_SEARCH_STATUS', data);
  },
  async loadProjectsMap ({commit, dispatch}) {
    const data = await dispatch('loadProjects', {type: 'map', page_size: 10000});
    commit('SET_PROJECT_MAP', data.results.projects);
    commit('SET_SEARCH_STATUS', data);
  },
  setSearchOptions ({commit}, options) {
    commit('SET_SEARCH_OPTIONS', options);
  },
  setSelectedColumns ({commit}, columns) {
    commit('SET_SELECTED_COLUMNS', columns);
  },
  setSearchString ({commit}, value) {
    commit('SET_SEARCH_STRING', value);
    commit('SET_CURRENT_PAGE', 1);
  },
  setSearchIn ({commit}, value) {
    commit('SET_SEARCH_IN', value);
    commit('SET_CURRENT_PAGE', 1);
  },
  setSelectedDHI ({commit}, columns) {
    commit('SET_SELECTED_DHI', columns);
    commit('SET_CURRENT_PAGE', 1);
  },
  setSelectedHFA ({commit}, columns) {
    commit('SET_SELECTED_HFA', columns);
    commit('SET_CURRENT_PAGE', 1);
  },
  setSelectedHSC ({commit}, columns) {
    commit('SET_SELECTED_HSC', columns);
    commit('SET_CURRENT_PAGE', 1);
  },
  setSelectedHIS ({commit}, columns) {
    commit('SET_SELECTED_HIS', columns);
    commit('SET_CURRENT_PAGE', 1);
  },
  setSelectedPlatforms ({commit}, columns) {
    commit('SET_SELECTED_PLATFORMS', columns);
    commit('SET_CURRENT_PAGE', 1);
  },
  setSelectedRows ({commit, state}, rows) {
    if (state.selectAll && state.selectedRows.length > rows.length) {
      commit('SET_SELECT_ALL', false);
    }
    commit('SET_SELECTED_ROWS', rows);
  },
  setFilteredCountries ({commit}, value) {
    commit('SET_FILTERED_COUNTRIES', value);
    commit('SET_CURRENT_PAGE', 1);
  },
  setFilteredRegion ({commit}, value) {
    commit('SET_FILTERED_REGION', value);
    commit('SET_CURRENT_PAGE', 1);
  },
  setGovernmentApproved ({commit}, value) {
    commit('SET_GOVERNMENT_APPROVED', value);
    commit('SET_CURRENT_PAGE', 1);
  },
  setGovernmentFinanced ({commit}, value) {
    commit('SET_GOVERNMENT_FINANCED', value);
    commit('SET_CURRENT_PAGE', 1);
  },
  setSelectAll ({commit}, all) {
    commit('SET_SELECT_ALL', all);
  },
  setPageSize ({commit}, size) {
    commit('SET_PAGE_SIZE', size);
  },
  setCurrentPage ({commit}, page) {
    commit('SET_CURRENT_PAGE', page);
  },
  setSorting ({commit}, value) {
    commit('SET_SORTING', value);
    commit('SET_CURRENT_PAGE', 1);
  },
  setSavedFilters ({commit}, filters) {
    commit('SET_SAVED_FILTERS', filters);
  }
};
export const mutations = {
  ...mutationsGenerator(),
  SET_PROJECT_LIST: (state, projects) => {
    state.projectsList = projects;
  },
  SET_SEARCH_OPTIONS: (state, options) => {
    state.pageSize = options.page_size ? +options.page_size : 10;
    state.page = options.page ? +options.page : 1;
    state.sorting = options.ordering ? options.ordering : null;
    state.searchString = options.q ? options.q : '';
    state.searchIn = options.in ? options.in : searchIn();
    state.filteredCountries = intArrayFromQs(options.country);
    state.filteredRegion = options.region ? +options.region : null;
    state.governmentFinanced = options.gov ? true : null;
    state.governmentApproved = options.approved ? true : null;
    state.selectedPlatforms = intArrayFromQs(options.sw);
    state.selectedDHI = intArrayFromQs(options.dhi);
    state.selectedHFA = intArrayFromQs(options.hfa);
    state.selectedHSC = intArrayFromQs(options.hsc);
    state.selectedHIS = intArrayFromQs(options.his);
  },
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
  SET_SORTING: (state, value) => {
    state.sorting = value;
  },
  SET_SEARCH_STATUS: (state, status) => {
    state.total = status.count;
    state.nextPage = status.next;
    state.previousPage = status.previous;
  },
  SET_SAVED_FILTERS: (state, filters) => {
    state.savedFilters = filters;
  }
};
