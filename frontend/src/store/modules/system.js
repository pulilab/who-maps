/* eslint-disable no-warning-comments */
import axios from '../../plugins/axios';


// GETTERS

export const userProfiles  = state => {
    return state.profiles ? state.profiles.slice() : [];
};

// ACTIONS

export function getUserProfiles() {
    return async dispatch => {
        const { data } = await axios.get('/api/userprofiles/');
        dispatch({ type: 'SET_USER_PROFILES', profiles: data });
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


// Reducers

export default function system(state = {}, action) {
    const s = Object.assign({}, state);
    switch (action.type) {
    case 'SET_USER_PROFILES': {
        s.profiles = action.profiles;
        return Object.assign(state, {}, s);
    }
    case 'SET_PROJECT_SEARCH_RESULT': {
        s.projectSearch = action.projects;
        return Object.assign(state, {}, s);
    }
    default:
        return state;
    }
}

