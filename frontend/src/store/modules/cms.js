/* eslint-disable no-warning-comments */
import axios from '../../plugins/axios';
import findIndex from 'lodash/findIndex';

// ACTIONS

export function getCmsData() {
    return async dispatch => {
        let { data } = await axios.get('/api/cms/');
        data = data.map(d => {
            d.searchOccurrences = 0;
            return d;
        });
        dispatch({ type: 'SET_CMS_DATA', data });
    };
}

function addContent(resource) {
    return async (dispatch) => {
        const { data } = await axios.post('/api/cms/', resource);
        data.searchOccurrences = 0;
        dispatch({ type: 'ADD_CMS_ENTRY', item: data });
    };
}

function updateContent(resource, id) {
    return async (dispatch) => {
        const { data } = await axios.put(`/api/cms/${id}/`, resource);
        data.searchOccurrences = 0;
        dispatch({ type: 'UPDATE_CMS_ENTRY', item: data });
    };
}

export function saveOrUpdateContent(resource) {
    return (dispatch, getState) => {
        resource = Object.assign({}, resource);
        resource.author = getState().user.profile.id;
        const id = resource.id || false;
        if (resource.cover && resource.cover.type.indexOf('image') === -1) {
            delete resource.cover;
        }
        if (resource.cover) {
            const formData = new FormData();
            for (const key in resource) {
                formData.append(key, resource[key]);
            }
            resource = formData;
        }

        if (id) {
            dispatch(updateContent(resource, id));
        }
        else {
            dispatch(addContent(resource));
        }
    };
}

export function deleteContent({ id }) {
    return async dispatch => {
        await axios.delete(`/api/cms/${id}/`);
        dispatch({ type: 'DELETE_CMS_ENTRY', id });
    };
}

export function reportContent(resource) {
    return async dispatch => {
        await axios.patch(`/api/cms/${resource.id}/`);
        resource.state = 2;
        dispatch({ type: 'UPDATE_CMS_ENTRY', item: resource });
    };
}

export function reportComment(resource) {
    return async dispatch => {
        await axios.patch(`/api/comment/${resource.id}/`);
        resource.state = 2;
        dispatch({ type: 'UPDATE_COMMENT', comment: resource });
    };
}

export function deleteComment(comment) {
    return async dispatch => {
        await axios.delete(`/api/comment/${comment.id}/`);
        dispatch({ type: 'DELETE_COMMENT', comment });
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
export function updateComment(comment) {
    return async (dispatch) => {
        const { data } = await axios.put(`/api/comment/${comment.id}/`, comment);
        data.searchOccurrences = 0;
        dispatch({ type: 'UPDATE_COMMENT', comment: data });
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
    case 'ADD_CMS_ENTRY': {
        const current = c.data.slice();
        current.push(action.item);
        c.data = current;
        return Object.assign(state, {}, c);
    }
    case 'UPDATE_CMS_ENTRY': {
        const current = c.data.slice();
        const index = findIndex(current, i => i.id === action.item.id);
        current.splice(index, 1, action.item);
        c.data = current;
        return Object.assign(state, {}, c);
    }
    case 'DELETE_CMS_ENTRY': {
        const current = c.data.slice();
        const index = findIndex(current, i => i.id === action.id);
        current.splice(index, 1);
        c.data = current;
        return Object.assign(state, {}, c);
    }
    case 'ADD_COMMENT': {
        const current = c.data.slice();
        const index = findIndex(current, i => i.id === action.comment.post);
        const item = current[index];
        item.comments.push(action.comment);
        current.splice(index, 1, item);
        c.data = current;
        return Object.assign(state, {}, c);
    }
    case 'UPDATE_COMMENT': {
        const current = c.data.slice();
        const index = findIndex(current, i => i.id === action.comment.post);
        const item = current[index];
        const commentIndex = findIndex(item.comments, com => com.id === action.comment.id);
        item.comments.splice(commentIndex, 1, action.comment);
        current.splice(index, 1, item);
        c.data = current;
        return Object.assign(state, {}, c);
    }
    case 'DELETE_COMMENT': {
        const current = c.data.slice();
        const index = findIndex(current, i => i.id === action.comment.post);
        const item = current[index];
        const commentIndex = findIndex(item.comments, com => com.id === action.comment.id);
        item.comments.splice(commentIndex, 1);
        current.splice(index, 1, item);
        c.data = current;
        return Object.assign(state, {}, c);
    }
    default:
        return state;
    }
}
