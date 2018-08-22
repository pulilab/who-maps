export const state = () => ({
  columns: [
    {
      id: 1,
      label: 'Project name',
      field: 'name',
      thClass: 'ThName',
      tdClass: 'TdName'
    },
    {
      id: 2,
      label: 'Country',
      field: 'country',
      thClass: 'ThCountry',
      tdClass: 'TdCountry'
    },
    {
      id: 3,
      label: 'Organisation Name',
      field: 'organisation_name',
      thClass: 'ThOrganisationName',
      tdClass: 'TdOrganisationName'
    },
    {
      id: 4,
      label: 'Donors',
      field: 'donors',
      thClass: 'ThDonors',
      tdClass: 'TdDonors'
    },
    {
      id: 5,
      label: 'Contact Name',
      field: 'contact_name',
      thClass: 'ThContact_name',
      tdClass: 'TdContact_name'
    },
    {
      id: 6,
      label: 'Overview of digital health implementation',
      field: 'implementation_overview',
      thClass: 'ThImplementationOverview',
      tdClass: 'TdImplementationOverview'
    },
    {
      id: 7,
      label: 'Geographic scope',
      field: 'geographic_scope',
      thClass: 'ThGeographicScope',
      tdClass: 'TdGeographicScope'
    },
    {
      id: 8,
      label: 'Health Focus Areas',
      field: 'health_focus_areas',
      thClass: 'ThHealthFocusAreas',
      tdClass: 'TdHealthFocusAreas'
    }
  ],
  selectedColumns: [1, 2, 3],
  rows: [
    { id: 1, name: 'John', country: 'Sierra Leone', organisation_name: 'Pulilab', donors: ['Donor1, donor2'], contact_name: 'Torben', implementation_overview: 'Implementation', geographic_scope: 'Geo Scope', health_focus_areas: [1, 2, 3] },
    { id: 2, name: 'Jane', country: 'Sierra Leone', organisation_name: 'Pulilab', donors: ['Donor1, donor2'], contact_name: 'Torben', implementation_overview: 'Implementation', geographic_scope: 'Geo Scope', health_focus_areas: [1, 2, 3] },
    { id: 3, name: 'Susan', country: 'Sierra Leone', organisation_name: 'Pulilab', donors: ['Donor1, donor2'], contact_name: 'Torben', implementation_overview: 'Implementation', geographic_scope: 'Geo Scope', health_focus_areas: [1, 2, 3] },
    { id: 4, name: 'Chris', country: 'Sierra Leone', organisation_name: 'Pulilab', donors: ['Donor1, donor2'], contact_name: 'Torben', implementation_overview: 'Implementation', geographic_scope: 'Geo Scope', health_focus_areas: [1, 2, 3] },
    { id: 5, name: 'Dan', country: 'Sierra Leone', organisation_name: 'Pulilab', donors: ['Donor1, donor2'], contact_name: 'Torben', implementation_overview: 'Implementation', geographic_scope: 'Geo Scope', health_focus_areas: [1, 2, 3] },
    { id: 6, name: 'John', country: 'Sierra Leone', organisation_name: 'Pulilab', donors: ['Donor1, donor2'], contact_name: 'Torben', implementation_overview: 'Implementation', geographic_scope: 'Geo Scope', health_focus_areas: [1, 2, 3] }
  ]
});
export const getters = {
  getAvailableColumns: state => [...state.columns.map(c => ({...c, selected: state.selectedColumns.includes(c.id)}))],
  getSelectedColumns: state => [...state.columns.filter(c => state.selectedColumns.includes(c.id)).map(c => ({...c}))],
  getRows: state => [...state.rows.map(r => ({...r}))]
};
export const actions = {
  setSelectedColumns ({commit}, columns) {
    commit('SET_SELECTED_COLUMNS', columns);
  }
};
export const mutations = {
  SET_SELECTED_COLUMNS: (state, columns) => {
    state.selectedColumns = columns;
  }
};
