/* eslint-disable no-warning-comments */
import axios from '../../plugins/axios';
import union from 'lodash/union';
import Storage from '../../Common/Storage';
import * as ProjectModule from './projects';


const storage = new Storage();

// GETTERS

export const getProfile = state => {
    return Object.assign({}, state.user.profile);
};

// ACTIONS

export const storeData = (data, email) => {
    storage.set('token', data.token);
    storage.set('user_profile_id', data.user_profile_id);
    storage.set('is_superuser', data.is_superuser);
    storage.set('email', email);
    storage.set('login', true);
    axios.setAuthToken(data.token);
};

export const handleProfile = (data) => {
    data.email = storage.get('email');
    if (data.organisation) {
        data.organisation_id = data.organisation;
        data.organisation = {
            name: data.organisation_name || '',
            id: data.organisation_id
        };
    }
    else {
        data.organisation = null;
    }
    return data;
};

export function setCountry(country) {
    return dispatch => {
        dispatch({ type: 'SET_COUNTRY', country });
    };
}


export function loadProfile() {
    return async (dispatch, getState) => {
        const state = getState();
        if (storage.get('login') && !state.user.profile) {
            const profileId = state.user.user_profile_id || storage.get('user_profile_id');
            let { data } = await axios.get(`/api/userprofiles/${profileId}/`);
            data = this.handleProfile(data);
            dispatch({ type: 'SET_PROFILE', profile: data });
        }
    };
}

export function doSignup({ account_type, password1, password2, email }) {
    return async dispatch => {
        try {
            const { data } = await axios.post('/api/rest-auth/registration/',
              { account_type, password1, password2, email });
            data.token = data.key;
            data.is_superuser = false;
            this.storeData(data, email);
            dispatch({ type: 'SET_USER', user: data });
            return Promise.resolve();
        }
        catch ({ response }) {
            return Promise.reject(response.data);
        }
    };
}

export function doLogin({ username, password }) {
    return async dispatch => {
        try {
            const { data } = await axios.post('/api/api-token-auth/', { username, password });
            this.storeData(data, username);
            dispatch({ type: 'SET_USER', user: data });
            await dispatch(this.loadProfile());
            await dispatch(ProjectModule.loadUserProjects());
            return Promise.resolve();
        }
        catch ({ response }) {
            return Promise.reject(response.data);
        }
    };
}

export function saveProfile(profile) {
    return async (dispatch, getState) => {
        const state = getState();
        const id = state.user.user_profile_id || storage.get('user_profile_id');
        const url = id ? `/api/userprofiles/${id}/` : '/api/userprofiles/';
        const action = id ? 'put' : 'post';
        const p = Object.assign({}, profile);
        p.organisation = p.organisation.id;
        let { data } = await axios[action](url, p);
        data = this.handleProfile(data);
        dispatch({ type: 'SET_PROFILE', profile: data });
    };
}

export function doLogout() {
    return dispatch => {
        storage.clear();
        try {
            dispatch({ type: 'CLEAR_USER_PROJECTS' });
        }
        catch (e) {
            console.warn(e);
        }
        try {
            dispatch({ type: 'UNSET_USER' });
        }
        catch (e) {
            console.warn(e);
        }
    };
}

export function updateTeamViewers(team, viewer) {
    return (dispatch, getState) => {
        const originalTeam = getState().user.profile.member;
        const originalViewer = getState().user.profile.viewer;
        const newTeam = union(originalTeam, team);
        const newViewer = union(originalViewer, viewer);
        if (newTeam.length !== originalTeam.length || newViewer.length !== originalViewer.length) {
            dispatch({ type: 'UPDATE_TEAM_VIEWER', member: newTeam, viewer: newViewer });
        }

    };
}

export async function verifyEmail(key) {
    const { data } = await axios.post('/api/rest-auth/registration/verify-email/', key);
    return data;
}
export async function resetPassword(newPassword) {
    const { data } = await axios.post('/api/rest-auth/password/reset/', newPassword);
    return data;
}


// Reducers

export default function user(state = {}, action) {
    switch (action.type) {
    case 'SET_USER': {
        return { ...state, ...action.user };
    }
    case 'SET_PROFILE': {
        const profile = state.profile ? { ...state.profile, ...action.profile } : { ...action.profile };
        return { ...state, profile };
    }
    case 'UPDATE_TEAM_VIEWER': {
        const profile = state.profile || {};
        profile.member = action.member;
        profile.viewer = action.viewer;
        return { ...state, profile };
    }
    case 'UNSET_USER': {
        return {};
    }
    case 'SET_COUNTRY': {
        const profile = { ...state.profile, country: action.country };
        return { ...state, profile };
    }
    default:
        return state;

    }
}

