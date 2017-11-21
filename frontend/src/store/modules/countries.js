/* eslint-disable no-warning-comments */
import axios from '../../plugins/axios';
import unionBy from 'lodash/unionBy';
import forEach from 'lodash/forEach';
import cloneDeep from 'lodash/cloneDeep';
import { country_default_data } from '../static_data/country_static_data';
import * as UserModule from './user';

const stateDefinition = {
    list: [],
    countryFields: [],
    currentCountryDistricts: [],
    currentCountry: null,
    currentCountryCoverPage: {},
    currentCountryProjects: [],
    currentCountryDistrictsProjects: []
};

const mapData = {};

// GETTERS

export const userCountryObject = state => {
    if (state.user && state.user.profile) {
        return state.countries.list.find(c => c.name === state.user.profile.country);
    }
    return null;
};

export const getCountriesList = state => {
    if (state.countries.list) {
        return state.countries.list.map(c=> {
            c = Object.assign({}, c);
            c.code = c.code.toLocaleLowerCase();
            c.flag =  `/static/flags/${c.code}.png`;
            c.prettyName = c.name.split('-').join(' ');
            return c;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }
    return [];
};

export const getCountryFields = state => {
    return state.countries.countryFields.filter(cf =>  cf.country === state.countries.currentCountry);
};

export const getCurrentCountry = state => {
    return Object.assign({}, getCountriesList(state).find(c => c.id === state.countries.currentCountry));
};

export const getCountryCoverPage = state => {
    const countryCover = cloneDeep(state.countries.currentCountryCoverPage);
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
    const country = getCountryCoverPage(state);
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

export const getCurrentCountryDistricts = state => {
    return state.countries.currentCountryDistricts;
};

export const getCurrentCountryMapData = state => {
    const currentCountry = getCurrentCountry(state);
    currentCountry.mapData = mapData[currentCountry.code];
    currentCountry.districts = getCurrentCountryDistricts(state);
    return currentCountry;
};

export const getCurrentCountryDistrictProjects = state => {
    const result = {};
    const districts = state.countries.currentCountryDistrictsProjects;
    const profile = UserModule.getProfile(state);
    for (const d in districts) {
        result[d] = districts[d].map(p => {
            p = Object.assign({}, p);
            if (profile.member && profile.viewer) {
                p.isMember = profile.member.indexOf(p.id) > -1;
                p.isViewer = profile.viewer.indexOf(p.id) > -1;
            }
            return p;
        });
    }
    return result;
};
export const getCurrentCountryProjects = state => {
    const profile = UserModule.getProfile(state);
    return state.countries.currentCountryProjects.map(ccp => {
        ccp = Object.assign({}, ccp);
        if (profile.member && profile.viewer) {
            ccp.isMember = profile.member.indexOf(ccp.id) > -1;
            ccp.isViewer = profile.viewer.indexOf(ccp.id) > -1;
        }
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

export function loadCountryMapDataAndDistricts() {
    return async (dispatch, getState) => {
        const state = getState();
        const country = getCurrentCountry(state);
        if (country && country.code) {
            const countryData = mapData[country.code];
            if (!countryData) {
                const { data } = await axios.get(`/static/country-geodata/${country.code}.json`);
                mapData[country.code] = Object.freeze(data);
            }
            const subKey = Object.keys(mapData[country.code].objects)[0];
            const districts = mapData[country.code].objects[subKey].geometries.map(object => {
                return object.properties['name:en'] || object.properties.name;
            });
            dispatch({ type: 'SET_CURRENT_COUNTRY_DISTRICTS', districts });
        }
    };
}


export function loadCountryLandingPageInfo() {
    return async (dispatch, getState) => {
        const country = getCurrentCountry(getState());
        if (country && country.code) {
            const { data } = await axios.get(`/api/landing/${country.code.toUpperCase()}/`);
            dispatch({ type: 'SET_COUNTRY_COVER_DATA', cover: data });
        }
    };
}

export function loadCurrentCountryDistrictsProject() {
    return async (dispatch, getState) => {
        const country = getCurrentCountry(getState());
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

export function setCurrentCountry(id) {
    return async (dispatch, getState) => {
        const currentId = getState().countries.currentCountry;
        if (id && id !== currentId) {
            dispatch({ type: 'SET_CURRENT_COUNTRY', country: id });
            const cfPromise = dispatch(loadCountryFields(id));
            const dsPromise = dispatch(loadCountryMapDataAndDistricts());
            const lPromise = dispatch(loadCountryLandingPageInfo());
            const dpPromise = dispatch(loadCurrentCountryDistrictsProject());
            return Promise.all([cfPromise, dsPromise, lPromise, dpPromise]);
        }
        return Promise.resolve();
    };
}

export function setCurrentCountryFromCode(code) {
    return async (dispatch, getState) => {
        const country = getState().countries.list.find(c => c.code.toLocaleLowerCase() === code.toLocaleLowerCase());
        if (country && country.id) {
            dispatch(setCurrentCountry(country.id));
        }
    };
}

export async function csvExport(ids) {
    const { data } = await axios.post('/api/projects/csv-export/', ids);
    return data;
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
    case 'SET_COUNTRY_COVER_DATA': {
        s.currentCountryCoverPage = action.cover;
        return Object.assign(state, {}, s);
    }
    case 'UPDATE_COUNTRY_FIELDS_LIST': {
        s.countryFields = unionBy(action.fields, s.countryFields, 'id');
        return Object.assign(state, {}, s);
    }
    case 'SET_CURRENT_COUNTRY_DISTRICTS': {
        s.currentCountryDistricts = action.districts;
        return Object.assign(state, {}, s);
    }
    case 'SET_CURRENT_COUNTRY_PROJECTS': {
        s.currentCountryProjects = action.projects;
        return Object.assign(state, {}, s);
    }
    case 'SET_CURRENT_COUNTRY_DISTRICT_PROJECTS': {
        s.currentCountryDistrictsProjects = action.projects;
        return Object.assign(state, {}, s);
    }
    // case 'SET_MAP_DATA': {
    //     const newMapData = {};
    //     newMapData[action.code] = action.countryData;
    //     s.mapData = Object.assign({}, s.mapData, newMapData);
    //     return Object.assign(state, {}, s);
    // }
    default:
        return state;
    }
}

