/* eslint-disable no-warning-comments */
import axios from '../../plugins/axios';
import findIndex from 'lodash/findIndex';

// ACTIONS

export function getCmsData() {
    return async dispatch => {
        let { data } = await axios.get('/api/cms//');
        data = data.map(d => {
            d.searchOccurrences = 0;
            return d;
        });
        dispatch({ type: 'SET_CMS_DATA', data });
    };
}

export function updateContent(resource) {
    return async (dispatch, getState) => {
        resource = Object.assign({}, resource);
        if (resource.cover && typeof resource.cover === 'string') {
            delete resource.cover;
        }
        if (resource.cover) {
            console.log(resource);
            // const { data } = await axios.put({);
        }
        else {
            const { data } = await axios.put(`/api/cms/${resource.id}/`, resource);
            dispatch({ type: 'UPDATE_CMS_ENTRY', item: data });
        }
    };
}

export function addNewComment(comment, { id }) {
    return async (dispatch, getState) => {
        comment.post = id;
        comment.user = getState().user.profile.id;
        const { data } = await axios.post('/api/comment/', comment);
        dispatch({ type: 'ADD_COMMENT', comment: data });
    };
}


// Reducers

export default function cms(state = {}, action) {
    const c = Object.assign({}, state);
    switch (action.type) {
    case 'SET_CMS_DATA': {
        c.data = action.data;
        return Object.assign(state, {}, c);
    }
    case 'UPDATE_CMS_ENTRY': {
        const current = c.data.slice3();
        const index = findIndex(current, i => i.id === action.item.id);
        current.splice(index, 1, action.item);
        c.data = current;
        return Object.assign(state, {}, c);
    }
    case 'ADD_COMMENT': {
        const current = c.data.slice();
        const index = findIndex(current, i => i.id === action.comment.post);
        const item = current[index];
        item.comments.push(action.comment);
        current.splice(index, 1, action.item);
        c.data = current;
        return Object.assign(state, {}, c);
    }
    default:
        return state;
    }
}
