import Vue from 'vue';
import { apiReadParser, apiWriteParser } from '../utilities/api';

const cleanState = () => ({
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
  implementation_dates: null,
  licenses: [],
  repository: null,
  mobile_application: null,
  wiki: null,
  interoperability_links: {},
  interoperability_standards: [],
  published: null
});

export const state = () => ({
  ...cleanState(),
  loading: false
});

export const getters = {
  getProjectData: state => ({...state, published: undefined, loading: undefined}),
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
  getPlatforms: state => state.platforms.length === 0 ? [null] : state.platforms,
  getDigitalHealthInterventions: state => [...state.digitalHealthInterventions],
  getHealthFocusAreas: state => state.health_focus_areas,
  getHscChallenges: state => state.hsc_challenges,
  getHisBucket: state => state.his_bucket,
  getCoverageType: state => state.coverageType,
  getCoverage: state => state.coverage.length === 0 ? [null] : state.coverage,
  getCoverageData: state => state.coverageData,
  getCoverageSecondLevel: state => state.coverage_second_level.length === 0 ? [null] : state.coverage_second_level,
  getNationalLevelDeployment: state => ({...state.national_level_deployment}),
  getGovernmentInvestor: state => state.government_investor,
  getImplementingPartners: state => state.implementing_partners.length === 0 ? [null] : state.implementing_partners,
  getImplementationDates: state => state.implementation_dates,
  getLicenses: state => state.licenses,
  getRepository: state => state.repository,
  getMobileApplication: state => state.mobile_application,
  getWiki: state => state.wiki,
  getInteroperabilityLinks: state => state.interoperability_links,
  getInteroperabilityStandards: state => state.interoperability_standards,
  getPublished: state => state.published,
  getLoading: state => state.loading
};

export const actions = {
  async loadProject ({commit, dispatch}, id) {
    const { data } = await this.$axios.get(`/api/projects/${id}/`);
    const clean = cleanState();
    const published = {...clean, ...apiReadParser(data.published)};
    const draft = {...clean, ...apiReadParser(data.draft)};
    commit('SET_PUBLISHED', Object.freeze(published));
    await dispatch('setProjectState', draft);
    await dispatch('loadTeamViewers', id);
  },
  async loadTeamViewers ({commit}, projectId) {
    const { data } = await this.$axios.get(`/api/projects/${projectId}/groups/`);
    commit('SET_TEAM', data.team);
    commit('SET_VIEWERS', data.viewers);
  },
  async setProjectState ({dispatch, commit}, project) {
    dispatch('setName', project.name);
    dispatch('setOrganisation', project.organisation);
    dispatch('setCountry', project.country);
    dispatch('setGeographicScope', project.geographic_scope);
    dispatch('setImplementationOverview', project.implementation_overview);
    dispatch('setStartDate', project.start_date);
    dispatch('setEndDate', project.end_date);
    dispatch('setContactName', project.contact_name);
    dispatch('setContactEmail', project.contact_email);
    dispatch('setPlatforms', project.platforms);
    dispatch('setDigitalHealthInterventions', project.digitalHealthInterventions);
    dispatch('setHealthFocusAreas', project.health_focus_areas);
    dispatch('setHscChallenges', project.hsc_challenges);
    dispatch('setHisBucket', project.his_bucket);
    dispatch('setCoverageType', project.coverageType);
    dispatch('setCoverage', project.coverage);
    commit('SET_COVERAGE_DATA', project.coverageData);
    dispatch('setCoverageSecondLevel', project.coverage_second_level);
    dispatch('setNationalLevelDeployment', project.national_level_deployment);
    dispatch('setGovernmentInvestor', project.government_investor);
    dispatch('setImplementingPartners', project.implementing_partners);
    dispatch('setImplementationDates', project.implementation_dates);
    dispatch('setLicenses', project.licenses);
    dispatch('setRepository', project.repository);
    dispatch('setMobileApplication', project.mobile_application);
    dispatch('setWiki', project.wiki);
    dispatch('setInteroperabilityLinks', project.interoperability_links);
    dispatch('setInteroperabilityStandards', project.interoperability_standards);
  },
  resetProjectState ({dispatch, commit, rootGetters}) {
    const clean = cleanState();
    const profile = rootGetters['user/getProfile'];
    if (profile) {
      clean.country = profile.country;
      clean.team = [profile.id];
    }
    dispatch('setProjectState', clean);
    commit('SET_TEAM', clean.team);
    commit('SET_VIEWERS', clean.viewers);
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
  setCoverageData ({commit, state}, {coverage, subLevel}) {
    if (coverage) {
      const cov = { ...state.coverageData };
      cov[subLevel] = {...state.coverageData[subLevel], ...coverage};
      commit('SET_COVERAGE_DATA', cov);
    } else {
      commit('DELETE_COVERAGE_DATA', subLevel);
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
  },
  setPublished ({commit}, value) {
    commit('SET_PUBLISHED', value);
  },
  setLoading ({commit}, value) {
    commit('SET_LOADING', value);
  },
  async saveTeamViewers ({getters, commit}, id) {
    const teamViewers = {
      team: getters.getTeam,
      viewers: getters.getViewers
    };
    const { data } = await this.$axios.put(`/api/projects/${id}/groups/`, teamViewers);
    commit('SET_TEAM', data.team);
    commit('SET_VIEWERS', data.viewers);
  },
  async createProject ({getters, dispatch}) {
    dispatch('setLoading', 'draft');
    const draft = getters.getProjectData;
    const parsed = apiWriteParser(draft);
    const { data } = await this.$axios.post('api/projects/draft/', parsed);
    dispatch('projects/addProjectToList', data, {root: true});
    await dispatch('saveTeamViewers', data.id);
    dispatch('setLoading', false);
    return data.id;
  },
  async saveDraft ({getters, dispatch}, id) {
    dispatch('setLoading', 'draft');
    const draft = getters.getProjectData;
    const parsed = apiWriteParser(draft);
    const { data } = await this.$axios.put(`api/projects/draft/${id}/`, parsed);
    await dispatch('saveTeamViewers', id);
    dispatch('projects/updateProject', data, {root: true});
    dispatch('setLoading', false);
  },
  async publishProject ({getters, dispatch, commit}, id) {
    dispatch('setLoading', 'publish');
    const draft = getters.getProjectData;
    const parsed = apiWriteParser(draft);
    // TODO: Remove this on donor feature creation
    parsed.donors = ['FakeDonor for API TEST'];
    const { data } = await this.$axios.put(`/api/projects/publish/${id}/`, parsed);
    await dispatch('saveTeamViewers', id);
    const parsedResponse = apiReadParser(data.draft);
    commit('SET_PUBLISHED', Object.freeze(parsedResponse));
    dispatch('projects/updateProject', data, {root: true});
    dispatch('setLoading', false);
  },
  async discardDraft ({getters, dispatch}, id) {
    dispatch('setLoading', 'discard');
    const published = getters.getPublished;
    const parsed = apiWriteParser(published);
    const { data } = await this.$axios.put(`api/projects/draft/${id}/`, parsed);
    const parsedResponse = apiReadParser(data.draft);
    await dispatch('setProjectState', parsedResponse);
    dispatch('projects/updateProject', data, {root: true});
    dispatch('setLoading', false);
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
    Vue.set(state, 'team', [...team]);
  },
  SET_VIEWERS: (state, viewers) => {
    Vue.set(state, 'viewers', [...viewers]);
  },
  SET_PLATFORMS: (state, platforms) => {
    Vue.set(state, 'platforms', [...platforms]);
  },
  SET_DIGITAL_HEALTH_INTERVENTIONS: (state, dhi) => {
    Vue.set(state, 'digitalHealthInterventions', [...dhi]);
  },
  SET_HEALTH_FOCUS_AREAS: (state, health_focus_areas) => {
    Vue.set(state, 'health_focus_areas', [...health_focus_areas]);
  },
  SET_HSC_CHALLENGES: (state, hsc_challenges) => {
    Vue.set(state, 'hsc_challenges', [...hsc_challenges]);
  },
  SET_HIS_BUCKET: (state, his_bucket) => {
    Vue.set(state, 'his_bucket', [...his_bucket]);
  },
  SET_COVERAGE_TYPE: (state, coverageType) => {
    state.coverageType = coverageType;
  },
  SET_COVERAGE: (state, coverage) => {
    Vue.set(state, 'coverage', [...coverage]);
  },
  SET_COVERAGE_DATA: (state, coverageData) => {
    Vue.set(state, 'coverageData', {...coverageData});
  },
  DELETE_COVERAGE_DATA: (state, subLevel) => {
    Vue.delete(state.coverageData, subLevel);
  },
  SET_COVERAGE_SECOND_LEVEL: (state, coverage_second_level) => {
    Vue.set(state, 'coverage_second_level', [...coverage_second_level]);
  },
  SET_NATIONAL_LEVEL_DEPLOYMENT: (state, national_level_deployment) => {
    Vue.set(state, 'national_level_deployment', {...national_level_deployment});
  },
  SET_GOVERNMENT_INVESTOR: (state, government_investor) => {
    state.government_investor = government_investor;
  },
  SET_IMPLEMENTING_PARTNERS: (state, implementing_partners) => {
    Vue.set(state, 'implementing_partners', [...implementing_partners]);
  },
  SET_IMPLEMENTATION_DATES: (state, implementation_dates) => {
    state.implementation_dates = implementation_dates;
  },
  SET_LICENSES: (state, licenses) => {
    Vue.set(state, 'licenses', [...licenses]);
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
    Vue.set(state, 'interoperability_links', {...interoperability_links});
  },
  SET_INTEROPERABILITY_STANDARDS: (state, interoperability_standards) => {
    Vue.set(state, 'interoperability_standards', [...interoperability_standards]);
  },
  SET_PUBLISHED: (state, published) => {
    Vue.set(state, 'published', {...published});
  },
  SET_LOADING: (state, loading) => {
    state.loading = loading;
  }

};
