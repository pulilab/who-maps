import axios from '../../plugins/axios';
import sortBy from 'lodash/sortBy';


// ACTIONS


export function loadUserProjects() {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            if (state.user.profile && state.projects.length === 0) {
                let { data } = await axios.get('/api/projects/member-of/');
                data = sortBy(data, ['id']);
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

export default function projects(state = [], action) {
    switch (action.type) {
    case 'SET_PROJECT_LIST':
        return action.projects.slice();
    default:
        return state;

    }
}

