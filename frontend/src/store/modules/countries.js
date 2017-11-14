/* eslint-disable no-warning-comments */
import axios from '../../plugins/axios';
import unionBy from 'lodash/unionBy';

const stateDefinition = {
    list: [],
    countryFields: [],
    currentCountry: null
};

// GETTERS

export const userCountryObject = state => {
    if (state.user && state.user.profile) {
        return state.countries.list.find(c => c.name === state.user.profile.country);
    }
    return null;
};

export const getCountryFields = state => {
    return state.countries.countryFields.filter(cf =>  cf.country === state.countries.currentCountry);
};

// ACTIONS

export function loadCountries() {
    return async (dispatch, getState) => {
        const list = getState().countries.list;
        if (list.length === 0) {
            const { data } = await axios.get('/api/countries/');
            dispatch({ type: 'SET_COUNTRIES_LIST', countries: data });
        }
    };
}

export function loadCountryFields(id) {
    return async (dispatch, getState) => {
        const countryCountryFields = getState().countries.countryFields.filter(cf =>  cf.country === id);
        if (!countryCountryFields || countryCountryFields.length === 0) {
            const { data } = await axios.get(`/api/country-fields/${id}`);
            dispatch({ type: 'UPDATE_COUNTRY_FIELDS_LIST', fields: data });
        }
    };
}

export function setCurrentCountry(id) {
    return async dispatch => {
        await dispatch(loadCountryFields(id));
        dispatch({ type: 'SET_CURRENT_COUNTRY', country: id });
    };
}


// Reducers

export default function system(state = stateDefinition, action) {
    const s = Object.assign({}, state);
    switch (action.type) {
    case 'SET_COUNTRIES_LIST': {
        s.list = action.countries;
        return Object.assign(state, {}, s);
    }
    case 'SET_CURRENT_COUNTRY': {
        s.currentCountry = action.country;
        return Object.assign(state, {}, s);
    }
    case 'UPDATE_COUNTRY_FIELDS_LIST': {
        s.countryFields = unionBy(action.fields, s.countryFields, 'id');
        return Object.assign(state, {}, s);
    }
    default:
        return state;
    }
}

