/* eslint-disable no-warning-comments */
// import axios from '../../plugins/axios';
import debounce from 'lodash/debounce';
import landingPage from '../../translations/landingPage';
import dashboardPage from '../../translations/dashboard';
import singupPage from '../../translations/signup';
import errorMessagesTranslation from '../../translations/errorMessages';

export class TranslationError {
    constructor() {
        this.stateName = null;
        this.list = [];
    }
    toString() {
        return `state ${this.stateName} missing translations: \n${this.list.join('\n')}`;
    }

    add(error, stateName) {
        if (this.stateName !== stateName) {
            this.clear();
            this.stateName = stateName;
        }
        this.addError(error);
    }

    addError(error) {
        if (!this.list.includes(error)) {
            this.list.push(error);
            debounce(() => {
                this.print();
            }, 500)();
        }
    }
    clear() {
        this.list = [];
    }

    print() {
        if (this.list.length > 0) {
            console.error(this.toString());
            this.clear();
        }
    }
}

const errors = new exports.TranslationError();

// GETTERS

export const translate = (state, address, params) => {
    const path = address.split('.');
    const route = exports.getCurrentRouteState(state);
    let toCompile = state.language.translation;
    const errorMessages = toCompile.errors;
    try {
        toCompile = toCompile[route];
        toCompile.ERROR_MESSAGES = errorMessages;
        path.forEach(name => {
            toCompile = toCompile[name];
        });
    }
    catch (e) {
        errors.add(address, state.language.currentState);
    }
    toCompile = toCompile ? toCompile : address;
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
            landing: landingPage,
            dashboard: dashboardPage,
            errors: errorMessagesTranslation,
            signup: singupPage
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

