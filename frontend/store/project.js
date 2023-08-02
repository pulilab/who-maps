import Vue from 'vue'
import get from 'lodash/get'
import { flatten, isEmpty } from 'lodash'
import { apiReadParser, apiWriteParser, APIError } from '../utilities/api'
import { projectFields, epochCheck, newStages } from '../utilities/projects'

const cleanState = () => ({
  ...projectFields(),
  country_answers: [],
  donors_answers: [],
  published: null,
  original: null
})

export const state = () => ({
  ...cleanState(),
  loading: false
})

export const getters = {
  getProjectData: (state, getters) => ({
    ...state,
    interoperability_links: getters.getInteroperabilityLinks,
    published: undefined,
    loading: undefined,
    country_answers: undefined,
    donor_answers: undefined,
    original: undefined
  }),
  getName: state => state.name,
  getOrganisation: state => state.organisation,
  getCountry: state => state.country,
  getGeographicScope: state => state.geographic_scope,
  getImplementationOverview: state => state.implementation_overview,
  getStartDate: state => epochCheck(state.start_date),
  getEndDate: state => epochCheck(state.end_date, false),
  getResearch: state => state.research,
  getEndDateNote: state => state.end_date_note,
  getStages: state => state.stages,
  getStagesDraft: (state, getters, rootState) => {
    if (!('stageDraft' in state)) {
      // initial set
      if ('stages' in rootState.projects.projectStructure) {
        return rootState.projects.projectStructure.stages.map(item => {
          const included =
            state.stages && state.stages.find(i => i.id === item.id)
          if (included) {
            return {
              ...item,
              date: included.date,
              note: included.note,
              checked: true
            }
          }
          return { ...item, date: '', note: '', checked: false }
        })
      }
      return []
    } else {
      return state.stagesDraft
    }
  },
  getStagesList: (state, getters, rootState) => {
    if ('stages' in rootState.projects.projectStructure) {
      return rootState.projects.projectStructure.stages.map(i => {
        return { id: i.id, name: i.name }
      })
    }
    return []
  },
  getContactName: state => state.contact_name,
  getContactEmail: state => state.contact_email,
  getTeam: state => state.team,
  getViewers: state => state.viewers,
  getSoftware: state => state.software,
  getDHIs: state => state.dhis,
  getDigitalHealthInterventions: state => [...state.digitalHealthInterventions],
  getHealthFocusAreas: state => state.health_focus_areas,
  getHscChallenges: state => state.hsc_challenges,
  getHscChallengesOther: state =>
  state.hsc_challenges_other.length === 0
    ? [null]
    : state.hsc_challenges_other,
  getHisBucket: state => state.his_bucket,
  getApplicationTypes: state => state.services_and_application_types,
  getCoverageType: state => state.coverageType,
  getCoverage: state => (state.coverage.length === 0 ? [null] : state.coverage),
  getCoverageData: state => state.coverageData,
  getCoverageSecondLevel: state =>
    state.coverage_second_level.length === 0
      ? [null]
      : state.coverage_second_level,
  getNationalLevelDeployment: state =>
    state.national_level_deployment
      ? { ...state.national_level_deployment }
      : {},
  getGovernmentInvestor: state => state.government_investor,
  getImplementingPartners: state =>
    state.implementing_partners.length === 0
      ? [null]
      : state.implementing_partners,
  getImplementingTeam: state =>
    state.implementing_team.length === 0 ? [null] : state.implementing_team,
  getImplementingViewers: state =>
    state.implementing_viewers.length === 0
      ? [null]
      : state.implementing_viewers,
  getDonors: state => state.donors,
  getShadowDonors: (state, getters, rootState) => {
    if ('health_focus_areas' in rootState.projects.projectStructure) {
      return flatten(
        rootState.projects.projectStructure.health_focus_areas.map(
          item => item.health_focus_areas
        )
      )
        .filter(
          item => state.health_focus_areas.includes(item.id) && item.donors
        )
        .map(item => item.donors)
    }
    return []
  },
  getAllShadowDonors: (state, getters, rootState) => {
    if ('health_focus_areas' in rootState.projects.projectStructure) {
      return flatten(
        rootState.projects.projectStructure.health_focus_areas.map(
          item => item.health_focus_areas
        )
      )
        .filter(item => item.donors)
        .map(item => item.donors)
    }
    return []
  },
  getImplementationDates: state =>
    state.implementation_dates && new Date(state.implementation_dates),
  getLicenses: state => state.licenses,
  getRepository: state => state.repository,
  getMobileApplication: state => state.mobile_application,
  getWiki: state => state.wiki,
  getInteroperabilityLinks: (state, getters, rootState, rootGetters) => {
    const result = {}
    rootGetters['projects/getInteroperabilityLinks'].forEach((ir, index) => {
      result[ir.id] = { ...state.interoperability_links[ir.id], index }
    })
    return result
  },
  getInteroperabilityStandards: state => state.interoperability_standards,
  getCountryAnswers: state =>
    state.country_answers ? [...state.country_answers] : [],
  getCountryAnswerDetails: (state, getters) => id =>
    getters.getCountryAnswers.find(ca => ca.question_id === id),
  getAllCountryAnswers: (state, getters, rootState, rootGetters) => {
    const country = rootGetters['countries/getCountryDetails'](
      getters.getCountry
    )
    if (country && country.country_questions) {
      return country.country_questions.map(cq => {
        const answer = getters.getCountryAnswerDetails(cq.id)
        return { question_id: cq.id, answer: answer ? answer.answer : [] }
      })
    }
  },
  getPublishedCountryAnswerDetails: (state, getters) => id =>
    getters.getPublished.country_custom_answers.find(
      ca => ca.question_id === id
    ),
  getDonorsAnswers: state =>
    state.donors_answers ? [...state.donors_answers] : [],
  getDonorsAnswerDetails: (state, getters) => id =>
    getters.getDonorsAnswers.find(da => da.question_id === id),
  getAllDonorsAnswers: (state, getters, rootState, rootGetters) => {
    const donors = [
      ...new Set([...getters.getDonors, ...getters.getShadowDonors])
    ]
      .map(d => rootGetters['system/getDonorDetails'](d))
      .filter(d => d.donor_questions)
    if (donors) {
      return donors.reduce((a, c) => {
        a.push(
          ...c.donor_questions.map(dq => {
            const answer = getters.getDonorsAnswerDetails(dq.id)
            return {
              question_id: dq.id,
              answer: answer ? answer.answer : [],
              donor_id: c.id
            }
          })
        )
        return a
      }, [])
    }
  },
  getPublishedDonorsAnswerDetails: (state, getters) => id =>
    getters.getPublished.donor_custom_answers.find(ca => ca.question_id === id),
  getPublished: (state, getters, rootState, rootGetters) => {
    let interoperability_links = {}
    try {
      rootGetters['projects/getInteroperabilityLinks'].forEach((ir, index) => {
        interoperability_links[ir.id] = {
          ...state.published.interoperability_links[ir.id],
          index
        }
      })
    } catch (e) {
      interoperability_links = {}
    }

    return {
      ...state.published,
      interoperability_links,
      team: state.team,
      viewers: state.viewers
    }
  },
  getLoading: state => state.loading,
  getOriginal: state => state.original
}

export const actions = {
  async loadProject ({ commit, dispatch, rootGetters }, id) {
    const userProject = rootGetters['projects/getUserProjectList'].find(
      p => p.id === id || p.public_id === id
    )
    const { data } =
    userProject && userProject?.id
      ? { data: userProject }
      : await this.$axios.get(`/api/projects/${id}/`)
    commit('SET_ORIGINAL', Object.freeze(data))
    const clean = cleanState()
    const countriesToFetch = new Set()
    const donorsToFetch = new Set()
    if (data.draft) {
      const draft = { ...clean, ...apiReadParser(data.draft) }
      countriesToFetch.add(draft.country)
      draft.donors.forEach(d => donorsToFetch.add(d))
      commit('INIT_PROJECT', draft)
      commit('SET_STAGES', draft.stages)
      commit('SET_START_DATE', new Date(draft.start_date))
      commit('SET_END_DATE', new Date(draft.end_date))
      commit('SET_END_DATE_NOTE', draft.end_date_note)
    }
    if (!isEmpty(data.published)) {
      const published = { ...clean, ...apiReadParser(data.published) }
      countriesToFetch.add(published.country)
      published.donors.forEach(d => donorsToFetch.add(d))
      commit('SET_STAGES', published.stages)
      commit('SET_START_DATE', new Date(published.start_date))
      commit('SET_END_DATE', new Date(published.end_date))
      commit('SET_END_DATE_NOTE', published.end_date_note)
      commit('SET_PUBLISHED', Object.freeze(published))
    }
    if (parseInt(id, 10)) {
      await Promise.all([
        ...[...countriesToFetch].map(cf =>
          dispatch('countries/loadCountryDetails', cf, { root: true })
        ),
        ...[...donorsToFetch].map(df =>
          dispatch('system/loadDonorDetails', df, { root: true })
        ),
        dispatch('loadTeamViewers', id)
      ])
    } else {
      await Promise.all([
        ...[...countriesToFetch].map(cf =>
          dispatch('countries/loadCountryDetails', cf, { root: true })
        ),
        ...[...donorsToFetch].map(df =>
          dispatch('system/loadDonorDetails', df, { root: true })
        )
      ])
    }
  },
  async loadTeamViewers ({ commit, rootGetters }, projectId) {
    const profile = rootGetters['user/getProfile']
    if (profile) {
      const { data } = await this.$axios.get(
        `/api/projects/${projectId}/groups/`
      )
      commit('SET_TEAM', data.team)
      commit('SET_VIEWERS', data.viewers)
    }
  },
  async resetProjectState ({ commit, rootGetters, dispatch }) {
    const clean = cleanState()
    const profile = rootGetters['user/getProfile']
    if (profile) {
      clean.country = profile.country
      clean.team = [profile.id]
      await dispatch('countries/loadCountryDetails', profile.country, {
        root: true
      })
    }
    commit('INIT_PROJECT', clean)
    commit('SET_TEAM', clean.team)
    commit('SET_VIEWERS', clean.viewers)
  },
  initProjectState ({ commit }, value) {
    commit('INIT_PROJECT', value)
    commit('SET_TEAM', value.team)
    commit('SET_VIEWERS', value.viewers)
  },
  setName ({ commit }, value) {
    commit('SET_NAME', value)
  },
  setOrganisation ({ commit }, value) {
    commit('SET_ORGANISATION', value)
  },
  setCountry ({ commit, dispatch }, value) {
    dispatch('countries/loadCountryDetails', value, { root: true })
    commit('SET_COUNTRY', value)
  },
  setGeographicScope ({ commit }, value) {
    commit('SET_GEOGRAPHIC_SCOPE', value)
  },
  setImplementationOverview ({ commit }, value) {
    commit('SET_IMPLEMENTATION_OVERVIEW', value)
  },
  setStartDate ({ commit }, value) {
    commit('SET_START_DATE', value)
  },
  setEndDate ({ commit }, value) {
    commit('SET_END_DATE', value)
  },
  setResearch ({ commit }, value) {
    commit('SET_RESEARCH', value)
  },
  setEndDateNote ({ commit }, value) {
    commit('SET_END_DATE_NOTE', value)
  },
  setStages ({ commit }, value) {
    commit('SET_STAGES', value)
  },
  setStagesDraft ({ commit }, value) {
    commit('SET_STAGES_DRAFT', value)
  },
  setContactName ({ commit }, value) {
    commit('SET_CONTACT_NAME', value)
  },
  setContactEmail ({ commit }, value) {
    commit('SET_CONTACT_EMAIL', value)
  },
  setTeam ({ commit }, value) {
    commit('SET_TEAM', value)
  },
  setViewers ({ commit }, value) {
    commit('SET_VIEWERS', value)
  },
  setSoftware ({ commit }, value) {
    commit('SET_SOFTWARE', value)
  },
  setDHIs ({ commit }, value) {
    commit('SET_DHIS', value)
  },
  setDigitalHealthInterventions ({ commit }, value) {
    commit('SET_DIGITAL_HEALTH_INTERVENTIONS', value)
  },
  setHealthFocusAreas ({ commit, state, getters }, value) {
    commit(
      'SET_DONORS',
      state.donors.filter(i => !getters.getShadowDonors.includes(i))
    )
    commit('SET_HEALTH_FOCUS_AREAS', value)
  },
  setHscChallenges ({ commit }, value) {
    commit('SET_HSC_CHALLENGES', value)
  },
  setHscChallengesOther ({ commit }, value) {
    commit('SET_HSC_CHALLENGES_OTHER', value)
  },
  setApplicationTypes ({ commit }, value) {
    commit('SET_APPLICATION_TYPES', value)
  },
  setCoverageType ({ commit }, value) {
    commit('SET_COVERAGE_TYPE', value)
  },
  setCoverage ({ commit }, value) {
    commit('SET_COVERAGE', value)
  },
  setCoverageData ({ commit, state }, { coverage, subLevel }) {
    if (coverage) {
      const cov = { ...state.coverageData }
      cov[subLevel] = { ...state.coverageData[subLevel], ...coverage }
      commit('SET_COVERAGE_DATA', cov)
    } else {
      commit('DELETE_COVERAGE_DATA', subLevel)
    }
  },
  setCoverageSecondLevel ({ commit }, value) {
    commit('SET_COVERAGE_SECOND_LEVEL', value)
  },
  setNationalLevelDeployment ({ commit }, value) {
    commit('SET_NATIONAL_LEVEL_DEPLOYMENT', value)
  },
  setGovernmentInvestor ({ commit }, value) {
    commit('SET_GOVERNMENT_INVESTOR', value)
  },
  setImplementingPartners ({ commit }, value) {
    commit('SET_IMPLEMENTING_PARTNERS', value)
  },
  setImplementingTeam ({ commit }, value) {
    commit('SET_IMPLEMENTING_TEAM', value)
  },
  setImplementingViewers ({ commit }, value) {
    commit('SET_IMPLEMENTING_VIEWERS', value)
  },
  setDonors ({ commit, dispatch, rootState }, value) {
    value.forEach(d => dispatch('system/loadDonorDetails', d, { root: true }))
    commit('SET_DONORS', value)
  },
  setShadowDonors ({ commit, dispatch }, value) {
    value.forEach(d => dispatch('system/loadDonorDetails', d, { root: true }))
    commit('SET_SHADOW_DONORS', value)
  },
  setImplementationDates ({ commit }, value) {
    commit('SET_IMPLEMENTATION_DATES', value)
  },
  setLicenses ({ commit }, value) {
    commit('SET_LICENSES', value)
  },
  setRepository ({ commit }, value) {
    commit('SET_REPOSITORY', value)
  },
  setMobileApplication ({ commit }, value) {
    commit('SET_MOBILE_APPLICATION', value)
  },
  setWiki ({ commit }, value) {
    commit('SET_WIKI', value)
  },
  setInteroperabilityLinks ({ commit }, value) {
    commit('SET_INTEROPERABILITY_LINKS', value)
  },
  setInteroperabilityStandards ({ commit }, value) {
    commit('SET_INTEROPERABILITY_STANDARDS', value)
  },
  setPublished ({ commit }, value) {
    commit('SET_PUBLISHED', value)
  },
  setLoading ({ commit }, value) {
    commit('SET_LOADING', value)
  },
  setCountryAnswer ({ commit, getters }, answer) {
    const index = getters.getCountryAnswers.findIndex(
      ca => ca.question_id === answer.question_id
    )
    if (index > -1) {
      commit('UPDATE_COUNTRY_ANSWER', { answer, index })
    } else {
      commit('ADD_COUNTRY_ANSWER', answer)
    }
  },
  setDonorAnswer ({ commit, getters }, answer) {
    const index = getters.getDonorsAnswers.findIndex(
      da => da.question_id === answer.question_id
    )
    if (index > -1) {
      commit('UPDATE_DONOR_ANSWER', { answer, index })
    } else {
      commit('ADD_DONOR_ANSWER', answer)
    }
  },
  async verifyOrganisation ({ dispatch }, organisation) {
    try {
      if (organisation && isNaN(organisation)) {
        const org = await dispatch('system/addOrganisation', organisation, {
          root: true
        })
        return org.id
      }
      return organisation
    } catch (e) {
      console.log('project/verifyOrganisation failed')
      return Promise.reject(
        APIError('organisation', 'Failed to save the organisation')
      )
    }
  },
  async saveTeamViewers ({ getters, commit, dispatch }, id) {
    const teamViewers = {
      team: getters.getTeam.filter(d => typeof d === 'number'),
      viewers: getters.getViewers.filter(d => typeof d === 'number'),
      new_team_emails: getters.getTeam.filter(d => typeof d === 'string'),
      new_viewer_emails: getters.getViewers.filter(d => typeof d === 'string')
    }
    const { data } = await this.$axios.put(
      `/api/projects/${id}/groups/`,
      teamViewers
    )
    commit('SET_TEAM', data.team)
    commit('SET_VIEWERS', data.viewers)
    return dispatch('user/updateTeamViewers', { ...data, id }, { root: true })
  },
  async createProject ({ state, getters, dispatch }) {
    dispatch('setLoading', 'draft')
    const draft = getters.getProjectData
    draft.donors = [...new Set([...draft.donors, ...getters.getShadowDonors])]
    draft.stages = newStages(state.stagesDraft)
    draft.organisation = await dispatch(
      'verifyOrganisation',
      draft.organisation
    )
    const parsed = apiWriteParser(
      draft,
      getters.getAllCountryAnswers,
      getters.getAllDonorsAnswers
    )
    const { data } = await this.$axios.post(
      `api/projects/draft/${draft.country}/`,
      parsed
    )
    dispatch('projects/addProjectToList', data, { root: true })
    await dispatch('saveTeamViewers', data.id)
    dispatch('setLoading', false)
    return data.id
  },
  async saveDraft ({ state, getters, dispatch }, id) {
    dispatch('setLoading', 'draft')
    const draft = getters.getProjectData
    draft.donors = [...new Set([...draft.donors, ...getters.getShadowDonors])]
    draft.stages = newStages(state.stagesDraft)
    draft.organisation = await dispatch(
      'verifyOrganisation',
      draft.organisation
    )
    const parsed = apiWriteParser(
      draft,
      getters.getAllCountryAnswers,
      getters.getAllDonorsAnswers
    )
    const { data } = await this.$axios.put(
      `api/projects/draft/${id}/${draft.country}/`,
      parsed
    )
    await dispatch('setProject', { data, id })
    dispatch('setLoading', false)
  },
  async publishProject ({ state, getters, dispatch, commit }, id) {
    dispatch('setLoading', 'publish')
    const draft = getters.getProjectData
    draft.donors = [...new Set([...draft.donors, ...getters.getShadowDonors])]
    draft.stages = newStages(state.stagesDraft)
    draft.organisation = await dispatch(
      'verifyOrganisation',
      draft.organisation
    )
    const parsed = apiWriteParser(
      draft,
      getters.getAllCountryAnswers,
      getters.getAllDonorsAnswers
    )
    const { data } = await this.$axios.put(
      `/api/projects/publish/${id}/${draft.country}/`,
      parsed
    )
    const parsedResponse = apiReadParser(data.draft)
    commit('SET_PUBLISHED', Object.freeze(parsedResponse))
    await dispatch('setProject', { data, id })
    dispatch('setLoading', false)
  },
  async unpublishProject ({ dispatch }, id) {
    dispatch('setLoading', 'unpublish')
    const { data } = await this.$axios.put(`/api/projects/unpublish/${id}/`)
    await dispatch('setProject', { data, id })
    dispatch('setLoading', false)
  },
  async archiveProject ({ dispatch }, id) {
    dispatch('setLoading', 'archive')
    await this.$axios.put(`/api/projects/archive/${id}/`)
    dispatch('setLoading', false)
  },
  async setProject ({ dispatch }, { data, id }) {
    const isUserProject = await dispatch('saveTeamViewers', id)
    if (isUserProject) {
      dispatch('projects/updateProject', data, { root: true })
    } else {
      dispatch('projects/removeProject', data.id, { root: true })
    }
  },
  async discardDraft ({ getters, dispatch, commit }, id) {
    dispatch('setLoading', 'discard')
    const published = getters.getPublished
    const parsed = apiWriteParser(
      published,
      published.country_custom_answers,
      published.donor_custom_answers
    )
    const { data } = await this.$axios.put(
      `api/projects/draft/${id}/${published.country}/`,
      parsed
    )
    const parsedResponse = apiReadParser(data.draft)
    commit('INIT_PROJECT', parsedResponse)
    dispatch('projects/updateProject', data, { root: true })
    dispatch('setLoading', false)
  },
  loadStagesDraft ({ getters, dispatch }) {
    dispatch('setStagesDraft', getters.getStagesDraft)
  }
}

export const mutations = {
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ORGANISATION: (state, organisation) => {
    state.organisation = organisation
  },
  SET_COUNTRY: (state, country) => {
    state.country = country
  },
  SET_GEOGRAPHIC_SCOPE: (state, geographic_scope) => {
    state.geographic_scope = geographic_scope
  },
  SET_IMPLEMENTATION_OVERVIEW: (state, implementation_overview) => {
    state.implementation_overview = implementation_overview
  },
  SET_START_DATE: (state, start_date) => {
    state.start_date = start_date
  },
  SET_END_DATE: (state, end_date) => {
    state.end_date = end_date
  },
  SET_RESEARCH: (state, research) => {
    state.research = research
  },
  SET_END_DATE_NOTE: (state, end_date_note) => {
    state.end_date_note = end_date_note
  },
  SET_STAGES: (state, stages) => {
    state.stages = stages
  },
  SET_STAGES_DRAFT: (state, stagesDraft) => {
    Vue.set(state, 'stagesDraft', stagesDraft)
  },
  SET_CONTACT_NAME: (state, contact_name) => {
    state.contact_name = contact_name
  },
  SET_CONTACT_EMAIL: (state, contact_email) => {
    state.contact_email = contact_email
  },
  SET_TEAM: (state, team) => {
    const items = typeof team === 'string' ? state.team.concat([team]) : team
    Vue.set(state, 'team', [...items])
  },
  SET_VIEWERS: (state, viewer) => {
    const items =
      typeof viewer === 'string' ? state.viewers.concat([viewer]) : viewer
    Vue.set(state, 'viewers', [...items])
  },
  SET_SOFTWARE: (state, software) => {
    Vue.set(state, 'software', [...software])
  },
  SET_DHIS: (state, dhis) => {
    Vue.set(state, 'dhis', [...dhis])
  },
  SET_DIGITAL_HEALTH_INTERVENTIONS: (state, dhi) => {
    Vue.set(state, 'digitalHealthInterventions', [...dhi])
  },
  SET_HEALTH_FOCUS_AREAS: (state, health_focus_areas) => {
    Vue.set(state, 'health_focus_areas', [...health_focus_areas])
  },
  SET_HSC_CHALLENGES: (state, hsc_challenges) => {
    Vue.set(state, 'hsc_challenges', [...hsc_challenges])
  },
  SET_HSC_CHALLENGES_OTHER: (state, hsc_challenges_other) => {
    Vue.set(state, 'hsc_challenges_other', [...hsc_challenges_other])
  },
  SET_APPLICATION_TYPES: (state, sat) => {
    Vue.set(state, 'services_and_application_types', [...sat])
  },
  SET_COVERAGE_TYPE: (state, coverageType) => {
    state.coverageType = coverageType
  },
  SET_COVERAGE: (state, coverage) => {
    Vue.set(state, 'coverage', [...coverage])
  },
  SET_COVERAGE_DATA: (state, coverageData) => {
    Vue.set(state, 'coverageData', { ...coverageData })
  },
  DELETE_COVERAGE_DATA: (state, subLevel) => {
    Vue.delete(state.coverageData, subLevel)
  },
  SET_COVERAGE_SECOND_LEVEL: (state, coverage_second_level) => {
    Vue.set(state, 'coverage_second_level', [...coverage_second_level])
  },
  SET_NATIONAL_LEVEL_DEPLOYMENT: (state, national_level_deployment) => {
    Vue.set(state, 'national_level_deployment', {
      ...national_level_deployment
    })
  },
  SET_GOVERNMENT_INVESTOR: (state, government_investor) => {
    state.government_investor = government_investor
  },
  SET_IMPLEMENTING_PARTNERS: (state, implementing_partners) => {
    Vue.set(state, 'implementing_partners', [...implementing_partners])
  },
  SET_IMPLEMENTING_TEAM: (state, implementing_team) => {
    Vue.set(state, 'implementing_team', [...implementing_team])
  },
  SET_IMPLEMENTING_VIEWERS: (state, implementing_viewers) => {
    Vue.set(state, 'implementing_viewers', [...implementing_viewers])
  },
  SET_DONORS: (state, donors) => {
    Vue.set(state, 'donors', [...donors])
  },
  SET_SHADOW_DONORS: (state, donors) => {
    Vue.set(state, 'shadow_donors', [...donors])
  },
  SET_IMPLEMENTATION_DATES: (state, implementation_dates) => {
    state.implementation_dates = implementation_dates
  },
  SET_LICENSES: (state, licenses) => {
    Vue.set(state, 'licenses', [...licenses])
  },
  SET_REPOSITORY: (state, repository) => {
    state.repository = repository
  },
  SET_MOBILE_APPLICATION: (state, mobile_application) => {
    state.mobile_application = mobile_application
  },
  SET_WIKI: (state, wiki) => {
    state.wiki = wiki
  },
  SET_INTEROPERABILITY_LINKS: (state, interoperability_links) => {
    Vue.set(state, 'interoperability_links', { ...interoperability_links })
  },
  SET_INTEROPERABILITY_STANDARDS: (state, interoperability_standards) => {
    Vue.set(state, 'interoperability_standards', [
      ...interoperability_standards
    ])
  },
  ADD_COUNTRY_ANSWER: (state, answer) => {
    state.country_answers.push(answer)
  },
  UPDATE_COUNTRY_ANSWER: (state, { answer, index }) => {
    state.country_answers.splice(index, 1, answer)
  },
  ADD_DONOR_ANSWER: (state, answer) => {
    state.donors_answers.push(answer)
  },
  UPDATE_DONOR_ANSWER: (state, { answer, index }) => {
    state.donors_answers.splice(index, 1, answer)
  },
  SET_PUBLISHED: (state, published) => {
    Vue.set(state, 'published', { ...published })
  },
  SET_LOADING: (state, loading) => {
    state.loading = loading
  },
  INIT_PROJECT: (state, project) => {
    state.name = get(project, 'name', '')
    state.organisation = get(project, 'organisation', null)
    state.country = get(project, 'country', null)
    state.geographic_scope = get(project, 'geographic_scope', '')
    state.implementation_overview = get(project, 'implementation_overview', '')
    state.start_date = new Date(get(project, 'start_date', ''))
    state.end_date = new Date(get(project, 'end_date', ''))
    state.research = project.research
    state.end_date_note = get(project, 'end_date_note', '')
    state.stages = get(project, 'stages', [])
    state.contact_name = get(project, 'contact_name', '')
    state.contact_email = get(project, 'contact_email', '')
    state.team = get(project, 'team', [])
    state.viewers = get(project, 'viewers', [])
    state.software = get(project, 'software', [])
    state.dhis = get(project, 'dhis', [])
    state.digitalHealthInterventions = get(
      project,
      'digitalHealthInterventions',
      []
    )
    state.health_focus_areas = get(project, 'health_focus_areas', [])
    state.hsc_challenges = get(project, 'hsc_challenges', [])
    state.hsc_challenges_other = get(project, 'hsc_challenges_other', [])
    state.his_bucket = get(project, 'his_bucket', [])
    state.services_and_application_types = get(project, 'services_and_application_types', [])
    state.coverageType = get(project, 'coverageType', null)
    state.coverage = get(project, 'coverage', [])
    state.coverageData = get(project, 'coverageData', {})
    state.coverage_second_level = get(project, 'coverage_second_level', [])
    state.modified = get(project, 'modified', new Date())
    state.national_level_deployment = get(
      project,
      'national_level_deployment',
      {
        health_workers: 0,
        clients: 0,
        facilities: 0
      }
    )
    state.government_investor = get(project, 'government_investor', '')
    state.implementing_partners = get(project, 'implementing_partners', [])
    state.implementing_team = get(project, 'implementing_team', [])
    state.implementing_viewers = get(project, 'implementing_viewers', [])
    state.donors = get(project, 'donors', [])
    state.shadow_donors = get(project, 'shadow_donors', [])
    state.implementation_dates = get(project, 'implementation_dates', '')
    state.licenses = get(project, 'licenses', [])
    state.repository = get(project, 'repository', '')
    state.mobile_application = get(project, 'mobile_application', '')
    state.wiki = get(project, 'wiki', '')
    state.interoperability_links = get(project, 'interoperability_links', {})
    state.interoperability_standards = get(
      project,
      'interoperability_standards',
      []
    )
    state.country_answers = get(project, 'country_custom_answers', [])
    state.donors_answers = get(project, 'donor_custom_answers', [])
  },
  SET_ORIGINAL: (state, project) => {
    state.original = project
  }
}
