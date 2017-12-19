/* eslint-disable no-warning-comments */
import axios from '../../plugins/axios';
import * as ProjectModule from './projects';

const initialState = {
    profiles: [],
    search_filters: [],
    languages: [],
    projectSearch: [],
    thematic_overview: [],
    axis: [],
    domains: [],
    landing_page_defaults: {}
};

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

export const getSearchFilters = state => {
    return state.system.search_filters.slice();
};

export const getLandingPageDefaults = state => {
    return { ...state.system.landing_page_defaults };
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
        dispatch({ type: 'SET_AXIS', axis: data.axis });
        dispatch({ type: 'SET_DOMAINS', domains: data.domains });
        dispatch({ type: 'SET_LANDING_PAGE_DEFAULTS',
            landing_page_defaults: data.landing_page_defaults });
        dispatch({ type: 'SET_LANGUAGES', languages: data.languages });
        dispatch({ type: 'SET_SEARCH_FILTERS', search_filters: data.search_filters });
        dispatch({ type: 'SET_THEMATIC_OVERVIEW', thematic_overview: data.thematic_overview });
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

export default function system(state = initialState, action) {
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
    case 'SET_AXIS': {
        return { ...state, axis: action.axis };
    }
    case 'SET_DOMAINS': {
        return { ...state, domains: action.domains };
    }
    case 'SET_LANDING_PAGE_DEFAULTS': {
        return { ...state, landing_page_defaults: action.landing_page_defaults };
    }
    case 'SET_LANGUAGES': {
        return { ...state, languages: action.languages };
    }
    case 'SET_SEARCH_FILTERS': {
        return { ...state, search_filters: action.search_filters };
    }
    case 'SET_THEMATIC_OVERVIEW': {
        return { ...state, thematic_overview: action.thematic_overview };
    }
    default:
        return state;
    }
}

