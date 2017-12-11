/* eslint-disable no-warning-comments */
// import axios from '../../plugins/axios';
import testTranslation from '../../LandingPage/translation';
// GETTERS


// const placeholder = /\$\$([\s\S]+?)\$\$/g;

export const translate = (state, address, params) => {
    const path = address.split('.');
    const route = exports.getCurrentRouteState(state);
    let toCompile = state.language.translation[route];
    path.forEach(name => {
        toCompile = toCompile[name];
    });
    for (const p in params) {
        const item = `$$${p}$$`;
        if (toCompile.includes(item)) {
            toCompile = toCompile.replace(item, params[p]);
        }
        else {
            toCompile = `${toCompile} ${params[p]}`;
        }
    }
    return toCompile;
};

export const getCurrentRouteState  = state => {
    return state.language.currentState;
};


// ACTIONS

export function loadTranslations() {
    return dispatch => {
        const translation = {
            landing: testTranslation
        };
        dispatch({ type: 'SET_TRANSLATION', translation });
    };
}

export function setRoute(currentState) {
    return dispatch => {
        dispatch({ type: 'SET_CURRENT_STATE', currentState });
    };
}


// Reducers

export default function language(state = {}, action) {
    switch (action.type) {
    case 'SET_TRANSLATION': {
        return { ...state, translation: action.translation };
    }
    case 'SET_CURRENT_STATE': {
        return { ...state, currentState: action.currentState };
    }
    default:
        return state;
    }
}

