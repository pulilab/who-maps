import axios from '../../plugins/axios';
import sortBy from 'lodash/sortBy';
import forOwn from 'lodash/forOwn';
import cloneDeep from 'lodash/cloneDeep';
import union from 'lodash/union';
import findIndex from 'lodash/findIndex';
import { axisData, domainData } from '../static_data/charts_static';
import { project_definition } from '../static_data/project_definition';
import * as CountryModule from './countries';
import * as UserModule from './user';
import * as ToolkitModule from './toolkit';

import {
    convertArrayToStandardCustomObj,
    convertDate,
    convertObjectArrayToStringArray,
    convertStringArrayToObjectArray,
    createDateFields,
    fieldsWithCustomValue,
    fillEmptyCollectionsWithDefault,
    getTodayString,
    mergeCustomAndDefault,
    removeEmptyChildObjects,
    removeKeysWithoutValues,
    setCoverageType
} from '../project_utils';
import { getToolkitData } from './toolkit';

// GETTERS

export const getPublishedProjects = state => {
    if (state.projects.list) {
        const profile = UserModule.getProfile(state);
        const list = state.projects.list.map(p => {
            p = { ...p.published };
            if (profile.member && profile.viewer) {
                p.isMember = profile.member.indexOf(p.id) > -1;
                p.isViewer = profile.viewer.indexOf(p.id) > -1;
            }
            return p;
        });
        return sortBy(list, 'id');
    }
    return [];
};

export const getUserProjects = state => {
    if (state.projects.list) {
        const profile = UserModule.getProfile(state);
        const list = state.projects.list.map(p => {
            const isPublished = !!p.published.name;
            p = isPublished ? { ...p.published } : { ...p.draft };
            p.isPublished = isPublished;
            if (profile.member && profile.viewer) {
                p.isMember = profile.member.indexOf(p.id) > -1;
                p.isViewer = profile.viewer.indexOf(p.id) > -1;
            }
            return p;
        });
        return sortBy(list, 'id');
    }
    return [];
};


export const getUserDefaultProject = state => {
    const pp = state ? getPublishedProjects(state) : null;
    return pp && pp[0] ? '' + pp[0].id : null;
};

export const getVanillaProject = state => {
    const country = CountryModule.userCountryObject(state);
    const project = { ...project_definition };
    if (country) {
        project.country = country.id;
    }
    project.organisation = UserModule.getProfile(state).organisation;
    return project;
};

export const getCurrentProjectIfExist = state => {
    return getPublishedProjects(state).find(p => p.id === state.projects.currentProject);
};

export const getCurrentProject = state => {
    let project = getCurrentProjectIfExist(state);
    if (!project) {
        project = getVanillaProject(state);
    }
    return Object.assign({}, project);
};

export const getCurrentPublicProject = state => {
    const project = state.projects.currentPublicProject ? state.projects.currentPublicProject.published : {};
    return { ...project };
};

function convertCountryFieldsAnswer({ fields }) {
    return fields.map(f => {
        f = Object.assign({}, f);
        switch (f.type) {
        case 2:
            f.answer = parseInt(f.answer, 10);
            break;
        case 3:
            f.answer = f.answer === 'true';
            break;
        }
        return f;
    });
}

export const getProjectCountryFields = state => isNewProject => {
    const baseCountryFields = CountryModule.getCountryFields(state);
    const countryFields = convertCountryFieldsAnswer(getCurrentProject(state));
    const result = isNewProject || !countryFields || countryFields.length === 0 ? baseCountryFields :  countryFields;
    return cloneDeep(result);
};

const getCurrentProjectForEditing = (state, data) => {
    data = convertArrayToStandardCustomObj(data);
    data.start_date = convertDate(data.start_date);
    data.implementation_dates = convertDate(data.implementation_dates);
    data.end_date = convertDate(data.end_date);
    data = convertStringArrayToObjectArray(data);
    data = fillEmptyCollectionsWithDefault(data);
    data.organisation = {
        id: data.organisation,
        name: data.organisation_name
    };
    data.isMember = state.user.profile.member.indexOf(data.id) > -1;
    data.isViewer = state.user.profile.viewer.indexOf(data.id) > -1;

    data.coverageType = setCoverageType(data.coverage, data.national_level_deployment);
    return Object.assign({}, project_definition, data);
};

export const getCurrentPublishedProjectForEditing = state => {
    const project = getCurrentProject(state);
    return getCurrentProjectForEditing(state, project);
};

export const getCurrentDraftProjectForEditing = state => {
    const project = getUserProjects(state).find(p => p.draft.id === state.projects.currentProject);
    return getCurrentProjectForEditing(state, project.draft);
};


export const getTeam = state => {
    if (state.projects.teamViewers) {
        return state.projects.teamViewers.team.map(id => {
            return state.system.profiles.find(p => p.id === id);
        });
    }
    return [];
};

export const getViewers = state => {
    if (state.projects.teamViewers) {
        return state.projects.teamViewers.viewers.map(id => {
            return state.system.profiles.find(p => p.id === id);
        });
    }
    return [];
};

export const getProjectStructure = state => {
    const structure = state.projects.structure;
    const currentProject = getCurrentProject(state);
    if (currentProject.name) {
        fieldsWithCustomValue.forEach(item => {
            structure[item] = union(structure[item], currentProject[item]);
        });
    }
    return cloneDeep(structure);
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

export const getCurrentVersionDate = state => {
    const version = getToolkitVersion(state);
    const last = version.slice(-1)[0];
    return last ? last.modified : null;
};

export const getMapsAxisData = state => {
    const axis = { ...axisData };
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
    return axis;
};
export const getMapsDomainData = state => {
    const domains = { ...domainData };
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


export const getSimilarProject = state => {
    const userProjects = getPublishedProjects(state);
    if (state.projects.similarProjectNames) {
        return state.projects.similarProjectNames.map(p => {
            p = Object.assign({}, p);
            p.isOwn = userProjects.some(up => up.id === p.id);
            return p;
        });
    }
    return [];
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
            if (projectId) {
                const toolkitVersionsPromise = axios.get(`/api/projects/${projectId}/toolkit/versions/`);
                const coverageVersionsPromise = axios.get(`/api/projects/${projectId}/coverage/versions/`);
                const teamViewersPromise = axios.get(`/api/projects/${projectId}/groups/`);
                const [toolkitVersions, coverageVersions, teamViewers] =
                  await Promise.all([toolkitVersionsPromise, coverageVersionsPromise, teamViewersPromise]);
                dispatch({
                    type: 'SET_PROJECT_INFO',
                    info: {
                        toolkitVersions: toolkitVersions.data,
                        coverageVersions: coverageVersions.data
                    }
                });
                dispatch({ type: 'SET_PROJECT_TEAM_VIEWERS', teamViewers: teamViewers.data });
            }
            return Promise.resolve();
        }
        catch (error) {
            console.log(error);
            return Promise.reject();
        }
    };
}

export function setCurrentProject(id) {
    return async (dispatch, getState) => {
        id = parseInt(id, 10);
        const state = getState();
        if (id && id !== state.projects.currentProject) {
            dispatch({ type: 'SET_CURRENT_PROJECT', id });
            const project = getCurrentProjectIfExist(state);
            if (project) {
                const mapDataPromise = dispatch(CountryModule.setCurrentCountry(project.country, ['mapData']));
                const detailPromise = dispatch(loadProjectDetails());
                const toolkitPromise = dispatch(ToolkitModule.loadToolkitData());
                return Promise.all([mapDataPromise, detailPromise, toolkitPromise]);
            }
            const { data } = await axios.get(`/api/projects/${id}/`);
            dispatch({ type: 'SET_CURRENT_PUBLIC_PROJECT_DETAIL', project: data });

        }
        return Promise.resolve();
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
    return async (dispatch, getState) => {
        const state = getState();
        const structure = getProjectStructure(state);
        if (!structure) {
            const { data } = await axios.get('/api/projects/structure/');
            await dispatch({ type: 'SET_PROJECT_STRUCTURE', structure: data });
        }
    };
}

async function saveTeamViewers({ id }, team = [], viewers = []) {
    const data = {
        team: team.map(t => t.id),
        viewers: viewers.map(w => w.id)
    };
    await axios.put(`/api/projects/${id}/groups/`, data);
    return data;
}

async function saveCountryFields(fields = [], country, id) {
    fields = fields.map(f => {
        f = Object.assign({}, f);
        f.answer = f.type === 3 ? JSON.stringify(f.answer) : f.answer;
        f.project = id;
        return f;
    });
    const { data } = await axios.post(`/api/country-fields/${country}/${id}/`, { fields });
    return data.fields;
}

export function saveProject(processedForm, team, viewers, countryFields) {
    return async (dispatch, getState) => {
        const user = getState().user.profile.id;
        processedForm = cloneDeep(processedForm);
        processedForm.organisation_name = processedForm.organisation.name;
        processedForm.organisation = processedForm.organisation.id;
        processedForm = createDateFields(processedForm);
        processedForm = mergeCustomAndDefault(processedForm);
        processedForm = convertObjectArrayToStringArray(processedForm);
        processedForm = removeEmptyChildObjects(processedForm);
        processedForm = removeKeysWithoutValues(processedForm);
        processedForm.coverageType = undefined;
        const method = processedForm.id ? 'put' : 'post';
        const url = processedForm.id ? `/api/projects/${processedForm.id}/` : '/api/projects/';
        try {
            const { data } = await axios[method](url, processedForm);
            const cfPromise = saveCountryFields(countryFields, data.draft.country, data.id);
            const twPromise = saveTeamViewers(data, team, viewers);
            const [fields, teamViewers] = await Promise.all([cfPromise, twPromise]);
            data.fields = fields;
            const updateMember = teamViewers.team.some(t => t === user) ? [data.id] : [];
            const updateViewer = teamViewers.viewers.some(t => t === user) ? [data.id] : [];
            dispatch({ type: 'UPDATE_SAVE_PROJECT', project: data });
            dispatch({ type: 'SET_PROJECT_TEAM_VIEWERS', teamViewers });
            dispatch(UserModule.updateTeamViewers(updateMember, updateViewer));
            return Promise.resolve(data);
        }
        catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    };
}

async function searchProjects(query, health_topic = false, location = false,
                              organisation = false, project_name = true, technology_platform = false) {
    const { data } = await axios.post('/api/search/projects/', {
        health_topic,
        location,
        organisation,
        project_name,
        query,
        technology_platform
    });
    return data;
}

export function searchDuplicateProjectName(query) {
    return async (dispatch) => {
        const list = await searchProjects(query);
        dispatch({ type: 'SET_SIMILAR_NAME_LIST', list });
    };
}

export function clearSimilarNameList() {
    return async (dispatch) => {
        const list = [];
        dispatch({ type: 'SET_SIMILAR_NAME_LIST', list });
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
    case 'SET_SIMILAR_NAME_LIST': {
        p.similarProjectNames = action.list.slice();
        return Object.assign(state, {}, p);
    }
    case 'UPDATE_SAVE_PROJECT': {
        const list = cloneDeep(p.list);
        const index = findIndex(list, pj => pj.published.id === action.project.id);
        if (index !== -1) {
            const oldProject = list[index];
            oldProject.published = action.project;
            list.splice(index, 1, oldProject);
        }
        else {
            const newProject = {
                published: action.project,
                draft: {}
            };
            list.push(newProject);
        }
        p.list = list;
        return Object.assign(state, {}, p);
    }
    case 'SET_CURRENT_PROJECT': {
        p.currentProject = action.id;
        return Object.assign(state, {}, p);
    }
    case 'SET_CURRENT_PUBLIC_PROJECT_DETAIL': {
        p.currentPublicProject = action.project;
        return Object.assign(state, {}, p);
    }
    case 'SET_PROJECT_STRUCTURE': {
        p.structure = action.structure;
        return Object.assign(state, {}, p);
    }
    case 'SET_PROJECT_INFO': {
        p.toolkitVersions = action.info.toolkitVersions;
        p.coverageVersions = action.info.coverageVersions;
        p.teamViewers = action.info.teamViewers;
        return Object.assign(state, {}, p);
    }
    case 'SET_PROJECT_TEAM_VIEWERS': {
        p.teamViewers = action.teamViewers;
        return Object.assign(state, {}, p);
    }
    case 'CLEAR_USER_PROJECTS': {
        return {};
    }
    default:
        return state;

    }
}

