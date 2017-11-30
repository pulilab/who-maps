import axios from '../../plugins/axios';
import sortBy from 'lodash/sortBy';
import forOwn from 'lodash/forOwn';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import { axisData, domainData } from '../static_data/charts_static';
import { project_definition } from '../static_data/project_definition';
import * as CountryModule from './countries';
import * as UserModule from './user';
import * as ToolkitModule from './toolkit';
import { getToolkitData } from './toolkit';

import {
    convertDate,
    convertObjectArrayToStringArray,
    convertStringArrayToObjectArray,
    createDateFields,
    fillEmptyCollectionsWithDefault,
    getTodayString,
    parsePlatformCollection,
    removeEmptyChildObjects,
    removeKeysWithoutValues,
    setCoverageType,
    parseOutInteroperabilityLinks,
    retainNationalOrDistrictCoverage,
    convertIdArrayToObjectArray,
    handleInteroperabilityLinks,
    extractIdFromObjects,
    retainOnlyIds,
    handleNationalLevelCoverage,
    fieldToConvertToObject,
    dashFieldConvertToObject
} from '../project_utils';


export const isMemberOrViewer = (state, project) => {
    const profile = UserModule.getProfile(state);
    if (profile.member && profile.viewer) {
        const isMember = profile.member.indexOf(project.id) > -1;
        const isViewer = !isMember && profile.viewer.indexOf(project.id) > -1;
        return { isMember, isViewer, isTeam: isMember || isViewer };
    }
    return { isMember: false, isViewer: false, isTeam: false };
};

// GETTERS

export const getLastVersion = state => {
    return state.projects.lastVersion;
};

export const getPublishedProjects = state => {
    if (state.projects.list) {
        const list = state.projects.list.map(p => {
            p = { ...p.published, ...isMemberOrViewer(state, p) };
            return p;
        });
        return sortBy(list, 'id');
    }
    return [];
};

export const getDraftedProjects = state => {
    if (state.projects.list) {
        const list = state.projects.list.map(p => {
            p = { ...p.draft, ...isMemberOrViewer(state, p) };
            return p;
        });
        return sortBy(list, 'id');
    }
    return [];
};

export const getFlatProjectStructure = state => {
    const structure = state.projects.structure;
    if (structure) {
        let strategies = [];
        structure.strategies.forEach(g => {
            g.subGroups.forEach(sg => {
                strategies = [...strategies, ...sg.strategies.map(s => ({ ...s }))];
            });
        });
        let health_focus_areas = [];
        structure.health_focus_areas.forEach(hfa => {
            health_focus_areas = [...health_focus_areas, ...hfa.health_focus_areas];
        });
        let hsc_challenges = [];
        structure.hsc_challenges.forEach(hsc => {
            hsc_challenges = [...hsc_challenges, ...hsc.challenges];
        });
        return { ...structure, strategies, health_focus_areas, hsc_challenges };
    }
    return {};
};

export const getProjectStructure = state => {
    const structure = state.projects.structure;
    return cloneDeep(structure);
};

export const getUserProjects = state => {
    const structure = getFlatProjectStructure(state);
    if (state.projects.list) {
        const list = state.projects.list.map(p => {
            const public_id = p.public_id;
            const isPublished = !!p.published.name;
            p = isPublished ? { ...p.published } : { ...p.draft };
            p = {
                ...p,
                ...isMemberOrViewer(state, p),
                isPublished,
                public_id,
                ...convertIdArrayToObjectArray(p, structure, dashFieldConvertToObject)
            };
            return p;
        });
        return sortBy(list, 'id');
    }
    return [];
};

export const getUserDefaultProject = state => {
    const pp = state ? getUserProjects(state) : null;
    return pp && pp[0] ? '' + pp[0].id : null;
};

export const getEmptyProject = () => {
    return { ...project_definition };
};

export const getVanillaProject = state => {
    const country = CountryModule.userCountryObject(state);
    const project = getEmptyProject();
    const structure = getProjectStructure(state);
    if (country) {
        project.country = country.id;
    }
    if (structure) {
        project.interoperability_links = structure.interoperability_links;
    }
    project.organisation = UserModule.getProfile(state).organisation;
    return { ...project };
};

export const getCurrentProjectIfExist = state => {
    return getUserProjects(state).find(p => p.id === state.projects.currentProject);
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
        f = { ... f };
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

export const parseProjectForViewMode = (state, project) => {
    const structure = getFlatProjectStructure(state);
    const country = CountryModule.getCountry(state, project.country);
    const secondPhaseCheck = [{ key: 'platforms.strategies', structure_key: 'strategies' }];
    project =  {
        ...project,
        country_name: country ? country.name : '',
        ...convertIdArrayToObjectArray(project, structure, dashFieldConvertToObject),
        coverageType: setCoverageType(project.coverage, project.national_level_deployment)
    };
    return {
        ...project,
        ...convertIdArrayToObjectArray(project, structure, secondPhaseCheck)
    };
};

export const getCurrentPublished = state => {
    const project = getPublishedProjects(state).find(p=> p.id === state.projects.currentProject);
    if (project) {
        return parseProjectForViewMode(state, project);
    }
    return undefined;
};

export const getCurrentDraft = state => {
    const draft = getDraftedProjects(state).find(p => p.id === state.projects.currentProject);
    if (draft) {
        return {
            ...draft,
            hasPublishedVersion: !!getPublishedProjects(state).find(p=> p.id === state.projects.currentProject)
        };
    }
    return undefined;
};


export const getCurrentDraftInViewMode = state => {
    const draft = getCurrentDraft(state);
    if (draft) {
        return parseProjectForViewMode(state, draft);
    }
    return undefined;
};

export const getProjectCountryFields = state => (isNewProject, isDraft) => {
    const baseCountryFields = CountryModule.getCountryFields(state);
    const project = isDraft ? getCurrentDraft(state) : getCurrentPublished(state);
    const countryFields = project ? convertCountryFieldsAnswer(project) : false;
    const result = isNewProject || !countryFields || countryFields.length === 0 ? baseCountryFields : countryFields;
    return [...result];
};

const getCurrentProjectForEditing = (state, data) => {
    const structure = getFlatProjectStructure(state);
    data.start_date = convertDate(data.start_date);
    data.implementation_dates = convertDate(data.implementation_dates);
    data.end_date = convertDate(data.end_date);
    data = convertStringArrayToObjectArray(data);
    data = fillEmptyCollectionsWithDefault(data);
    data.organisation = {
        id: data.organisation,
        name: data.organisation_name
    };
    data = {
        ...data,
        ...isMemberOrViewer(state, data),
        ...convertIdArrayToObjectArray(data, structure, fieldToConvertToObject),
        ...handleInteroperabilityLinks(data, structure)
    };

    data.coverageType = setCoverageType(data.coverage, data.national_level_deployment);
    return { ...project_definition, ...data };
};

export const getCurrentPublishedProjectForEditing = state => {
    const project = getPublishedProjects(state).find(p=> p.id === state.projects.currentProject);
    if (project) {
        return getCurrentProjectForEditing(state, project);
    }
    return undefined;
};

export const getCurrentDraftProjectForEditing = state => {
    const project = getCurrentDraft(state);
    return getCurrentProjectForEditing(state, project);
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
                dispatch({ type: 'BUMP_PROJECT_STATE_VERSION' });
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

function processForm(form) {
    const organisation_name = form.organisation ? form.organisation.name : '';
    const organisation = form.organisation ? form.organisation.id : null;
    form = { ...form, ...retainNationalOrDistrictCoverage(form) };
    form = {
        ...form,
        organisation_name,
        organisation,
        ...createDateFields(form),
        ...convertObjectArrayToStringArray(form),
        ...parseOutInteroperabilityLinks(form),
        coverageType: undefined,
        platforms: parsePlatformCollection(form),
        ...extractIdFromObjects(form),
        ...handleNationalLevelCoverage(form)
    };
    form = { ...form, ...retainOnlyIds(form) };
    form = { ...form, ...removeEmptyChildObjects(form) };
    return removeKeysWithoutValues(form);
}

async function postProjectSaveActions(data, team, viewers, countryFields, dispatch, state, toUpdate) {
    const user = UserModule.getProfile(state).id;
    const cfPromise = saveCountryFields(countryFields, data.draft.country, data.id);
    const twPromise = saveTeamViewers(data, team, viewers);
    const [fields, teamViewers] = await Promise.all([cfPromise, twPromise]);
    data[toUpdate].fields = fields;
    const updateMember = teamViewers.team.some(t => t === user) ? [data.id] : [];
    const updateViewer = teamViewers.viewers.some(t => t === user) ? [data.id] : [];
    dispatch({ type: 'UPDATE_SAVE_PROJECT', project: data });
    dispatch({ type: 'SET_PROJECT_TEAM_VIEWERS', teamViewers });
    dispatch({ type: 'BUMP_PROJECT_STATE_VERSION' });
    dispatch(UserModule.updateTeamViewers(updateMember, updateViewer));
    dispatch(CountryModule.loadCurrentCountryProjects());
    dispatch(CountryModule.loadCurrentCountryDistrictsProject());
    return Promise.resolve(data);
}

export function saveDraft(form, team, viewers, countryFields) {
    return async (dispatch, getState) => {
        form = processForm(form);
        const method = form.id ? 'put' : 'post';
        const url = form.id ? `/api/projects/draft/${form.id}/` : '/api/projects/draft/';
        try {
            const { data } = await axios[method](url, form);
            return postProjectSaveActions(data, team, viewers, countryFields,  dispatch, getState(), 'draft');
        }
        catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    };
}

export function discardDraft() {
    return async (dispatch, getState) => {
        const published = getCurrentPublishedProjectForEditing(getState());
        const form = processForm(published);
        const { data } = await axios.put(`/api/projects/draft/${published.id}/`, form);
        dispatch({ type: 'UPDATE_SAVE_PROJECT', project: data });
        dispatch({ type: 'BUMP_PROJECT_STATE_VERSION' });
        return Promise.resolve(data);
    };
}

export function publish(form, team, viewers, countryFields) {
    return async (dispatch, getState) => {
        form = processForm(form);
        try {
            const { data } = await axios.put(`/api/projects/publish/${form.id}/`, form);
            return postProjectSaveActions(data, team, viewers, countryFields,  dispatch, getState(), 'published');
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

export default function projects(state = { lastVersion: 0 }, action) {
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
        const list = [...p.list];
        const index = findIndex(list, pj => pj.id === action.project.id);
        if (index !== -1) {
            list.splice(index, 1, { ...action.project });
        }
        else {
            list.push({ ...action.project });
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
    case 'BUMP_PROJECT_STATE_VERSION': {
        const lastVersion = state.lastVersion += 1;
        return { ...state, lastVersion };
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

