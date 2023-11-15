import isEmpty from 'lodash/isEmpty'
import forOwn from 'lodash/forOwn'
import qs from 'qs'

export const state = () => ({
  search: '',
  loadingProjects: false,
  pageSize: 10,
  page: 1,
  total: 0,
  nextPage: 0,
  previousPage: 0,
  userProjects: [],
  adminProjects: {},
  currentProject: null,
  projectStructure: {},
  currentProjectToolkitVersions: [],
  currentProjectCoverageVersions: []
})

const getTodayString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = ('0' + (today.getMonth() + 1)).slice(-2)
  const day = ('0' + today.getDate()).slice(-2)

  return [year, month, day].join('-')
}

export const getters = {
  getPageSize: (state) => state.pageSize,
  getTotal: (state) => state.total,
  getCurrentPage: (state) => state.page,
  getUserProjectList: state => [
    ...state.userProjects.map(p => ({
      ...p
    }))
  ],
  getCountryProjectList: state => state.adminProjects,
  getHealthFocusAreas: state =>
    state.projectStructure.health_focus_areas
      ? [...state.projectStructure.health_focus_areas]
      : [],
  getReferenceDocumentsTags: state =>
    state.projectStructure.tags
      ? [...state.projectStructure.tags]
      : [],
  getReferenceDocumentsTypes: state =>
    state.projectStructure.reference_document_types
      ? [...state.projectStructure.reference_document_types]
      : [],
  getHisBucket: state =>
    state.projectStructure.his_bucket
      ? [...state.projectStructure.his_bucket]
      : [],
  getHscChallenges: state =>
    state.projectStructure.hsc_challenges
      ? [...state.projectStructure.hsc_challenges]
      : [],
  getApplicationTypes: state =>
    state.projectStructure.services_and_application_types
      ? [...state.projectStructure.services_and_application_types]
      : [],
  getInteroperabilityLinks: state =>
    state.projectStructure.interoperability_links
      ? [...state.projectStructure.interoperability_links]
      : [],
  getInteroperabilityStandards: state =>
    state.projectStructure.interoperability_standards
      ? [...state.projectStructure.interoperability_standards]
      : [],
  getLicenses: state =>
    state.projectStructure.licenses ? [...state.projectStructure.licenses] : [],
  getOsiLicenses: state =>
    state.projectStructure.osi_licenses ? [...state.projectStructure.osi_licenses] : [],
  getDigitalHealthInterventions: state =>
    state.projectStructure.strategies
      ? [...state.projectStructure.strategies]
      : [],
  getDigitalHealthInterventionDetails: (state, getters) => id => {
    for (const category of getters.getDigitalHealthInterventions) {
      for (const group of category.subGroups) {
        const result = group.strategies.find(s => s.id === id)
        if (result) {
          return result
        }
      }
    }
  },
  getTechnologyPlatforms: state =>
    state.projectStructure.technology_platforms
      ? [...state.projectStructure.technology_platforms]
      : [],
  getToolkitVersions: state => [...state.currentProjectToolkitVersions],
  getCoverageVersions: state => [...state.currentProjectCoverageVersions],
  getProjectDetails: (state, getters, rootState, rootGetters) => p => {
    if (p) {
      const user = rootGetters['user/getProfile']
      return {
        ...p,
        isMember: user ? user.member.includes(p.id) : undefined,
        isViewer: user ? user.viewer.includes(p.id) : undefined,
        isPublished: !!(p.published && p.published.name)
      }
    }
    return {}
  },
  getUserProjectDetails: (state, getters, rootState, rootGetters) => id => {
    const p = getters.getUserProjectList.find(
      p => p.id === id || p.public_id === id
    )
    return getters.getProjectDetails(p)
  },
  getCurrentProject: (state, getters, rootState, rootGetters) => {
    // Utility method for retro-compatibility
    const p = rootGetters['project/getOriginal']
    return getters.getProjectDetails(p)
  },
  getMapsAxisData: (state, getters, rootState, rootGetters) => {
    const axis = rootGetters['system/getAxis']
    const chartAxis = {
      labels: axis.map(a => a.name),
      data: []
    }
    const toolkitVersion = getters.getToolkitVersions
    const toolkitData = rootGetters['toolkit/getToolkitData']
    const todayString = getTodayString()
    if (toolkitVersion.length > 0) {
      // Data from versions
      chartAxis.data = toolkitVersion.map(version => {
        return {
          date: version.modified.split('T')[0],
          axis1: version.data[0].axis_score / 100,
          axis2: version.data[1].axis_score / 100,
          axis3: version.data[2].axis_score / 100,
          axis4: version.data[3].axis_score / 100,
          axis5: version.data[4].axis_score / 100,
          axis6: version.data[5].axis_score / 100
        }
      })
    }

    // Current data (from tooltip)

    if (toolkitData.length === 6) {
      const lastAxisData = {
        axis1: toolkitData[0].axis_score / 100,
        axis2: toolkitData[1].axis_score / 100,
        axis3: toolkitData[2].axis_score / 100,
        axis4: toolkitData[3].axis_score / 100,
        axis5: toolkitData[4].axis_score / 100,
        axis6: toolkitData[5].axis_score / 100,
        date: todayString
      }
      chartAxis.data.push(lastAxisData)
    }
    return chartAxis
  },
  getMapsDomainData: (state, getters, rootState, rootGetters) => {
    const domains = rootGetters['system/getDomains']
    const axes = rootGetters['system/getAxis']
    const chartData = {
      labels: axes.map(a => a.name)
    }
    const toolkitVersion = getters.getToolkitVersions
    const toolkitData = rootGetters['toolkit/getToolkitData']
    const todayString = getTodayString()
    axes.forEach((axis, axInd) => {
      chartData[axis.name] = {
        labels: domains.filter(d => d.axis === axis.id).map(df => df.name),
        data: []
      }
      if (toolkitVersion.length > 0) {
        chartData[axis.name].data = toolkitVersion.map(version => {
          const ret = {}
          ret.date = version.modified.split('T')[0]
          version.data[axInd].domains.forEach((domain, domainInd) => {
            ret['axis' + (domainInd + 1)] = domain.domain_percentage / 100
          })
          return ret
        })
      }
      if (toolkitData.length > 0) {
        const current = {
          date: todayString
        }
        toolkitData[axInd].domains.forEach((dom, ii) => {
          current['axis' + (ii + 1)] = dom.domain_percentage / 100
        })
        chartData[axis.name].data.push(current)
      }
    })
    return chartData
  },
  getCoverageData: (state, getters) => {
    const coverageVersion = getters.getCoverageVersions
    const projectData = getters.getCurrentProject
    if (projectData) {
      const coverage = projectData.coverage ? projectData.coverage.slice() : []
      coverage.push(Object.assign({}, projectData.national_level_deployment))
      coverageVersion.push({
        data: coverage
      })

      const todayString = getTodayString()

      return coverageVersion.reduce(
        (ret, versionObj, vInd) => {
          ret.data[vInd] = {}
          ret.data[vInd].date = versionObj.modified
            ? versionObj.modified.split('T')[0]
            : todayString

          versionObj.data.forEach(distrObj => {
            forOwn(distrObj, (val, key) => {
              const labels = ['clients', 'facilities', 'health_workers']
              const index = labels.indexOf(key)
              if (index > -1) {
                const name = `axis${index + 1}`
                ret.data[vInd][name] = (ret.data[vInd][name] || 0) + val
              }
            })
          })
          return ret
        },
        {
          labels: [],
          data: []
        }
      )
    }
  }
}

export const actions = {
  setSearch({ commit }, search) {
    commit('setValue', { key: 'search', val: search })
  },
  setPageSize({ commit, dispatch }, size) {
    commit('setValue', { key: 'pageSize', val: size })
    commit('setValue', { key: 'page', val: 1 })
    dispatch('loadCountryProjects')
  },
  setCurrentPage({ commit, dispatch }, page) {
    commit('setValue', { key: 'page', val: page })
    dispatch('loadCountryProjects')
  },
  async loadUserProjects ({ commit }) {
    try {
      commit('setValue', { key: 'loadingProjects', val: true })
      const res = await this.$axios.get('/api/projects/member-of/')
      if (res) {
        const { data } = res
        data.sort((a, b) => b.id - a.id)
        commit('SET_USER_PROJECT_LIST', data)
      } else {
        commit('SET_USER_PROJECT_LIST', [])
      }
      commit('setValue', { key: 'loadingProjects', val: false })
    } catch (error) {
      console.error('projects/loadUserProjects failed')
      commit('setValue', { key: 'loadingProjects', val: false })
      return Promise.reject(error)
    }
  },
  async loadCountryProjects ({ state, commit }) {
    try {
      commit('setValue', { key: 'loadingProjects', val: true })

      const filter = {
        page_size: state.pageSize,
        page: state.search ? 1 : state.page,
        search: state.search
      }
      const { data } = await this.$axios({
        method: 'get',
        url: '/api/projects/admin-list/',
        params: filter,
        paramsSerializer: params => qs.stringify(params, {
          filter: (prefix,value) => {
            const val = typeof value === 'string' ? value.trim() : value
            return val === null || val === '' ? undefined : val
          }
        }),
        progress: false
      })

      commit('setValue', { key: 'adminProjects', val: data })
      commit('setValue', { key: 'total', val: data.count })
      commit('setValue', { key: 'loadingProjects', val: false })
    } catch (error) {
      console.error('projects/loadUserProjects failed')
      commit('setValue', { key: 'loadingProjects', val: false })
      commit('setValue', { key: 'adminProjects', val: {} })
    }
  },
  setLoadingProjects ({ commit }, val) {
    commit('setValue', { key: 'loadingProjects', val })
  },
  async setCurrentProject ({ commit, dispatch }, id) {
    id = parseInt(id, 10) || id
    try {
      await dispatch('loadProjectDetails', id)
    } catch (e) {
      console.error('projects/setCurrentProject failed')
      return Promise.reject(e)
    }
    commit('SET_CURRENT_PROJECT', id)
  },
  async loadProjectDetails ({ commit, rootGetters }, projectId) {
    const profile = rootGetters['user/getProfile']
    try {
      if (projectId && profile) {
        if (Number.isInteger(projectId)) {
          const [toolkitVersions, coverageVersions] = await Promise.all([
            this.$axios.get(`/api/projects/${projectId}/toolkit/versions/`),
            this.$axios.get(`/api/projects/${projectId}/coverage/versions/`)
          ])
          commit('SET_CURRENT_PROJECT_TOOLKIT', toolkitVersions.data)
          commit(
            'SET_CURRENT_PROJECT_COVERAGE_VERSIONS',
            coverageVersions.data
          )
        } else {
          const { data } = await this.$axios.get(`/api/projects/${projectId}/`)
          commit('SET_CURRENT_PROJECT_TOOLKIT', data)
          commit('SET_CURRENT_PROJECT_COVERAGE_VERSIONS', data)
        }
      }
    } catch (error) {
      console.error('projects/loadProjectDetails failed')
      return Promise.reject(error)
    }
  },
  async snapShotProject ({ state, dispatch }) {
    const id = state.currentProject
    await this.$axios.post(`/api/projects/${id}/version/`)
    return dispatch('loadProjectDetails', id)
  },
  async loadProjectStructure ({ state, commit }, force = false ) {
    try {
      if (isEmpty(state.projectStructure) || force) {
        const { data } = await this.$axios.get('/api/projects/structure/')
        commit('SET_PROJECT_STRUCTURE', data)
      }
    } catch (e) {
      console.error('projects/loadProjectStructure failed')
    }
  },
  addProjectToList ({ commit }, project) {
    commit('ADD_USER_PROJECT', project)
  },
  updateProject ({ commit }, project) {
    commit('EDIT_USER_PROJECT', project)
  },
  removeProject ({ commit }, id) {
    commit('RM_USER_PROJECT', id)
  },
  resetProjectsData ({ commit }) {
    commit('RESET_PROJECTS_DATA')
  },
  async setNewSoftware ({ commit, dispatch }, name) {
    const { data } = await this.$axios.post('/api/projects/software/', { name })
    await dispatch('loadProjectStructure', true)
    return data.id
  }
}

export const mutations = {
  setValue (state, { key, val }) {
    state[key] = val
  },
  SET_USER_PROJECT_LIST: (state, projects) => {
    state.userProjects = projects
  },
  ADD_USER_PROJECT: (state, project) => {
    state.userProjects.push(project)
  },
  EDIT_USER_PROJECT: (state, project) => {
    const index = state.userProjects.findIndex(p => p.id === project.id)
    state.userProjects.splice(index, 1, project)
  },
  RM_USER_PROJECT: (state, id) => {
    state.userProjects = state.userProjects.filter(p => p.id !== id)
  },
  SET_CURRENT_PROJECT: (state, project) => {
    state.currentProject = project
  },
  SET_PROJECT_STRUCTURE: (state, structure) => {
    state.projectStructure = structure
  },
  SET_CURRENT_PROJECT_TOOLKIT: (state, toolkit) => {
    state.currentProjectToolkitVersions = toolkit
  },
  SET_CURRENT_PROJECT_COVERAGE_VERSIONS: (state, coverage) => {
    state.currentProjectCoverageVersions = coverage
  },
  RESET_PROJECTS_DATA: state => {
    state.userProjects = []
    state.currentProject = null
    state.projectStructure = {}
    state.currentProjectToolkitVersions = []
    state.currentProjectCoverageVersions = []
  }
}
