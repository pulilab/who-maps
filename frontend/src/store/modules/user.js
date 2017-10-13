import axios from '../../plugins/axios';
import { Storage } from '../../Common/';


const storage = new Storage();

// ACTIONS

const storeData = (data, email) => {
    storage.set('token', data.token);
    storage.set('user_profile_id', data.user_profile_id);
    storage.set('is_superuser', data.is_superuser);
    storage.set('email', email);
    storage.set('login', true);
    axios.setAuthToken(data.token);
};

const handleProfile = (data) => {
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


export function getProfile() {
    return async (dispatch, getState) => {
        const state = getState();
        if (storage.get('login') && !state.user.profile) {

            const profileId = state.user.user_profile_id || storage.get('user_profile_id');
            let { data } = await axios.get(`/api/userprofiles/${profileId}/`);
            data = handleProfile(data);
            dispatch({ type: 'SET_PROFILE', profile: data });
        }
    };
}

export function doLogin({ username, password }) {
    return async dispatch => {
        try {
            const { data } = await axios.post('/api/api-token-auth/', { username, password });
            storeData(data, username);
            dispatch({ type: 'SET_USER', user: data });
            await dispatch(getProfile());
            return Promise.resolve();
        }
        catch ({ response }) {
            return Promise.reject(response.data);
        }
    };
}

export function saveProfile() {
    return async (dispatch, getState) => {
        const state = getState();
        const id = state.user.user_profile_id || storage.get('user_profile_id');
        const url = id ? `/api/userprofiles/${id}/` : '/api/userprofiles/';
        const action = id ? 'put' : 'post';
        const profile = Object.assign({}, state.user.profile);
        profile.organisation = profile.organisation.id;
        let { data } = await axios[action](url, profile);
        data = handleProfile(data);
        dispatch({ type: 'SET_PROFILE', profile: data });
    };
}

export function doLogout() {
    return dispatch => {
        storage.clear();
        dispatch({ type: 'UNSET_USER' });
    };
}


// Reducers

export default function user(state = {}, action) {
    const u = Object.assign(state, {});
    switch (action.type) {
    case 'SET_USER':
        return Object.assign(state, {}, action.user);
    case 'SET_PROFILE':
        u.profile = u.profile ? u.profile : {};
        u.profile = Object.assign(u.profile, {}, action.profile);
        return Object.assign({}, u);
    case 'UNSET_USER':
        return {};
    case 'SET_COUNTRY':
        u.profile.country = action.country;
        return Object.assign({}, u);
    default:
        return state;

    }
}

