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
            const profileSpy = spyOn(UserModule, 'getProfile').and.returnValue({ country: 1 });
            let result = CountriesModule.getUserCountry({});
            expect(result).toBe(1);

            profileSpy.and.returnValue(undefined);
            result = CountriesModule.getUserCountry({});
            expect(result).toEqual(undefined);

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

        it('getCurrentCountrySubLevelNames', () => {
            const spy = spyOn(CountriesModule, 'getCurrentCountry').and.returnValue({
                map_data: {
                    first_sub_level: {
                        name: 1
                    },
                    second_sub_level: {
                        name: 2
                    }
                }
            });
            let result = CountriesModule.getCurrentCountrySubLevelNames({});
            expect(CountriesModule.getCurrentCountry).toHaveBeenCalled();
            expect(result).toEqual([1, 2]);

            spy.and.returnValue({});
            result = CountriesModule.getCurrentCountrySubLevelNames({});
            expect(CountriesModule.getCurrentCountry).toHaveBeenCalled();
            expect(result).toEqual(['', '']);
        });

        it('getCurrentCountryFirstSubLevel', () => {
            spyOn(language, 'getCurrentLanguage').and.returnValue('pt');
            spyOn(CountriesModule, 'getCurrentCountry').and.returnValue({
                map_data: {
                    first_sub_level: {
                        elements: [
                            { 'name:en': 1, 'name:fr': 2, 'name:pt': 2 },
                            { 'name:en': 2, 'name:fr': 3 },
                            { name: 66 }
                        ]
                    }
                }
            });

            const result = CountriesModule.getCurrentCountryFirstSubLevel({});
            expect(result[0].id).toBe(1);
            expect(result[0].name).toBe(2);

            expect(result[1].id).toBe(2);
            expect(result[1].name).toBe(2);

            expect(result[2].id).toBe(66);
            expect(result[2].name).toBe(66);

            expect(language.getCurrentLanguage).toHaveBeenCalled();
            expect(CountriesModule.getCurrentCountry).toHaveBeenCalled();
        });

        it('getCurrentCountrySecondSubLevel', () => {
            spyOn(language, 'getCurrentLanguage').and.returnValue('pt');
            spyOn(CountriesModule, 'getCurrentCountry').and.returnValue({
                map_data: {
                    second_sub_level: {
                        elements: [
                            { 'name:en': 1, 'name:fr': 2, 'name:pt': 2 },
                            { 'name:en': 2, 'name:fr': 3 },
                            { name: 66 }
                        ]
                    }
                }
            });

            const result = CountriesModule.getCurrentCountrySecondSubLevel({});
            expect(result[0].id).toBe(1);
            expect(result[0].name).toBe(2);

            expect(result[1].id).toBe(2);
            expect(result[1].name).toBe(2);

            expect(result[2].id).toBe(66);
            expect(result[2].name).toBe(66);

            expect(language.getCurrentLanguage).toHaveBeenCalled();
            expect(CountriesModule.getCurrentCountry).toHaveBeenCalled();
        });

        it('getCurrentCountryMapData', () => {
            spyOn(CountriesModule, 'getCurrentCountry').and.returnValue({ code: 'en' });
            spyOn(CountriesModule, 'getCurrentCountryFirstSubLevel').and.returnValue(2);
            CountriesModule.mapData.en = 1;
            const result = CountriesModule.getCurrentCountryMapData({});
            expect(result.mapData).toBe(1);
            expect(result.districts).toBe(2);

            expect(CountriesModule.getCurrentCountry).toHaveBeenCalled();
            expect(CountriesModule.getCurrentCountryFirstSubLevel).toHaveBeenCalled();
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

        it('loadCountryFields', A(async () => {
            spyOn(axios, 'get').and.returnValue(defaultAxiosSuccess);
            const state = getState({
                countries: {
                    countryFields: [{ country: 1 }]
                }
            });
            dispatch.calls.reset();
            await CountriesModule.loadCountryFields(1)(dispatch, state);
            expect(axios.get).not.toHaveBeenCalled();
            expect(dispatch).not.toHaveBeenCalled();

            await CountriesModule.loadCountryFields(2)(dispatch, state);
            expect(axios.get).toHaveBeenCalledWith('/api/country-fields/2/');
            expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_COUNTRY_FIELDS_LIST', fields: 1 });

        }));

        it('loadCountryMapData', A(async () => {
            spyOn(CountriesModule, 'getCurrentCountry').and.returnValue({ code: 'hu' });
            const getStateSpy = getState({});
            const data = {
                objects: {
                    1: {
                        geometries: [{
                            properties: {
                                name: 'name',
                                'name:en': 'name_en',
                                'name:es': 'name_es',
                                'name:fr': 'name_fr',
                                'name:pt': 'name_pt'
                            }
                        }]
                    }
                }
            };
            spyOn(axios, 'get').and.returnValue(Promise.resolve({ data }));
            CountriesModule.mapData.hu = undefined;
            await CountriesModule.loadCountryMapData()(dispatch, getStateSpy);
            expect(getStateSpy).toHaveBeenCalled();
            expect(axios.get).toHaveBeenCalledWith('/static/country-geodata/hu.json');

            axios.get.calls.reset();
            CountriesModule.mapData.hu = data;
            await CountriesModule.loadCountryMapData()(dispatch, getStateSpy);
            expect(axios.get).not.toHaveBeenCalled();

        }));

        it('loadCountryLandingPageInfo', A(async () => {
            const getStateSpy = getState({});
            spyOn(axios, 'get').and.returnValue(defaultAxiosSuccess);
            const spy = spyOn(CountriesModule, 'getCurrentCountry');

            dispatch.calls.reset();
            await CountriesModule.loadCountryLandingPageInfo()(dispatch, getStateSpy);
            expect(getStateSpy).toHaveBeenCalled();
            expect(dispatch).not.toHaveBeenCalled();
            expect(axios.get).not.toHaveBeenCalled();

            spy.and.returnValue({ code: 'hu' });
            await CountriesModule.loadCountryLandingPageInfo()(dispatch, getStateSpy);
            expect(getStateSpy).toHaveBeenCalled();
            expect(axios.get).toHaveBeenCalledWith('/api/landing/HU/');
            expect(dispatch).toHaveBeenCalledWith({ type: 'SET_COUNTRY_COVER_DATA', cover: 1 });
        }));

        it('loadCurrentCountryDistrictsProject', A(async () => {
            const spy = spyOn(CountriesModule, 'getCurrentCountry');
            const getStateSpy = getState({});
            spyOn(axios, 'get').and.returnValue(defaultAxiosSuccess);

            dispatch.calls.reset();

            await CountriesModule.loadCurrentCountryDistrictsProject()(dispatch, getStateSpy);
            expect(getStateSpy).toHaveBeenCalled();
            expect(axios.get).not.toHaveBeenCalled();
            expect(dispatch).not.toHaveBeenCalled();

            spy.and.returnValue({ id: 1 });
            await CountriesModule.loadCurrentCountryDistrictsProject()(dispatch, getStateSpy);
            expect(getStateSpy).toHaveBeenCalled();
            expect(axios.get).toHaveBeenCalledWith('/api/projects/by-view/map/1/');
            expect(dispatch).toHaveBeenCalledWith({ type: 'SET_CURRENT_COUNTRY_DISTRICT_PROJECTS', projects: 1 });

        }));

        it('loadCountryProjectsOrAll', A(async () => {
            spyOn(axios, 'get').and.returnValue(defaultAxiosSuccess);

            await CountriesModule.loadCountryProjectsOrAll()(dispatch);
            expect(axios.get).toHaveBeenCalledWith('/api/projects/by-view/list/');
            expect(dispatch).toHaveBeenCalledWith({ type: 'SET_CURRENT_COUNTRY_PROJECTS', projects: 1 });

            await CountriesModule.loadCountryProjectsOrAll(1)(dispatch);
            expect(axios.get).toHaveBeenCalledWith('/api/projects/by-view/list/1/');
            expect(dispatch).toHaveBeenCalledWith({ type: 'SET_CURRENT_COUNTRY_PROJECTS', projects: 1 });
        }));

        it('loadCurrentCountryProjects', A(async () => {
            const getStateSpy = getState({});
            const currentSpy = spyOn(CountriesModule, 'getCurrentCountry');
            spyOn(CountriesModule, 'loadCountryProjectsOrAll');
            await CountriesModule.loadCurrentCountryProjects()(dispatch, getStateSpy);
            expect(getStateSpy).toHaveBeenCalled();
            expect(currentSpy).toHaveBeenCalled();
            expect(CountriesModule.loadCountryProjectsOrAll).not.toHaveBeenCalled();

            currentSpy.and.returnValue({ id: 1 });

            await CountriesModule.loadCurrentCountryProjects()(dispatch, getStateSpy);
            expect(getStateSpy).toHaveBeenCalled();
            expect(currentSpy).toHaveBeenCalled();
            expect(CountriesModule.loadCountryProjectsOrAll).toHaveBeenCalledWith(1);
        }));

        it('setCurrentCountry', A(async () => {
            spyOn(CountriesModule, 'loadCountryFields');
            spyOn(CountriesModule, 'loadCountryMapData');
            spyOn(CountriesModule, 'loadCountryLandingPageInfo');
            spyOn(CountriesModule, 'loadCurrentCountryDistrictsProject');
            let getStateSpy = getState({ countries: {
                    currentCountry: null
                } });

            dispatch.calls.reset();

            await CountriesModule.setCurrentCountry()(dispatch, getStateSpy);
            expect(getStateSpy).toHaveBeenCalled();
            expect(dispatch).not.toHaveBeenCalled();
            expect(CountriesModule.loadCountryFields).not.toHaveBeenCalled();
            expect(CountriesModule.loadCountryMapData).not.toHaveBeenCalled();
            expect(CountriesModule.loadCountryLandingPageInfo).not.toHaveBeenCalled();
            expect(CountriesModule.loadCurrentCountryDistrictsProject).not.toHaveBeenCalled();

            getStateSpy = getState({ countries: {
                    currentCountry: 1
                } });

            await CountriesModule.setCurrentCountry(1)(dispatch, getStateSpy);
            expect(getStateSpy).toHaveBeenCalled();
            expect(dispatch).not.toHaveBeenCalled();
            expect(CountriesModule.loadCountryFields).not.toHaveBeenCalled();
            expect(CountriesModule.loadCountryMapData).not.toHaveBeenCalled();
            expect(CountriesModule.loadCountryLandingPageInfo).not.toHaveBeenCalled();
            expect(CountriesModule.loadCurrentCountryDistrictsProject).not.toHaveBeenCalled();


            await CountriesModule.setCurrentCountry(2, ['countryFields'])(dispatch, getStateSpy);
            expect(getStateSpy).toHaveBeenCalled();
            expect(dispatch).toHaveBeenCalledWith({ type: 'SET_CURRENT_COUNTRY', country: 2 });
            expect(CountriesModule.loadCountryFields).toHaveBeenCalled();
            expect(CountriesModule.loadCountryMapData).toHaveBeenCalled();
            expect(CountriesModule.loadCountryLandingPageInfo).toHaveBeenCalled();
            expect(CountriesModule.loadCurrentCountryDistrictsProject).toHaveBeenCalled();

        }));


        it('setCurrentCountryFromCode', A(async () => {
            spyOn(CountriesModule, 'setCurrentCountry');
            const getStateSpy = getState({ countries: {
                    list: [{ code: 'hu', id: 1 }]
                } });

            await CountriesModule.setCurrentCountryFromCode('en')(dispatch, getStateSpy);
            expect(getStateSpy).toHaveBeenCalled();
            expect(CountriesModule.setCurrentCountry).not.toHaveBeenCalled();
            expect(dispatch).toHaveBeenCalledWith({ type: 'UNSET_CURRENT_COUNTRY' });


            await CountriesModule.setCurrentCountryFromCode('hu')(dispatch, getStateSpy);
            expect(getStateSpy).toHaveBeenCalled();
            expect(dispatch).toHaveBeenCalled();
            expect(CountriesModule.setCurrentCountry).toHaveBeenCalledWith(1, ['landingPage']);
        }));

        it('csvExport', A(async () => {
            spyOn(axios, 'post').and.returnValue(defaultAxiosSuccess);
            const result = await CountriesModule.csvExport(1);
            expect(axios.post).toHaveBeenCalledWith('/api/projects/csv-export/', 1);
            expect(result).toBe(1);

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
