import axios from '../../plugins/axios';


// ACTIONS


export function loadUserProjects() {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            if (state.user.profile) {
                const { data } = await axios.get('/api/projects/member-of/');
                dispatch({ type: 'SET_PROJECT_LIST', projects: data });
            }
            return Promise.resolve();
        }
        catch ({ response }) {
            return Promise.reject(response.data);
        }
    };
}


// Reducers

export default function projects(state = {}, action) {
    switch (action.type) {
    case 'SET_PROJECT_LIST':
        return Object.assign(state, {}, action.projects);
    default:
        return state;

    }
}

