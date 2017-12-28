import * as CountriesModule from '../../src/store/modules/countries';
import * as UserModule from '../../src/store/modules/user';
import * as SystemModule from '../../src/store/modules/system';
import * as ProjectModule from '../../src/store/modules/projects';
import * as language from '../../src/plugins/language';
import { A, defaultAxiosSuccess, dispatch, getState } from '../testUtilities';
import axios from '../../src/plugins/axios';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise, FormData */

describe('Countries Store Module', () => {


    describe('GETTERS', () => {

        it('userCountryObject', () => {
            const state = {
                user: {
                    profile: {
                        country: 1
                    }
                },
                countries: {
                    list: [{ name: 1 }]
                }
            };
            let result = CountriesModule.userCountryObject(state);
            expect(result.name).toBe(1);

            result = CountriesModule.userCountryObject({});
            expect(result).toBe(null);
        });

        it('getCountry', () => {
            const state = {
                countries: {
                    list: [{ id: 1, name: 1 }, { id: 2, name: 2 }]
                }
            };
            const result = CountriesModule.getCountry(state, 1);
            expect(result.name).toBe(1);
        });

        it('getCountriesList', () => {
            const state = {
                countries: {
                    list: [{ id: 1, name: 'b-b', code: 'EN' }, { id: 2, name: 'a-a', code: 'HU' }]
                }
            };
            let result = CountriesModule.getCountriesList(state);
            expect(result[0].prettyName).toEqual('a a');
            expect(result[0].code).toEqual('hu');
            expect(result[0].flag).toEqual('/static/flags/hu.png');

            result = CountriesModule.getCountriesList({ countries: {} });
            expect(result).toEqual([]);
        });

        it('getUserCountry', () => {
            spyOn(UserModule, 'getProfile').and.returnValue({ country: 1 });
            const listSpy = spyOn(CountriesModule, 'getCountriesList').and.returnValue([{ name: 1 }]);
            let result = CountriesModule.getUserCountry({});
            expect(result.name).toBe(1);

            listSpy.and.returnValue([{ name: 2, prettyName: 1 }]);
            result = CountriesModule.getUserCountry({});
            expect(result.name).toBe(2);
        });

        it('getCountryFields', () => {
            const state = {
                countries: {
                    currentCountry: 1,
                    countryFields: [{ country: 1, id: 3 }, { country: 2, id: 1 }, { country:1, id: 2 }]
                }
            };
            const result = CountriesModule.getCountryFields(state);
            expect(result[0].id).toBe(2);
            expect(result).not.toContain({ country: 2, id: 1 });
        });

        it('getCurrentCountry', () => {
            const state = {
                countries: {
                    currentCountry: 1,
                    list: [{ id: 1, name: 'b-b', code: 'EN' }, { id: 2, name: 'a-a', code: 'HU' }]
                }
            };
            const result = CountriesModule.getCurrentCountry(state);
            expect(result.id).toBe(1);
        });

        it('getCountryCoverPage', () => {
            spyOn(SystemModule, 'getLandingPageDefaults').and.returnValue({
                a: 3,
                b: 2,
                default_partners: ['a']
            });
            const state = {
                countries: {
                    currentCountryCoverPage: {
                        a: 1,
                        b: null,
                        partner_logos: [1]
                    }
                }
            };
            const result = CountriesModule.getCountryCoverPage(state);
            expect(result.a).toBe(1);
            expect(result.b).toBe(2);
            expect(result.partners).toEqual(['a', 1]);
        });

        it('getCountryCoverPicture', () => {
            const spy = spyOn(CountriesModule, 'getCountryCoverPage').and.returnValue({});
            let result = CountriesModule.getCountryCoverPicture({});
            expect(result).toBe(null);
            expect(CountriesModule.getCountryCoverPage).toHaveBeenCalled();

            spy.and.returnValue({ cover: '1' });
            result = CountriesModule.getCountryCoverPicture({});
            expect(result.background).toEqual('url(1) 0 0');
            expect(CountriesModule.getCountryCoverPage).toHaveBeenCalled();
        });

        it('getCountriesLib', () => {
            const state = {
                countries: {
                    list: [{ id: 'a', name: 1 }, { id: 'b', name: 2 }]
                }
            };
            const result = CountriesModule.getCountriesLib(state);
            expect(result.a).toBe(1);
        });

        it('getCurrentCountryDistricts', () => {
            spyOn(language, 'getCurrentLanguage').and.returnValue('pt');
            const state = {
                countries: {
                    currentCountryDistricts: [{ en: 1, fr: 2, pt: 2 }, { en: 2, fr: 3 }, { name: 66 }]
                }
            };
            const result = CountriesModule.getCurrentCountryDistricts(state);
            expect(result[0].id).toBe(1);
            expect(result[0].name).toBe(2);

            expect(result[1].id).toBe(2);
            expect(result[1].name).toBe(2);

            expect(result[2].id).toBe(66);
            expect(result[2].name).toBe(66);

            expect(language.getCurrentLanguage).toHaveBeenCalled();
        });

        it('getCurrentCountryMapData', () => {
            spyOn(CountriesModule, 'getCurrentCountry').and.returnValue({ code: 'en' });
            spyOn(CountriesModule, 'getCurrentCountryDistricts').and.returnValue(2);
            CountriesModule.mapData.en = 1;
            const result = CountriesModule.getCurrentCountryMapData({});
            expect(result.mapData).toBe(1);
            expect(result.districts).toBe(2);

            expect(CountriesModule.getCurrentCountry).toHaveBeenCalled();
            expect(CountriesModule.getCurrentCountryDistricts).toHaveBeenCalled();
        });

        it('getCurrentCountryDistrictProjects', () => {
            spyOn(ProjectModule, 'isMemberOrViewer').and.returnValue({ member: true, viewer: false, team: true });
            const state = {
                countries: {
                    currentCountryDistrictsProjects: {
                        a: [{}]
                    }
                }
            };
            const result = CountriesModule.getCurrentCountryDistrictProjects(state);
            expect(result.a[0].member).toBe(true);
            expect(ProjectModule.isMemberOrViewer).toHaveBeenCalled();
        });

        it('getCurrentCountryProjects', () => {
            spyOn(ProjectModule, 'isMemberOrViewer').and.returnValue({ member: true, viewer: false, team: true });
            const state = {
                countries: {
                    currentCountryProjects: [{}]
                }
            };
            const result = CountriesModule.getCurrentCountryProjects(state);
            expect(result[0].member).toBe(true);
            expect(ProjectModule.isMemberOrViewer).toHaveBeenCalled();
        });
    });

    describe('ACTIONS', () => {

        it('loadCountries', A(async () => {
            const spy = spyOn(axios, 'get').and.returnValue(defaultAxiosSuccess);
            let state = getState({
                countries: {
                    list: []
                }
            });
            await CountriesModule.loadCountries()(dispatch, state);
            expect(axios.get).toHaveBeenCalledWith('/api/countries/');
            expect(dispatch).toHaveBeenCalledWith({ type: 'SET_COUNTRIES_LIST', countries: 1 });

            spy.calls.reset();
            dispatch.calls.reset();
            state = getState({
                countries: {
                    list: [1]
                }
            });

            await CountriesModule.loadCountries()(dispatch, state);
            expect(axios.get).not.toHaveBeenCalled();
            expect(dispatch).not.toHaveBeenCalled();

        }));


    });

    describe('REDUCERS', () => {

        it('SET_COUNTRIES_LIST', () => {
            let state = {};
            const action = { type: 'SET_COUNTRIES_LIST', countries: 1 };
            state = CountriesModule.default(state, action);
            expect(state.list).toBe(1);
        });

        it('SET_CURRENT_COUNTRY', () => {
            let state = {};
            const action = { type: 'SET_CURRENT_COUNTRY', country: 1 };
            state = CountriesModule.default(state, action);
            expect(state.currentCountry).toBe(1);
        });

        it('UNSET_CURRENT_COUNTRY', () => {
            let state = {};
            const action = { type: 'UNSET_CURRENT_COUNTRY' };
            state = CountriesModule.default(state, action);
            expect(state.currentCountry).toBe(null);
            expect(state.currentCountryCoverPage).toEqual({});
        });

        it('SET_COUNTRY_COVER_DATA', () => {
            let state = {};
            const action = { type: 'SET_COUNTRY_COVER_DATA', cover: 1 };
            state = CountriesModule.default(state, action);
            expect(state.currentCountryCoverPage).toBe(1);
        });

        it('UPDATE_COUNTRY_FIELDS_LIST', () => {
            let state = {};
            const action = { type: 'UPDATE_COUNTRY_FIELDS_LIST', fields: [1] };
            state = CountriesModule.default(state, action);
            expect(state.countryFields).toEqual([1]);
        });

        it('SET_CURRENT_COUNTRY_DISTRICTS', () => {
            let state = {};
            const action = { type: 'SET_CURRENT_COUNTRY_DISTRICTS', districts: 1 };
            state = CountriesModule.default(state, action);
            expect(state.currentCountryDistricts).toBe(1);
        });

        it('SET_CURRENT_COUNTRY_PROJECTS', () => {
            let state = {};
            const action = { type: 'SET_CURRENT_COUNTRY_PROJECTS', projects: 1 };
            state = CountriesModule.default(state, action);
            expect(state.currentCountryProjects).toBe(1);
        });

        it('SET_CURRENT_COUNTRY_DISTRICT_PROJECTS', () => {
            let state = {};
            const action = { type: 'SET_CURRENT_COUNTRY_DISTRICT_PROJECTS', projects: 1 };
            state = CountriesModule.default(state, action);
            expect(state.currentCountryDistrictsProjects).toBe(1);
        });

    });

});
