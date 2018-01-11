/* eslint-disable no-warning-comments */
import axios from '../../plugins/axios';
import unionBy from 'lodash/unionBy';
import forEach from 'lodash/forEach';
import { isMemberOrViewer } from './projects';
import * as UserModule from './user';
import * as SystemModule from './system';
import { getCurrentLanguage } from '../../plugins/language';

const stateDefinition = {
    list: [],
    countryFields: [],
    currentCountryDistricts: [],
    currentCountry: null,
    currentCountryCoverPage: {},
    currentCountryProjects: [],
    currentCountryDistrictsProjects: []
};

export const mapData = {};

// GETTERS


export const getCountry = (state, id) => {
    return state.countries.list.find(c => c.id === id);
};


export const getCountriesList = state => {
    if (state.countries.list) {
        return state.countries.list.map(c=> {
            const code = c.code.toLocaleLowerCase();
            return {
                ...c,
                code,
                flag: `/static/flags/${code}.png`,
                prettyName: c.name.split('-').join(' ')
            };
        }).sort((a, b) => a.name.localeCompare(b.name));
    }
    return [];
};

export const getUserCountry = (state) => {
    const profile = UserModule.getProfile(state);
    if (profile) {
        return profile.country;
    }
    return undefined;
};

export const getCountryFields = state => {
    return state.countries.countryFields.filter(cf =>  cf.country === state.countries.currentCountry).map(cf =>{
        return { ...cf };
    }).sort((a, b) => a.id - b.id);
};

export const getCurrentCountry = state => {
    return { ...getCountriesList(state).find(c => c.id === state.countries.currentCountry) };
};

export const getCountryCoverPage = state => {
    const countryCover = { ...state.countries.currentCountryCoverPage };
    const country_default_data = SystemModule.getLandingPageDefaults(state);
    forEach(country_default_data, (standardValue, key) => {
        const value = countryCover[key];
        if (value === null || value === undefined || value === '') {
            countryCover[key] = standardValue;
        }
    });
    countryCover.partners = countryCover.default_partners.concat(countryCover.partner_logos);
    return countryCover;
};

export const getCountryCoverPicture = state => {
    const country = exports.getCountryCoverPage(state);
    if (country.cover) {
        return {
            background: `url(${country.cover}) 0 0`,
            'background-size': 'cover',
            'background-repeat': 'no-repeat'
        };
    }
    return null;
};

export const getCountriesLib = state => {
    const result = {};
    if (state.countries.list) {
        state.countries.list.forEach(c => {
            result[c.id] = c.name;
        });
    }
    return result;
};

export const getCurrentCountrySubLevelNames = state => {
    const country = exports.getCurrentCountry(state);
    try {
        return [country.map_data.first_sub_level.name, country.map_data.second_sub_level.name];
    }
    catch (e) {
        return ['', ''];
    }
};

export const getCurrentCountryFirstSubLevel = state => {
    const ln = getCurrentLanguage();
    const country = exports.getCurrentCountry(state);
    return country.map_data.first_sub_level.elements
      .map(ccd => ({ id: ccd.name, name: ccd[`name:${ln}`] || ccd['name:en'] || ccd.name }));
};
export const getCurrentCountrySecondSubLevel = state => {
    const ln = getCurrentLanguage();
    const country = exports.getCurrentCountry(state);
    return country.map_data.second_sub_level.elements
      .map(ccd => ({ id: ccd['name:en'] || ccd.name, name: ccd[`name:${ln}`] || ccd['name:en'] || ccd.name }));
};

export const getCurrentCountryMapData = state => {
    const currentCountry = exports.getCurrentCountry(state);
    currentCountry.mapData = mapData[currentCountry.code];
    currentCountry.districts = exports.getCurrentCountryFirstSubLevel(state);
    return currentCountry;
};

export const getCurrentCountryDistrictProjects = state => {
    const result = {};
    const districts = state.countries.currentCountryDistrictsProjects;
    for (const d in districts) {
        result[d] = districts[d].map(p => {
            p = { ...p, ...isMemberOrViewer(state, p) };
            return p;
        });
    }
    return result;
};
export const getCurrentCountryProjects = state => {
    return state.countries.currentCountryProjects.map(ccp => {
        ccp = { ...ccp, ...isMemberOrViewer(state, ccp) };
        return ccp;
    });
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
            const { data } = await axios.get(`/api/country-fields/${id}/`);
            dispatch({ type: 'UPDATE_COUNTRY_FIELDS_LIST', fields: data });
        }
    };
}

export function loadCountryMapData() {
    return async (dispatch, getState) => {
        const state = getState();
        const country = exports.getCurrentCountry(state);
        if (country && country.code) {
            const countryData = mapData[country.code];
            if (!countryData) {
                const { data } = await axios.get(`/static/country-geodata/${country.code}.json`);
                mapData[country.code] = Object.freeze(data);
            }
        }
    };
}


export function loadCountryLandingPageInfo() {
    return async (dispatch, getState) => {
        const country = exports.getCurrentCountry(getState());
        if (country && country.code) {
            const { data } = await axios.get(`/api/landing/${country.code.toUpperCase()}/`);
            dispatch({ type: 'SET_COUNTRY_COVER_DATA', cover: data });
        }
    };
}

export function loadCurrentCountryDistrictsProject() {
    return async (dispatch, getState) => {
        const country = exports.getCurrentCountry(getState());
        if (country && country.id) {
            const { data } = await axios.get(`/api/projects/by-view/map/${country.id}/`);
            dispatch({ type: 'SET_CURRENT_COUNTRY_DISTRICT_PROJECTS', projects: data });
        }
    };
}

export function loadCountryProjectsOrAll(countryId) {
    return async (dispatch) => {
        const url = ['/api/projects/by-view/list/'];
        if (countryId) {
            url.push(`${countryId}/`);
        }
        const { data } = await axios.get(url.join(''));
        dispatch({ type: 'SET_CURRENT_COUNTRY_PROJECTS', projects: data });
    };
}

export function loadCurrentCountryProjects() {
    return async (dispatch, getState) => {
        const country = exports.getCurrentCountry(getState());
        if (country) {
            dispatch(exports.loadCountryProjectsOrAll(country.id));
        }
    };
}

export function setCurrentCountry(id, waitFor = []) {
    return async (dispatch, getState) => {
        const currentId = getState().countries.currentCountry;
        if (id && id !== currentId) {
            dispatch({ type: 'SET_CURRENT_COUNTRY', country: id });
            const promiseCollection = {};
            promiseCollection.countryFields = dispatch(exports.loadCountryFields(id));
            promiseCollection.mapData = dispatch(exports.loadCountryMapData());
            promiseCollection.landingPage = dispatch(exports.loadCountryLandingPageInfo());
            promiseCollection.districts = dispatch(exports.loadCurrentCountryDistrictsProject());
            return Promise.all(waitFor.map(name => promiseCollection[name]));
        }
        return Promise.resolve();
    };
}

export function setCurrentCountryFromCode(code) {
    return async (dispatch, getState) => {
        const country = getState().countries.list.find(c => c.code.toLocaleLowerCase() === code.toLocaleLowerCase());
        if (country && country.id) {
            dispatch(exports.setCurrentCountry(country.id, ['landingPage']));
        }
        else {
            dispatch({ type: 'UNSET_CURRENT_COUNTRY' });
        }
    };
}

export async function csvExport(ids) {
    const { data } = await axios.post('/api/projects/csv-export/', ids);
    return data;
}

// Reducers

export default function system(state = stateDefinition, action) {
    switch (action.type) {
    case 'SET_COUNTRIES_LIST': {
        return { ...state, list: action.countries };
    }
    case 'SET_CURRENT_COUNTRY': {
        return { ...state, currentCountry: action.country };
    }
    case 'UNSET_CURRENT_COUNTRY': {
        return { ...state, currentCountry: null, currentCountryCoverPage: {} };
    }
    case 'SET_COUNTRY_COVER_DATA': {
        return { ...state, currentCountryCoverPage: action.cover };
    }
    case 'UPDATE_COUNTRY_FIELDS_LIST': {
        return { ...state, countryFields: unionBy(action.fields, state.countryFields, 'id') };
    }
    case 'SET_CURRENT_COUNTRY_PROJECTS': {
        return { ...state, currentCountryProjects: action.projects };
    }
    case 'SET_CURRENT_COUNTRY_DISTRICT_PROJECTS': {
        return { ...state, currentCountryDistrictsProjects: action.projects };
    }
    default:
        return state;
    }
}

