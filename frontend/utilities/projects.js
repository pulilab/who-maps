export const fetchProjectData = async (store, params, error) => {
  try {
    await store.dispatch('projects/setCurrentProject', params.id);
    await Promise.all([
      store.dispatch('project/loadProject', params.id),
      store.dispatch('projects/loadProjectStructure')
    ]);
  } catch (e) {
    console.warn('loadProjectData failed', e);
    error({
      response: {
        status: 404,
        statusText: 'This project does not exist'
      }
    });
    return Promise.reject(e);
  }
};

export const projectFields = () => ({
  name: null,
  organisation: null,
  country: null,
  geographic_scope: null,
  implementation_overview: null,
  start_date: null,
  end_date: null,
  contact_name: null,
  contact_email: null,
  team: [],
  viewers: [],
  platforms: [],
  digitalHealthInterventions: [],
  health_focus_areas: [],
  hsc_challenges: [],
  his_bucket: [],
  coverageType: 1,
  coverage: [],
  coverageData: {},
  coverage_second_level: [],
  national_level_deployment: {
    health_workers: 0,
    clients: 0,
    facilities: 0
  },
  government_investor: null,
  implementing_partners: [],
  donors: [],
  implementation_dates: null,
  licenses: [],
  repository: null,
  mobile_application: null,
  wiki: null,
  interoperability_links: {},
  interoperability_standards: []
});
