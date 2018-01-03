import axios from '../../plugins/axios';
import sortBy from 'lodash/sortBy';
import forOwn from 'lodash/forOwn';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
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
    dashFieldConvertToObject, handleCoverage
} from '../project_utils';
import * as SystemModule from './system';


export const isMemberOrViewer = (state, project) => {
    const profile = UserModule.getProfile(state);
    if (profile && profile.member && profile.viewer) {
        const isMember = profile.member.indexOf(project.id) > -1;
        const isViewer = !isMember && profile.viewer.indexOf(project.id) > -1;
        return { isMember, isViewer, isTeam: isMember || isViewer };
    }
    return { isMember: false, isViewer: false, isTeam: false };
};

// GETTERS

export const getCurrentProjectId = state => {
    return state.projects.currentProject;
};

export const getLastVersion = state => {
    return state.projects.lastVersion;
};


export const getSavedProjectList = (state) => {
    if (state.projects.list) {
        return state.projects.list.filter(p => p.id !== -1)
          .map(pf => ({ ...pf, draft: {
              ...exports.getVanillaProject(state), donors: [], implementing_partners: [], ...pf.draft
          }
          }));
    }
    return undefined;
};

export const getPublishedProjects = state => {
    if (state.projects.list) {
        const list = exports.getSavedProjectList(state).map(p => {
            p = { ...p.published, ...exports.isMemberOrViewer(state, p) };
            return p;
        });
        return sortBy(list, 'id');
    }
    return [];
};

export const getDraftedProjects = state => {
    if (state.projects.list) {
        const list = exports.getSavedProjectList(state).map(p => {
            p = { ...p.draft, ...exports.isMemberOrViewer(state, p) };
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
    const structure = exports.getFlatProjectStructure(state);
    if (state.projects.list) {
        const list = exports.getSavedProjectList(state).map(p => {
            const public_id = p.public_id;
            const isPublished = !!public_id;
            p = isPublished ? { ...p.published } : { ...p.draft };
            const country = CountryModule.getCountry(state, p.country);
            p = {
                ...p,
                ...exports.isMemberOrViewer(state, p),
                isPublished,
                public_id,
                country_name: country ? country.name : '',
                ...convertIdArrayToObjectArray(p, structure, dashFieldConvertToObject)
            };
            return p;
        });
        return sortBy(list, 'id');
    }
    return [];
};

export const getUserDefaultProject = state => {
    const pp = state ? exports.getUserProjects(state) : null;
    return pp && pp[0] ? '' + pp[0].id : null;
};

export const getEmptyProject = () => {
    return { ...project_definition };
};

export const getVanillaProject = state => {
    const country = CountryModule.getUserCountry(state);
    const project = exports.getEmptyProject();
    const structure = exports.getProjectStructure(state);
    if (country) {
        project.country = country.id;
    }
    if (structure) {
        project.interoperability_links = structure.interoperability_links;
    }
    const profile = UserModule.getProfile(state);
    project.organisation = profile && profile.organisation ? profile.organisation : null;
    return { ...project };
};

export const getCurrentProjectIfExist = state => {
    return exports.getUserProjects(state).find(p => p.id === state.projects.currentProject);
};

export const getCurrentProject = state => {
    let project = exports.getCurrentProjectIfExist(state);
    if (!project) {
        project = exports.getVanillaProject(state);
    }
    return { ... project };
};

export const getCurrentPublicProject = state => {
    const project = state.projects.currentPublicProject ? state.projects.currentPublicProject.published : {};
    const country = project.country ? CountryModule.getCountry(state, project.country) : undefined;
    return { ...project, country_name: country ? country.name : project.country_name };
};

export const convertCountryFieldsAnswer = (fields) => {
    return fields.map(f => {
        f = { ... f };
        switch (f.type) {
        case 2:
            f.answer = parseInt(f.answer, 10);
            break;
        case 3:
            f.answer = f.answer === 'true';
            break;
        case 5:
            f.answer = JSON.parse(f.answer);
        }
        return f;
    });
};

export const parseProjectForViewMode = (state, project) => {
    const structure = exports.getFlatProjectStructure(state);
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
        ...convertIdArrayToObjectArray(project, structure, secondPhaseCheck),
        hasPublishedVersion: true
    };
};

export const getCurrentPublished = state => {
    const project = exports.getPublishedProjects(state).find(p=> p.id === state.projects.currentProject);
    if (project) {
        return exports.parseProjectForViewMode(state, project);
    }
    return undefined;
};

export const getCurrentDraft = state => {
    const draft = exports.getDraftedProjects(state).find(p => p.id === state.projects.currentProject);
    if (draft) {
        return {
            ...draft,
            hasPublishedVersion: !!exports.getPublishedProjects(state).find(p=> p.id === state.projects.currentProject)
        };
    }
    return undefined;
};


export const getCurrentDraftInViewMode = state => {
    const draft = exports.getCurrentDraft(state);
    if (draft) {
        return exports.parseProjectForViewMode(state, draft);
    }
    return undefined;
};

export const getStoredCountryFields = state => isDraft => {
    let project = isDraft ? exports.getCurrentDraft(state) : exports.getCurrentPublished(state);
    if (project === undefined) {
        const newProject = state.projects.list.find(p=>p.id === -1);
        if (newProject) {
            project = newProject.draft;
        }
    }
    return project ? project.fields : [];
};

export const getProjectCountryFields = state => (isDraft) => {
    const baseCountryFields = CountryModule.getCountryFields(state);
    const countryFields = exports.convertCountryFieldsAnswer(getStoredCountryFields(state)(isDraft));
    const result = baseCountryFields.map(bc => {
        const saved = countryFields.find(cf => cf.schema_id === bc.id);
        return {
            ...bc,
            answer: saved ? saved.answer : bc.answer
        };
    });
    return [...result];
};

export const getCurrentProjectForEditing = (state, data) => {
    const structure = exports.getFlatProjectStructure(state);
    if (!data) {
        data = exports.getVanillaProject(state);
    }
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
        ...exports.isMemberOrViewer(state, data),
        ...convertIdArrayToObjectArray(data, structure, fieldToConvertToObject),
        ...handleInteroperabilityLinks(data, structure)
    };

    data.coverageType = setCoverageType(data.coverage, data.national_level_deployment);
    return { ...project_definition, ...data };
};

export const getCurrentPublishedProjectForEditing = state => {
    const project = exports.getPublishedProjects(state).find(p=> p.id === state.projects.currentProject);
    if (project) {
        return exports.getCurrentProjectForEditing(state, project);
    }
    return undefined;
};

export const getCurrentDraftProjectForEditing = state => {
    const project = exports.getCurrentDraft(state);
    return exports.getCurrentProjectForEditing(state, project);
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
    return exports.getToolkitVersion(state).length;
};

export const getCurrentVersionDate = state => {
    const version = exports.getToolkitVersion(state);
    const last = version.slice(-1)[0];
    return last ? last.modified : null;
};

export const getMapsAxisData = state => {
    const axis = SystemModule.getAxis(state);
    const chartAxis = { labels: axis.map(a => a.name), data: [] };
    const toolkitVersion = exports.getToolkitVersion(state);
    const toolkitData = getToolkitData(state);
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
};

export const getMapsDomainData = state => {
    const domains = SystemModule.getDomains(state);
    const axes = SystemModule.getAxis(state);
    const chartData = { labels: axes.map(a => a.name) };
    const toolkitVersion = exports.getToolkitVersion(state);
    const toolkitData = getToolkitData(state);
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
};

export const getCoverageData = state => {
    const coverageVersion = exports.getCoverageVersion(state);
    const projectData =  exports.getCurrentProject(state);

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
};


export const getSimilarProject = state => {
    const userProjects = exports.getPublishedProjects(state);
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
            if (state.user.profile && !exports.getSavedProjectList(state)) {
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
            if (projectId && projectId !== -1) {
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
        if (id && id !== -1 && id !== getState().projects.currentProject) {
            dispatch({ type: 'SET_CURRENT_PROJECT', id });
            const project = getCurrentProjectIfExist(getState());
            if (project) {
                const mapDataPromise = dispatch(CountryModule.setCurrentCountry(project.country, ['mapData']));
                const detailPromise = dispatch(loadProjectDetails());
                const toolkitPromise = dispatch(ToolkitModule.loadToolkitData());
                return Promise.all([mapDataPromise, detailPromise, toolkitPromise]);
            }
            const { data } = await axios.get(`/api/projects/${id}/`);
            dispatch({ type: 'SET_CURRENT_PUBLIC_PROJECT_DETAIL', project: data });
        }
        else if (id === -1) {
            dispatch({ type: 'SET_CURRENT_PROJECT', id });
            const newProject = {
                id: -1,
                draft: {
                    fields: []
                },
                public: {}
            };
            dispatch({ type: 'UPDATE_SAVE_PROJECT', project: newProject });
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
        const structure = exports.getProjectStructure(state);
        if (!structure) {
            const { data } = await axios.get('/api/projects/structure/');
            await dispatch({ type: 'SET_PROJECT_STRUCTURE', structure: data });
        }
    };
}

export async function saveTeamViewers({ id }, team = [], viewers = []) {
    const data = {
        team: team.map(t => t.id),
        viewers: viewers.map(w => w.id)
    };
    await axios.put(`/api/projects/${id}/groups/`, data);
    return data;
}

export async function saveCountryFields(fields = [], countryId, project, toUpdate) {
    fields = fields.map(({ country, question, type, answer }) => {
        return {
            country, answer, type, question, project
        };
    });
    toUpdate = toUpdate === 'published' ? 'publish' : 'draft';
    try {
        const { data } = await axios.post(`/api/country-fields/${countryId}/${project}/${toUpdate}/`, { fields });
        return data.fields;
    }
    catch (e) {
        console.log(e);
        return false;
    }

}

export function processForm(form) {
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
        ...handleNationalLevelCoverage(form),
        ...handleCoverage(form)
    };
    form = { ...form, ...retainOnlyIds(form) };
    form = { ...form, ...removeEmptyChildObjects(form) };
    return removeKeysWithoutValues(form);
}

export async function postProjectSaveActions(data, team, viewers, dispatch, state, toUpdate, method) {
    const user = UserModule.getProfile(state).id;
    const countryFields = exports.getStoredCountryFields(state)(true);
    const cfPromise = exports.saveCountryFields(countryFields, data.draft.country, data.id, toUpdate);
    const twPromise = exports.saveTeamViewers(data, team, viewers);
    const [teamViewers, fields] = await Promise.all([twPromise, cfPromise]);
    const updateMember = teamViewers.team.some(t => t === user) ? [data.id] : [];
    const updateViewer = teamViewers.viewers.some(t => t === user) ? [data.id] : [];
    if (fields === false) {
        const response = {
            custom: true,
            message: 'Failed to save country fields'
        };
        return Promise.reject({ response });
    }
    if (toUpdate === 'published') {
        data.published.fields = fields;
    }
    data.draft.fields = fields;
    dispatch({ type: 'UPDATE_SAVE_PROJECT', project: data });
    dispatch({ type: 'SET_PROJECT_TEAM_VIEWERS', teamViewers });
    if (method === 'put') {
        dispatch({ type: 'BUMP_PROJECT_STATE_VERSION' });
    }
    dispatch(UserModule.updateTeamViewers(updateMember, updateViewer));
    dispatch(CountryModule.loadCurrentCountryProjects());
    dispatch(CountryModule.loadCurrentCountryDistrictsProject());
    return Promise.resolve(data);
}

export function saveDraft(form, team, viewers) {
    return async (dispatch, getState) => {
        form = exports.processForm(form);
        const method = form.id ? 'put' : 'post';
        const url = form.id ? `/api/projects/draft/${form.id}/` : '/api/projects/draft/';
        try {
            const { data } = await axios[method](url, form);
            return exports.postProjectSaveActions(data, team, viewers,  dispatch, getState(), 'draft', method);
        }
        catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    };
}

export function discardDraft() {
    return async (dispatch, getState) => {
        const published = exports.getCurrentPublishedProjectForEditing(getState());
        const form = exports.processForm(published);
        const countryFields = exports.getStoredCountryFields(getState())(false);
        const { data } = await axios.put(`/api/projects/draft/${published.id}/`, form);
        data.draft.fields = await exports.saveCountryFields(countryFields, data.draft.country, data.id, 'published');
        dispatch({ type: 'UPDATE_SAVE_PROJECT', project: data });
        dispatch({ type: 'BUMP_PROJECT_STATE_VERSION' });
        return Promise.resolve(data);
    };
}

export function publish(form, team, viewers) {
    return async (dispatch, getState) => {
        form = exports.processForm(form);
        try {
            const { data } = await axios.put(`/api/projects/publish/${form.id}/`, form);
            return exports.postProjectSaveActions(data, team, viewers,  dispatch, getState(), 'published');
        }
        catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    };
}

export async function searchProjects(query, health_topic = false, location = false,
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
        const list = await exports.searchProjects(query);
        dispatch({ type: 'SET_SIMILAR_NAME_LIST', list });
    };
}

export function clearSimilarNameList() {
    return async (dispatch) => {
        dispatch({ type: 'SET_SIMILAR_NAME_LIST', list: [] });
    };
}

export function updateProjectCountryFields({ id, answer, question, type, country, schema_id }) {
    return (dispatch, getState) => {
        const projectId = exports.getCurrentProjectId(getState());
        switch (type) {
        case 3: {
            answer = answer === true ? 'true' : 'false';
            break;
        }
        case 5: {
            answer = JSON.stringify(answer);
            break;
        }
        }
        schema_id = schema_id ? schema_id : id;
        const countryField = { id, answer, question, type, country, schema_id };
        dispatch({ type: 'UPDATE_COUNTRY_FIELD_ANSWER', projectId, countryField });
    };
}


// Reducers

export default function projects(state = { lastVersion: 0 }, action) {
    switch (action.type) {
    case 'SET_PROJECT_LIST': {
        const list = action.projects.slice();
        return { ...state, list };
    }
    case 'SET_SIMILAR_NAME_LIST': {
        const similarProjectNames = action.list.slice();
        return { ...state, similarProjectNames };
    }
    case 'UPDATE_SAVE_PROJECT': {
        const list = [...state.list];
        const index = findIndex(list, pj => pj.id === action.project.id);
        if (index !== -1) {
            list.splice(index, 1, { ...action.project });
        }
        else {
            list.push({ ...action.project });
        }
        return { ...state, list };
    }
    case 'UPDATE_COUNTRY_FIELD_ANSWER': {
        const list = [...state.list];
        const index = findIndex(list, pj => pj.id === action.projectId);
        const fields = [...list[index].draft.fields];
        const fieldIndex = findIndex(fields, f => f.schema_id === action.countryField.schema_id);
        if (fieldIndex !== -1) {
            fields.splice(fieldIndex, 1, { ...action.countryField });
        }
        else {
            fields.push({ ...action.countryField });
        }
        list[index].draft.fields = fields;
        return { ...state, list };
    }
    case 'SET_CURRENT_PROJECT': {
        const currentProject = action.id;
        return { ...state, currentProject, lastVersion: 0 };
    }
    case 'SET_CURRENT_PUBLIC_PROJECT_DETAIL': {
        const currentPublicProject = action.project;
        return { ...state, currentPublicProject };
    }
    case 'SET_PROJECT_STRUCTURE': {
        const structure = action.structure;
        return { ...state, structure };
    }
    case 'SET_PROJECT_INFO': {
        const toolkitVersions = action.info.toolkitVersions;
        const coverageVersions = action.info.coverageVersions;
        const teamViewers = action.info.teamViewers;
        return { ...state, toolkitVersions, coverageVersions, teamViewers };
    }
    case 'BUMP_PROJECT_STATE_VERSION': {
        const lastVersion = state.lastVersion += 1;
        return { ...state, lastVersion };
    }
    case 'SET_PROJECT_TEAM_VIEWERS': {
        const teamViewers = action.teamViewers;
        return { ...state, teamViewers };
    }
    case 'CLEAR_USER_PROJECTS': {
        return { structure: state.structure };
    }
    default:
        return state;

    }
}

