import axios from '../../plugins/axios';
import moment from 'moment';
import sortBy from 'lodash/sortBy';
import forOwn from 'lodash/forOwn';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import union from 'lodash/union';
import { axisData, domainData } from '../static_data/charts_static';

const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);

    return [year, month, day].join('-');

};

function convertArrayToStandardCustomObj(data, structure) {
    data = cloneDeep(data);
    // structure = cloneDeep(structure);
    const keyArray = ['interoperability_standards', 'licenses'];

    keyArray.forEach(key=> {
        const scaffold = {
            standard: [],
            custom: void 0
        };
        structure[key] = union(structure[key], data[key]);
        scaffold.standard = data[key];
        data[key] = scaffold;
    });
    return data;
}

function convertDate(date) {
    const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
    if (date) {
        return moment(date, dateFormat).toDate();
    }
    return undefined;
}

function convertStringArrayToObjectArray(data) {
    const keyArray = ['donors', 'implementing_partners'];
    keyArray.forEach(key => {
        if (!data[key]) {
            return;
        }
        data[key] = data[key].map(value => {
            return { value };
        });
        if (data[key].length === 0) {
            data[key].push({});
        }
    });
    return Object.assign({}, data);
}

function fillEmptyCollectionsWithDefault(data) {
    data.coverage = isEmpty(data.coverage) ? [{}] : data.coverage;
    data.platforms = isEmpty(data.platforms) ? [{}] : data.platforms;
    return Object.assign({}, data);
}

function setCoverageType(cov, nat) {
    let ret = null;
    if (nat && (nat.clients || nat.facilities || nat.health_workers)) {
        ret = 2;
    }
    else if (cov && cov.length > 1) {
        ret = 1;
    }
    else if (cov && Array.isArray(cov) && cov[0] && cov[0].district) {
        ret = 1;
    }
    return ret;
}


// GETTERS

export const getPublishedProjects = state => {
    const list =  state.projects.list ? state.projects.list.map(p => p.published) : [];
    return sortBy(list, 'id');
};

export const getCurrentProject = state => {
    const project = getPublishedProjects(state).find(p => p.id === state.projects.currentProject);
    return Object.assign({}, project);
};

export const getCurrentProjectForEditing = state => {
    let data = getCurrentProject(state);
    data = convertArrayToStandardCustomObj(data, state.projects.structure);
    data.start_date = convertDate(data.start_date);
    data.implementation_dates = convertDate(data.implementation_dates);
    data.end_date = convertDate(data.end_date);
    data = convertStringArrayToObjectArray(data);
    data = fillEmptyCollectionsWithDefault(data);

    data.coverageType = setCoverageType(data.coverage, data.national_level_deployment);
    return cloneDeep(data);
};
export const getProjectStructure = state => {
    const project = state.projects.structure;
    return cloneDeep(project);
};

export const getToolkitData = state => {
    const data = state.projects.toolkitData;
    return data ? data.slice() : [];
};
export const getToolkitVersion = state => {
    const data = state.projects.toolkitVersions;
    return data ? data.slice() : [];
};
export const getCoverageVersion = state => {
    const data = state.projects.coverageVersions;
    return data ? data.slice() : [];
};

export const getCurrentVersion = state => {
    return getToolkitVersion(state).length;
};

export const getMapsAxisData = state => {
    const axis = cloneDeep(axisData);
    const toolkitVersion = getToolkitVersion(state);
    const toolkitData = getToolkitData(state);
    const todayString = getTodayString();
    if (toolkitVersion.length > 0) {
        // Data from versions
        axis.data = toolkitVersion.map(version => {
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
        axis.data.push(lastAxisData);
    }
    return axisData;
};
export const getMapsDomainData = state => {
    const domains = cloneDeep(domainData);
    const toolkitVersion = getToolkitVersion(state);
    const toolkitData = getToolkitData(state);
    const todayString = getTodayString();

    domains.labels.forEach((axis, axInd) => {
        if (toolkitVersion.length > 0) {
            domains[axis].data = toolkitVersion.map(version => {
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
            domains[axis].data.push(current);
        }
    });
    return domains;
};

export const getCoverageData = state => {
    const coverageVersion = getCoverageVersion(state);
    const projectData =  getCurrentProject(state);

    const coverage = projectData.coverage.slice();
    coverage.push(Object.assign({}, projectData.national_level_deployment));
    coverageVersion.push({ data: coverage });

    const todayString = getTodayString();

    return coverageVersion.reduce((ret, versionObj, vInd) => {

        ret.data[vInd] = {};
        ret.data[vInd].date = versionObj.modified ? versionObj.modified.split('T')[0] : todayString;

        versionObj.data.forEach(distrObj => {
            forOwn(distrObj, (val, key) => {
                if (key !== 'district') {
                    const newKey = key.replace('_', ' ');
                    if (ret.labels.indexOf(newKey) < 0) { ret.labels.push(newKey); }
                    const name = 'axis' + (ret.labels.indexOf(newKey) + 1);
                    ret.data[vInd][name] = (ret.data[vInd][name] || 0) + val;
                }
            });
        });
        return ret;
    }, { labels: [], data: [] });
};


// ACTIONS


export function loadUserProjects() {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            if (state.user.profile && !state.projects.list) {
                const { data } = await axios.get('/api/projects/member-of/');
                dispatch({ type: 'SET_PROJECT_LIST', projects: data });
            }
            return Promise.resolve();
        }
        catch (error) {
            console.log(error);
            return Promise.reject();
        }
    };
}

export function loadProjectDetails() {
    return async (dispatch, getState) => {
        try {
            const projectId = getState().projects.currentProject;
            const dataPromise = axios.get(`/api/projects/${projectId}/toolkit/data/`);
            const toolkitVersionsPromise = axios.get(`/api/projects/${projectId}/toolkit/versions/`);
            const coverageVersionsPromise = axios.get(`/api/projects/${projectId}/coverage/versions/`);
            const [toolkitData, toolkitVersions, coverageVersions] =
              await Promise.all([dataPromise, toolkitVersionsPromise, coverageVersionsPromise]);
            dispatch({
                type: 'SET_PROJECT_INFO',
                info: {
                    toolkitData: toolkitData.data,
                    toolkitVersions: toolkitVersions.data,
                    coverageVersions: coverageVersions.data
                }
            });
            return Promise.resolve();
        }
        catch (error) {
            console.log(error);
            return Promise.reject();
        }
    };
}

export function setCurrentProject(id) {
    return async dispatch => {
        id = parseInt(id, 10);
        dispatch({ type: 'SET_CURRENT_PROJECT', id });
        await dispatch(loadProjectDetails());
    };
}

export function snapShotProject() {
    return async (dispatch, getState) => {
        const id = getState().projects.currentProject;
        await axios.post(`/api/projects/${id}/version/`);
        await dispatch(loadProjectDetails());
    };
}
export function loadProjectStructure() {
    return async (dispatch) => {
        const { data } = await axios.get('/api/projects/structure/');
        await dispatch({ type: 'SET_PROJECT_STRUCTURE', structure: data });
    };
}


// Reducers

export default function projects(state = {}, action) {
    const p = Object.assign({}, state);
    switch (action.type) {
    case 'SET_PROJECT_LIST': {
        p.list = action.projects.slice();
        return Object.assign(state, {}, p);
    }
    case 'SET_CURRENT_PROJECT': {
        p.currentProject = action.id;
        return Object.assign(state, {}, p);
    }
    case 'SET_PROJECT_STRUCTURE': {
        p.structure = action.structure;
        return Object.assign(state, {}, p);
    }
    case 'SET_PROJECT_INFO': {
        p.toolkitData = action.info.toolkitData;
        p.toolkitVersions = action.info.toolkitVersions;
        p.coverageVersions = action.info.coverageVersions;
        return Object.assign(state, {}, p);
    }
    default:
        return state;

    }
}

