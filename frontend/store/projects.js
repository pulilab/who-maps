import isEmpty from 'lodash/isEmpty';
import forOwn from 'lodash/forOwn';

export const state = () => ({
  userProjects: [],
  currentProject: null,
  projectStructure: null,
  currentProjectToolkitVersions: [],
  currentProjectCoverageVersions: [],
  currentProjectTeamViewers: null
});

const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + today.getDate()).slice(-2);

  return [year, month, day].join('-');
};

export const getters = {
  getUserProjectList: state => [...state.userProjects.map(p => ({...p}))],
  getProjectStructure: state => state.projectStructure,
  getToolkitVersions: state => [...state.currentProjectToolkitVersions],
  getCoverageVersions: state => [...state.currentProjectCoverageVersions],
  getTeamViewers: state => state.currentProjectTeamViewers,
  getCurrentProject: (state, getters, rootState, rootGetters) => {
    const p = getters.getUserProjectList.find(p => p.id === state.currentProject);
    if (p) {
      const user = rootGetters['user/getProfile'];
      return {
        ...p,
        isMember: user ? getters.getTeamViewers.team.includes(user.id) : undefined,
        isViewer: user ? getters.getTeamViewers.viewers.includes(user.id) : undefined,
        isPublished: !!(p.published.name)
      };
    }
    return undefined;
  },
  getMapsAxisData: (state, getters, rootState, rootGetters) => {
    const axis = rootGetters['system/getAxis'];
    const chartAxis = { labels: axis.map(a => a.name), data: [] };
    const toolkitVersion = getters.getToolkitVersions;
    const toolkitData = rootGetters['toolkit/getToolkitData'];
    const todayString = getTodayString();
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
        };
      });
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
      };
      chartAxis.data.push(lastAxisData);
    }
    return chartAxis;
  },
  getMapsDomainData: (state, getters, rootState, rootGetters) => {
    const domains = rootGetters['system/getDomains'];
    const axes = rootGetters['system/getAxis'];
    const chartData = { labels: axes.map(a => a.name) };
    const toolkitVersion = getters.getToolkitVersions;
    const toolkitData = rootGetters['toolkit/getToolkitData'];
    const todayString = getTodayString();
    axes.forEach((axis, axInd) => {
      chartData[axis.name] = { labels: domains.filter(d => d.axis === axis.id).map(df => df.name), data: [] };
      if (toolkitVersion.length > 0) {
        chartData[axis.name].data = toolkitVersion.map(version => {
          const ret = {};
          ret.date = version.modified.split('T')[0];
          version.data[axInd].domains.forEach((domain, domainInd) => {
            ret['axis' + (domainInd + 1)] = domain.domain_percentage / 100;
          });
          return ret;
        });
      }
      if (toolkitData.length > 0) {
        const current = { date: todayString };
        toolkitData[axInd].domains.forEach((dom, ii) => {
          current['axis' + (ii + 1)] = dom.domain_percentage / 100;
        });
        chartData[axis.name].data.push(current);
      }
    });
    return chartData;
  },
  getCoverageData: (state, getters) => {
    const coverageVersion = getters.getCoverageVersions;
    const projectData = getters.getCurrentProject;
    if (projectData) {
      const coverage = projectData.coverage ? projectData.coverage.slice() : [];
      coverage.push(Object.assign({}, projectData.national_level_deployment));
      coverageVersion.push({ data: coverage });

      const todayString = getTodayString();

      return coverageVersion.reduce((ret, versionObj, vInd) => {
        ret.data[vInd] = {};
        ret.data[vInd].date = versionObj.modified ? versionObj.modified.split('T')[0] : todayString;

        versionObj.data.forEach(distrObj => {
          forOwn(distrObj, (val, key) => {
            const labels = ['clients', 'facilities', 'health_workers'];
            const index = labels.indexOf(key);
            if (index > -1) {
              const name = `axis${index + 1}`;
              ret.data[vInd][name] = (ret.data[vInd][name] || 0) + val;
            }
          });
        });
        return ret;
      }, { labels: [], data: [] });
    }
  }
};

export const actions = {
  async loadUserProjects ({commit, rootGetters, getters}) {
    try {
      const profile = rootGetters['user/getProfile'];
      if (profile && getters.getUserProjectList.length === 0) {
        const { data } = await this.$axios.get('/api/projects/member-of/');
        data.sort((a, b) => b.id - a.id);
        commit('SET_USER_PROJECT_LIST', data);
      }
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },
  async setCurrentProject ({commit, dispatch}, id) {
    id = parseInt(id, 10);
    commit('SET_CURRENT_PROJECT', id);
    await dispatch('loadProjectDetails', id);
  },
  async loadProjectDetails ({commit, state}, id) {
    try {
      const projectId = state.currentProject;
      if (projectId) {
        const [toolkitVersions, coverageVersions, teamViewers] =
                  await Promise.all([
                    this.$axios.get(`/api/projects/${projectId}/toolkit/versions/`),
                    this.$axios.get(`/api/projects/${projectId}/coverage/versions/`),
                    this.$axios.get(`/api/projects/${projectId}/groups/`)
                  ]);
        commit('SET_CURRENT_PROJECT_TOOLKIT', toolkitVersions.data);
        commit('SET_CURRENT_PROJECT_COVERAGE', coverageVersions.data);
        commit('SET_CURRENT_PROJECT_TEAM_VIEWERS', teamViewers.data);
      }
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },
  async snapShotProject ({state, dispatch}) {
    const id = state.currentProject;
    await this.$axios.post(`/api/projects/${id}/version/`);
    return dispatch('loadProjectDetails', id);
  },
  async loadProjectStructure ({getters, commit}) {
    const structure = getters.getProjectStructure;
    if (isEmpty(structure)) {
      const { data } = await this.$axios.get('/api/projects/structure/');
      commit('SET_PROJECT_STRUCTURE', data);
    }
  }
};

export const mutations = {
  SET_USER_PROJECT_LIST: (state, projects) => {
    state.userProjects = projects;
  },
  SET_CURRENT_PROJECT: (state, project) => {
    state.currentProject = project;
  },
  SET_PROJECT_STRUCTURE: (state, structure) => {
    state.projectStructure = structure;
  },
  SET_CURRENT_PROJECT_TOOLKIT: (state, toolkit) => {
    state.currentProjectToolkitVersions = toolkit;
  },
  SET_CURRENT_PROJECT_COVERAGE: (state, coverage) => {
    state.currentProjectCoverageVersions = coverage;
  },
  SET_CURRENT_PROJECT_TEAM_VIEWERS: (state, teamViewers) => {
    state.currentProjectTeamViewers = teamViewers;
  }
};
