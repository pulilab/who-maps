/* eslint-disable no-warning-comments */
import axios from '../../plugins/axios';
import * as ProjectModule from './projects';

// GETTERS

export const getUserProfiles  = state => {
    return state.system.profiles ? state.system.profiles.slice() : [];
};

export const getSearchResult = state => {
    const search = state.system.projectSearch ? state.system.projectSearch : [];
    return search.map(s => {
        return { ...s, ...ProjectModule.isMemberOrViewer(state, s) };
    });
};

export const getLanguages = state => {
    return state.system.languages.map(l => ({ ...l, flag: `/static/flags/${l.flag}` }));
};

// ACTIONS

export function loadUserProfiles() {
    return async dispatch => {
        const { data } = await axios.get('/api/userprofiles/');
        dispatch({ type: 'SET_USER_PROFILES', profiles: data });
    };
}

export function loadStaticData() {
    return async dispatch => {
        const { data } = await axios.get('/api/static-data/');
        dispatch({ type: 'SET_LANGUAGES', languages: data.languages });
    };
}

export function searchProjects(query, searchFilters) {
    return async dispatch => {
        const filters = {
            query
        };
        for (const f in searchFilters) {
            const item = searchFilters[f];
            filters[item.name] = item.value;
        }
        const { data } = await axios.post('/api/search/projects/', filters);
        dispatch({ type: 'SET_PROJECT_SEARCH_RESULT', projects: data });
    };
}

export function unsetSearchedProjects() {
    return dispatch => {
        dispatch({ type: 'UNSET_PROJECT_SEARCH_RESULT' });
    };
}

export async function searchOrganisation(name) {
    const { data } = await axios.get(`/api/organisations/?name=${name}`);
    return data;
}
export async function addOrganisation(name) {
    const { data } = await axios.post('/api/organisations/', { name });
    return data;
}


// Reducers

export default function system(state = {}, action) {
    switch (action.type) {
    case 'SET_USER_PROFILES': {
        return { ...state, profiles: action.profiles };
    }
    case 'SET_PROJECT_SEARCH_RESULT': {
        return { ...state, projectSearch: action.projects };
    }
    case 'UNSET_PROJECT_SEARCH_RESULT': {
        return { ...state, projectSearch: [] };
    }
    case 'SET_LANGUAGES': {
        return { ...state, languages: action.languages };
    }
    default:
        return state;
    }
}

