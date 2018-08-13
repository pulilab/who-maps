const cleanState = () => ({
  name: null,
  organisation: null,
  country: 58,
  geographic_scope: null,
  implementation_overview: null,
  start_date: null,
  end_date: null,
  contact_name: null,
  contact_email: null,
  team: [],
  viewers: [],
  platforms: [null],
  digitalHealthInterventions: [],
  health_focus_areas: [],
  hsc_challenges: [],
  his_bucket: [],
  coverageType: 1,
  coverage: [null],
  coverageData: {},
  coverage_second_level: [null],
  national_level_deployment: {
    health_workers: 0,
    clients: 0,
    facilities: 0
  },
  government_investor: null,
  implementing_partners: [null],
  implementation_dates: null,
  licenses: [],
  repository: null,
  mobile_application: null,
  wiki: null,
  interoperability_links: {},
  interoperability_standards: []
});

export const state = () => ({
  ...cleanState()
});

export const getters = {
  getProjectData: state => ({...state}),
  getName: state => state.name,
  getOrganisation: state => state.organisation,
  getCountry: state => state.country,
  getGeographicScope: state => state.geographic_scope,
  getImplementationOverview: state => state.implementation_overview,
  getStartDate: state => state.start_date,
  getEndDate: state => state.end_date,
  getContactName: state => state.contact_name,
  getContactEmail: state => state.contact_email,
  getTeam: state => state.team,
  getViewers: state => state.viewers,
  getPlatforms: state => state.platforms,
  getDigitalHealthInterventions: state => [...state.digitalHealthInterventions],
  getHealthFocusAreas: state => state.health_focus_areas,
  getHscChallenges: state => state.hsc_challenges,
  getHisBucket: state => state.his_bucket,
  getCoverageType: state => state.coverageType,
  getCoverage: state => state.coverage,
  getCoverageData: state => state.coverageData,
  getCoverageSecondLevel: state => state.coverage_second_level,
  getNationalLevelDeployment: state => state.national_level_deployment,
  getGovernmentInvestor: state => state.government_investor,
  getImplementingPartners: state => state.implementing_partners,
  getImplementationDates: state => state.implementation_dates,
  getLicenses: state => state.licenses,
  getRepository: state => state.repository,
  getMobileApplication: state => state.mobile_application,
  getWiki: state => state.wiki,
  getInteroperabilityLinks: state => state.interoperability_links,
  getInteroperabilityStandards: state => state.interoperability_standards
};

export const actions = {
  async loadTeamViewers ({commit}, projectId) {
    const { data } = await this.$axios.get(`/api/projects/${projectId}/groups/`);
    console.log(data);
    // commit('SET_TEAM', value);
    // commit('SET_VIEWERS', value);
  },
  resetProjectState ({commit}) {
    commit('SET_PROJECT_STATE', cleanState());
  },
  setName ({commit}, value) {
    commit('SET_NAME', value);
  },
  setOrganisation ({commit}, value) {
    commit('SET_ORGANISATION', value);
  },
  setCountry ({commit}, value) {
    commit('SET_COUNTRY', value);
  },
  setGeographicScope ({commit}, value) {
    commit('SET_GEOGRAPHIC_SCOPE', value);
  },
  setImplementationOverview ({commit}, value) {
    commit('SET_IMPLEMENTATION_OVERVIEW', value);
  },
  setStartDate ({commit}, value) {
    commit('SET_START_DATE', value);
  },
  setEndDate ({commit}, value) {
    commit('SET_END_DATE', value);
  },
  setContactName ({commit}, value) {
    commit('SET_CONTACT_NAME', value);
  },
  setContactEmail ({commit}, value) {
    commit('SET_CONTACT_EMAIL', value);
  },
  setTeam ({commit}, value) {
    commit('SET_TEAM', value);
  },
  setViewers ({commit}, value) {
    commit('SET_VIEWERS', value);
  },
  setPlatforms ({commit}, value) {
    commit('SET_PLATFORMS', value);
  },
  setDigitalHealthInterventions ({commit}, value) {
    commit('SET_DIGITAL_HEALTH_INTERVENTIONS', value);
  },
  setHealthFocusAreas ({commit}, value) {
    commit('SET_HEALTH_FOCUS_AREAS', value);
  },
  setHscChallenges ({commit}, value) {
    commit('SET_HSC_CHALLENGES', value);
  },
  setHisBucket ({commit}, value) {
    commit('SET_HIS_BUCKET', value);
  },
  setCoverageType ({commit}, value) {
    commit('SET_COVERAGE_TYPE', value);
  },
  setCoverage ({commit}, value) {
    commit('SET_COVERAGE', value);
  },
  setCoverageData ({commit}, value) {
    if (value.coverage) {
      commit('SET_COVERAGE_DATA', value);
    } else {
      commit('DELETE_COVERAGE_DATA', value.subLevel);
    }
  },
  setCoverageSecondLevel ({commit}, value) {
    commit('SET_COVERAGE_SECOND_LEVEL', value);
  },
  setNationalLevelDeployment ({commit}, value) {
    commit('SET_NATIONAL_LEVEL_DEPLOYMENT', value);
  },
  setGovernmentInvestor ({commit}, value) {
    commit('SET_GOVERNMENT_INVESTOR', value);
  },
  setImplementingPartners ({commit}, value) {
    commit('SET_IMPLEMENTING_PARTNERS', value);
  },
  setImplementationDates ({commit}, value) {
    commit('SET_IMPLEMENTATION_DATES', value);
  },
  setLicenses ({commit}, value) {
    commit('SET_LICENSES', value);
  },
  setRepository ({commit}, value) {
    commit('SET_REPOSITORY', value);
  },
  setMobileApplication ({commit}, value) {
    commit('SET_MOBILE_APPLICATION', value);
  },
  setWiki ({commit}, value) {
    commit('SET_WIKI', value);
  },
  setInteroperabilityLinks ({commit}, value) {
    commit('SET_INTEROPERABILITY_LINKS', value);
  },
  setInteroperabilityStandards ({commit}, value) {
    commit('SET_INTEROPERABILITY_STANDARDS', value);
  }

};

export const mutations = {
  SET_PROJECT_STATE: (state, value) => {
    state = value;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_ORGANISATION: (state, organisation) => {
    state.organisation = organisation;
  },
  SET_COUNTRY: (state, country) => {
    state.country = country;
  },
  SET_GEOGRAPHIC_SCOPE: (state, geographic_scope) => {
    state.geographic_scope = geographic_scope;
  },
  SET_IMPLEMENTATION_OVERVIEW: (state, implementation_overview) => {
    state.implementation_overview = implementation_overview;
  },
  SET_START_DATE: (state, start_date) => {
    state.start_date = start_date;
  },
  SET_END_DATE: (state, end_date) => {
    state.end_date = end_date;
  },
  SET_CONTACT_NAME: (state, contact_name) => {
    state.contact_name = contact_name;
  },
  SET_CONTACT_EMAIL: (state, contact_email) => {
    state.contact_email = contact_email;
  },
  SET_TEAM: (state, team) => {
    state.team = team;
  },
  SET_VIEWERS: (state, viewers) => {
    state.viewers = viewers;
  },
  SET_PLATFORMS: (state, platforms) => {
    state.platforms = platforms;
  },
  SET_DIGITAL_HEALTH_INTERVENTIONS: (state, dhi) => {
    state.digitalHealthInterventions = dhi;
  },
  SET_HEALTH_FOCUS_AREAS: (state, health_focus_areas) => {
    state.health_focus_areas = health_focus_areas;
  },
  SET_HSC_CHALLENGES: (state, hsc_challenges) => {
    state.hsc_challenges = hsc_challenges;
  },
  SET_HIS_BUCKET: (state, his_bucket) => {
    state.his_bucket = his_bucket;
  },
  SET_COVERAGE_TYPE: (state, coverageType) => {
    state.coverageType = coverageType;
  },
  SET_COVERAGE: (state, coverage) => {
    state.coverage = coverage;
  },
  SET_COVERAGE_DATA: (state, {coverage, subLevel}) => {
    const cov = { ...state.coverageData };
    cov[subLevel] = {...state.coverageData[subLevel], ...coverage};
    state.coverageData = cov;
  },
  DELETE_COVERAGE_DATA: (state, subLevel) => {
    state.coverageData[subLevel] = undefined;
  },
  SET_COVERAGE_SECOND_LEVEL: (state, coverage_second_level) => {
    state.coverage_second_level = coverage_second_level;
  },
  SET_NATIONAL_LEVEL_DEPLOYMENT: (state, national_level_deployment) => {
    state.national_level_deployment = national_level_deployment;
  },
  SET_GOVERNMENT_INVESTOR: (state, government_investor) => {
    state.government_investor = government_investor;
  },
  SET_IMPLEMENTING_PARTNERS: (state, implementing_partners) => {
    state.implementing_partners = implementing_partners;
  },
  SET_IMPLEMENTATION_DATES: (state, implementation_dates) => {
    state.implementation_dates = implementation_dates;
  },
  SET_LICENSES: (state, licenses) => {
    state.licenses = licenses;
  },
  SET_REPOSITORY: (state, repository) => {
    state.repository = repository;
  },
  SET_MOBILE_APPLICATION: (state, mobile_application) => {
    state.mobile_application = mobile_application;
  },
  SET_WIKI: (state, wiki) => {
    state.wiki = wiki;
  },
  SET_INTEROPERABILITY_LINKS: (state, interoperability_links) => {
    state.interoperability_links = interoperability_links;
  },
  SET_INTEROPERABILITY_STANDARDS: (state, interoperability_standards) => {
    state.interoperability_standards = interoperability_standards;
  }
};
