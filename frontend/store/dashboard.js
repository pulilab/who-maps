import { stateGenerator, gettersGenerator, actionsGenerator, mutationsGenerator } from '../utilities/map';
export const state = () => ({
  ...stateGenerator(),
  columns: [
    {
      id: 1,
      label: 'Project name',
      field: 'id',
      thClass: 'CustomTH NameColumn',
      tdClass: 'CustomTD NameColumn'
    },
    {
      id: 2,
      label: 'Country',
      field: 'country',
      thClass: 'ThCCustomTH CountryColumn',
      tdClass: 'CustomTD CountryColumn'

    },
    {
      id: 3,
      label: 'Organisation Name',
      field: 'organisation',
      thClass: 'ThOrganisatiCustomTH OrganisationNameColumn',
      tdClass: 'CustomTD OrganisationNameColumn'
    },
    {
      id: 4,
      label: 'Donors',
      field: 'donors',
      thClass: 'ThCustomTH DonorsColumn',
      tdClass: 'CustomTD DonorsColumn'
    },
    {
      id: 5,
      label: 'Contact Name',
      field: 'contact_name',
      thClass: 'ThContacCustomTH Contact_nameColumn',
      tdClass: 'CustomTD Contact_nameColumn'
    },
    {
      id: 6,
      label: 'Overview of digital health implementation',
      field: 'implementation_overview',
      thClass: 'ThImplementationOvCustomTH ImplementationOverviewColumn',
      tdClass: 'CustomTD ImplementationOverviewColumn'
    },
    {
      id: 7,
      label: 'Geographic scope',
      field: 'geographic_scope',
      thClass: 'ThGeographiCustomTH GeographicScopeColumn',
      tdClass: 'CustomTD GeographicScopeColumn'
    },
    {
      id: 8,
      label: 'Health Focus Areas',
      field: 'health_focus_areas',
      thClass: 'ThHealthFocuCustomTH HealthFocusAreasColumn',
      tdClass: 'CustomTD HealthFocusAreasColumn'
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
  selectedPlatforms: []
});
export const getters = {
  ...gettersGenerator(),
  getAvailableColumns: state => [...state.columns.map(c => ({...c, selected: state.selectedColumns.includes(c.id)}))],
  getSelectedColumns: state => [...state.columns.filter(c => state.selectedColumns.includes(c.id)).map(c => ({...c}))],
  getProjects: state => [...state.projects.map(r => ({...r}))],
  getSelectedDHI: state => state.selectedDHI,
  getSelectedHFA: state => state.selectedHFA,
  getSelectedHSC: state => state.selectedHSC,
  getSelectedHIS: state => state.selectedHIS,
  getSelectedPlatforms: state => state.selectedPlatforms
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
  }
};
