/* eslint-disable no-warning-comments */
import cloneDeep from 'lodash/cloneDeep';
import axios from '../../plugins/axios';
import structure from '../static_data/toolkit_structure.json';

const initialState = {
    toolkitData: []
};

// GETTERS
export const getToolkitData = state => {
    const data = state.toolkit.toolkitData;
    return data ? cloneDeep(data) : [];
};

export const getStructure = () => {
    return cloneDeep(structure);
};

export const getDomainStructure = (axis, domain) => {
    try {
        const result = exports.getStructure()[axis].domains[domain];
        return cloneDeep(result);
    }
// eslint-disable-next-line no-empty
    catch (e) {}
    return {};
};


// ACTIONS

export function loadToolkitData() {
    return async (dispatch, getState) => {
        try {
            const projectId = getState().projects.currentProject;
            if (projectId) {
                const { data } = await axios.get(`/api/projects/${projectId}/toolkit/data/`);
                dispatch({ type: 'SET_TOOLKIT_DATA', data });
            }
            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    };
}
export function saveAnswer(answer) {
    return async (dispatch, getState) => {
        try {
            const projectId = getState().projects.currentProject;
            if (projectId) {
                const { data } = await axios.post(`/api/projects/${projectId}/toolkit/score/`, answer);
                dispatch({ type: 'UPDATE_TOOLKIT_DATA', data });
                dispatch(loadToolkitData());
            }
            return Promise.resolve();
        }
        catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    };
}


// Reducers

export default function toolkit(state = initialState, action) {
    switch (action.type) {
    case 'SET_TOOLKIT_DATA': {
        return { ...state, toolkitData: action.data };
    }
    case 'UPDATE_TOOLKIT_DATA': {
        const r = action.data;
        const data = cloneDeep(state.toolkitData);
        data[r.axis].domains[r.domain].questions[r.question].answers[r.answer] = r.value;
        return { ...state, toolkitData: data };
    }
    default:
        return state;
    }
}
