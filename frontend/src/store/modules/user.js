/* eslint-disable no-warning-comments */
import axios from '../../plugins/axios';
import union from 'lodash/union';
import Storage from '../../Storage';
import * as ProjectModule from './projects';
import * as SystemModule from './system';
import * as CountryModule from './countries';
import { setLanguage } from '../../plugins/language';

const storage = new Storage();

// GETTERS

export const getProfile = state => {
    if (state.user.profile) {
        const countries = CountryModule.getCountriesList(state);
        let country = undefined;
        if (countries && countries.length > 0) {
            country = { ...countries.find(c => c.id === state.user.profile.country) };
        }
        return { ...state.user.profile, country };
    }
    return undefined;
};

export const getUserLanguage = state => {
    const languages = SystemModule.getLanguages(state);
    const language = state && state.user && state.user.profile ? state.user.profile.language : undefined;
    return languages.find(l => l.code === language);
};

export const isSuperUser = state => {
    return state.user.profile.is_superuser;
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
    data.is_superuser = storage.get('is_superuser');
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


export function loadProfile() {
    return async (dispatch, getState) => {
        const state = getState();
        if (storage.get('login') && !state.user.profile) {
            const profileId = state.user.user_profile_id || storage.get('user_profile_id');
            let { data } = await axios.get(`/api/userprofiles/${profileId}/`);
            data = exports.handleProfile(data);
            setLanguage(data.language);
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
            exports.storeData(data, email);
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
            exports.storeData(data, username);
            dispatch({ type: 'SET_USER', user: data });
            await dispatch(exports.loadProfile());
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
        p.country = p.country.id;
        let { data } = await axios[action](url, p);
        data = exports.handleProfile(data);
        setLanguage(data.language);
        dispatch({ type: 'SET_PROFILE', profile: data });
        dispatch(SystemModule.loadStaticData());
        dispatch(ProjectModule.loadProjectStructure(true));
    };
}

export function doLogout() {
    return dispatch => {
        storage.clear();
        axios.unSetAuthToken();
        try {
            dispatch({ type: 'CLEAR_USER_PROJECTS' });
            dispatch({ type: 'CLEAR_TOOLKIT_DATA' });
            dispatch({ type: 'CLEAR_CMS_DATA' });
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
    default:
        return state;

    }
}
