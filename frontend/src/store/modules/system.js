/* eslint-disable no-warning-comments */
import axios from '../../plugins/axios';

// ACTIONS

export function getUserProfiles() {
    return async dispatch => {
        const { data } = await axios.get('/api/userprofiles/');
        dispatch({ type: 'SET_USER_PROFILES', profiles: data });
    };
}


// Reducers

export default function system(state = {}, action) {
    const s = Object.assign({}, state);
    switch (action.type) {
    case 'SET_USER_PROFILES':
        s.profiles = action.profiles;
        return Object.assign(state, {}, s);
    default:
        return state;
    }
}

