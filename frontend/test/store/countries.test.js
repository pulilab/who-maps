import * as CountriesModule from '../../src/store/modules/countries';
import * as SystemModule from '../../src/store/modules/system';
import * as ProjectModule from '../../src/store/modules/projects';
import * as language from '../../src/plugins/language';
import { A, defaultAxiosSuccess, dispatch, getState } from '../testUtilities';
import axios from '../../src/plugins/axios';

describe('Countries Store Module', () => {
  describe('GETTERS', () => {
    test('getCountry', () => {
      const state = {
        countries: {
          list: [{ id: 1, name: 1 }, { id: 2, name: 2 }]
        }
      };
      const result = CountriesModule.getCountry(state, 1);
      expect(result.name).toBe(1);
    });

    test('getCountriesList', () => {
      const state = {
        countries: {
          list: [{ id: 1, name: 'b-b', code: 'EN' }, { id: 2, name: 'a-a', code: 'HU' }]
        }
      };
      let result = CountriesModule.getCountriesList(state);
      expect(result[0].prettyName).toEqual('b b');
      expect(result[0].code).toEqual('en');
      expect(result[0].flag).toEqual('/static/flags/en.png');

      result = CountriesModule.getCountriesList({ countries: {} });
      expect(result).toEqual([]);
    });

    test('getCountryFields', () => {
      const state = {
        countries: {
          currentCountry: 1,
          countryFields: [{ country: 1, id: 3 }, { country: 2, id: 1 }, { country: 1, id: 2 }]
        }
      };
      const result = CountriesModule.getCountryFields(state);
      expect(result[0].id).toBe(3);
      expect(result).not.toContain({ country: 2, id: 1 });
    });

    test('getCurrentCountry', () => {
      const state = {
        countries: {
          currentCountry: 1,
          list: [{ id: 1, name: 'b-b', code: 'EN' }, { id: 2, name: 'a-a', code: 'HU' }]
        }
      };
      const result = CountriesModule.getCurrentCountry(state);
      expect(result.id).toBe(1);
    });

    test('getCountryCoverPage', () => {
      jest.spyOn(SystemModule, 'getLandingPageDefaults').mockReturnValue({
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

    test('getCountryCoverPicture', () => {
      const spy = jest.spyOn(CountriesModule, 'getCountryCoverPage').mockReturnValue({});
      let result = CountriesModule.getCountryCoverPicture({});
      expect(result).toBe(null);
      expect(CountriesModule.getCountryCoverPage).toHaveBeenCalled();

      spy.mockReturnValue({ cover: '1' });
      result = CountriesModule.getCountryCoverPicture({});
      expect(result.background).toEqual('url(1) 0 0');
      expect(CountriesModule.getCountryCoverPage).toHaveBeenCalled();
    });

    test('getCountriesLib', () => {
      const state = {
        countries: {
          list: [{ id: 'a', name: 1 }, { id: 'b', name: 2 }]
        }
      };
      const result = CountriesModule.getCountriesLib(state);
      expect(result.a).toBe(1);
    });

    test('getCurrentCountrySubLevelNames', () => {
      const map_data = {
        first_sub_level: {
          name: 'a'
        },
        second_sub_level: {
          name: 'b'
        }
      };
      const spy = jest.spyOn(CountriesModule, 'getCurrentCountry').mockReturnValue({ map_data });
      const subLevelTypes = [{ name: 'a', displayName: 'A' }, { name: 'b', displayName: 'B' }];
      jest.spyOn(SystemModule, 'getSubLevelTypes').mockReturnValue(subLevelTypes);
      let result = CountriesModule.getCurrentCountrySubLevelNames({});
      expect(CountriesModule.getCurrentCountry).toHaveBeenCalled();
      expect(result).toEqual(['A', 'B']);

      map_data.first_sub_level.name = 'c';
      map_data.second_sub_level.name = 'c';
      spy.mockReturnValue({ map_data });
      result = CountriesModule.getCurrentCountrySubLevelNames({});
      expect(CountriesModule.getCurrentCountry).toHaveBeenCalled();
      expect(result).toEqual(['c', 'c']);

      spy.mockReturnValue({});
      result = CountriesModule.getCurrentCountrySubLevelNames({});
      expect(CountriesModule.getCurrentCountry).toHaveBeenCalled();
      expect(result).toEqual(['', '']);

      expect(SystemModule.getSubLevelTypes).toHaveBeenCalledTimes(3);
    });

    test('getCurrentCountryFirstSubLevel', () => {
      jest.spyOn(language, 'getCurrentLanguage').mockReturnValue('pt');
      const spy = jest.spyOn(CountriesModule, 'getCurrentCountry').mockReturnValue({
        map_data: {
          first_sub_level: {
            elements: [
              { name: 1, 'name:en': 1, 'name:fr': 2, 'name:pt': 2 },
              { name: 2, 'name:en': 2, 'name:fr': 3 },
              { name: 66 }
            ]
          }
        }
      });

      let result = CountriesModule.getCurrentCountryFirstSubLevel({});
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe(2);

      expect(result[1].id).toBe(2);
      expect(result[1].name).toBe(2);

      expect(result[2].id).toBe(66);
      expect(result[2].name).toBe(66);

      expect(language.getCurrentLanguage).toHaveBeenCalled();
      expect(CountriesModule.getCurrentCountry).toHaveBeenCalled();

      spy.mockReturnValue({});
      result = CountriesModule.getCurrentCountryFirstSubLevel({});
      expect(result).toEqual([]);
    });

    test('getCurrentCountrySecondSubLevel', () => {
      jest.spyOn(language, 'getCurrentLanguage').mockReturnValue('pt');
      const spy = jest.spyOn(CountriesModule, 'getCurrentCountry').mockReturnValue({
        map_data: {
          second_sub_level: {
            elements: [
              { name: 1, 'name:en': 1, 'name:fr': 2, 'name:pt': 2 },
              { name: 2, 'name:en': 2, 'name:fr': 3 },
              { name: 66 }
            ]
          }
        }
      });

      let result = CountriesModule.getCurrentCountrySecondSubLevel({});
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe(2);

      expect(result[1].id).toBe(2);
      expect(result[1].name).toBe(2);

      expect(result[2].id).toBe(66);
      expect(result[2].name).toBe(66);

      expect(language.getCurrentLanguage).toHaveBeenCalled();
      expect(CountriesModule.getCurrentCountry).toHaveBeenCalled();

      spy.mockReturnValue({});
      result = CountriesModule.getCurrentCountrySecondSubLevel({});
      expect(result).toEqual([]);
    });

    test('getCurrentCountryFacilityList', () => {
      const spy = jest.spyOn(CountriesModule, 'getCurrentCountry').mockReturnValue({});
      let result = CountriesModule.getCurrentCountryFacilityList({});
      expect(result).toEqual([]);

      spy.mockReturnValue({ map_data: {} });
      result = CountriesModule.getCurrentCountryFacilityList({});
      expect(result).toEqual([]);

      spy.mockReturnValue({ map_data: { facilities: [1] } });
      result = CountriesModule.getCurrentCountryFacilityList({});
      expect(result).toEqual([1]);
    });

    test('getCurrentCountryMapData', () => {
      jest.spyOn(CountriesModule, 'getCurrentCountry').mockReturnValue({ code: 'en' });
      jest.spyOn(CountriesModule, 'getCurrentCountryFirstSubLevel').mockReturnValue(2);
      CountriesModule.mapData.en = 1;
      const result = CountriesModule.getCurrentCountryMapData({});
      expect(result.mapData).toBe(1);
      expect(result.districts).toBe(2);

      expect(CountriesModule.getCurrentCountry).toHaveBeenCalled();
      expect(CountriesModule.getCurrentCountryFirstSubLevel).toHaveBeenCalled();
    });

    test('getCurrentCountryDistrictProjects', () => {
      jest.spyOn(ProjectModule, 'isMemberOrViewer').mockReturnValue({ member: true, viewer: false, team: true });
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

    test('getCurrentCountryProjects', () => {
      jest.spyOn(ProjectModule, 'isMemberOrViewer').mockReturnValue({ member: true, viewer: false, team: true });
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
    test('loadCountries', A(async () => {
      const spy = jest.spyOn(axios, 'get').mockReturnValue({ data: [{ name: 'b' }, { name: 'a' }] });
      let state = getState({
        countries: {
          list: []
        }
      });
      await CountriesModule.loadCountries()(dispatch, state);
      expect(axios.get).toHaveBeenCalledWith('/api/countries/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_COUNTRIES_LIST', countries: [{ name: 'a' }, { name: 'b' }] });

      spy.mockClear();
      dispatch.mockClear();
      state = getState({
        countries: {
          list: [1]
        }
      });

      await CountriesModule.loadCountries()(dispatch, state);
      expect(axios.get).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
    }));

    test('loadCountryFields', A(async () => {
      jest.spyOn(axios, 'get').mockReturnValue({ data: [{ id: 2 }, { id: 1 }] });
      const state = getState({
        countries: {
          countryFields: [{ country: 1 }]
        }
      });
      dispatch.mockClear();
      await CountriesModule.loadCountryFields(1)(dispatch, state);
      expect(axios.get).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();

      await CountriesModule.loadCountryFields(2)(dispatch, state);
      expect(axios.get).toHaveBeenCalledWith('/api/country-fields/2/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_COUNTRY_FIELDS_LIST', fields: [{ id: 1 }, { id: 2 }] });
    }));

    test('loadCountryMapData', A(async () => {
      jest.spyOn(CountriesModule, 'getCurrentCountry').mockReturnValue({ code: 'hu' });
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
      jest.spyOn(axios, 'get').mockReturnValue(Promise.resolve({ data }));
      CountriesModule.mapData.hu = undefined;
      await CountriesModule.loadCountryMapData()(dispatch, getStateSpy);
      expect(getStateSpy).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith('/static/country-geodata/hu.json');

      axios.get.mockClear();
      CountriesModule.mapData.hu = data;
      await CountriesModule.loadCountryMapData()(dispatch, getStateSpy);
      expect(axios.get).not.toHaveBeenCalled();
    }));

    test('loadCountryLandingPageInfo', A(async () => {
      const getStateSpy = getState({});
      jest.spyOn(axios, 'get').mockReturnValue(defaultAxiosSuccess);
      const spy = jest.spyOn(CountriesModule, 'getCurrentCountry').mockReturnValue(undefined);

      dispatch.mockClear();
      await CountriesModule.loadCountryLandingPageInfo()(dispatch, getStateSpy);
      expect(getStateSpy).toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
      expect(axios.get).not.toHaveBeenCalled();

      spy.mockReturnValue({ code: 'hu' });
      await CountriesModule.loadCountryLandingPageInfo()(dispatch, getStateSpy);
      expect(getStateSpy).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith('/api/landing/HU/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_COUNTRY_COVER_DATA', cover: 1 });
    }));

    test('loadCurrentCountryDistrictsProject', A(async () => {
      const spy = jest.spyOn(CountriesModule, 'getCurrentCountry').mockReturnValue(undefined);;
      const getStateSpy = getState({});
      axios.get = jest.fn().mockReturnValue(defaultAxiosSuccess);

      dispatch.mockClear();

      await CountriesModule.loadCurrentCountryDistrictsProject()(dispatch, getStateSpy);
      expect(getStateSpy).toHaveBeenCalled();
      expect(axios.get).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();

      spy.mockReturnValue({ id: 1 });
      await CountriesModule.loadCurrentCountryDistrictsProject()(dispatch, getStateSpy);
      expect(getStateSpy).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith('/api/projects/by-view/map/1/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_CURRENT_COUNTRY_DISTRICT_PROJECTS', projects: 1 });
    }));

    test('loadCountryProjectsOrAll', A(async () => {
      jest.spyOn(axios, 'get').mockReturnValue(defaultAxiosSuccess);

      await CountriesModule.loadCountryProjectsOrAll()(dispatch);
      expect(axios.get).toHaveBeenCalledWith('/api/projects/by-view/list/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_CURRENT_COUNTRY_PROJECTS', projects: 1 });

      await CountriesModule.loadCountryProjectsOrAll(1)(dispatch);
      expect(axios.get).toHaveBeenCalledWith('/api/projects/by-view/list/1/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_CURRENT_COUNTRY_PROJECTS', projects: 1 });
    }));

    test('loadCurrentCountryProjects', A(async () => {
      const getStateSpy = getState({});
      const currentSpy = jest.spyOn(CountriesModule, 'getCurrentCountry').mockReturnValue(undefined);
      jest.spyOn(CountriesModule, 'loadCountryProjectsOrAll');
      await CountriesModule.loadCurrentCountryProjects()(dispatch, getStateSpy);
      expect(getStateSpy).toHaveBeenCalled();
      expect(currentSpy).toHaveBeenCalled();
      expect(CountriesModule.loadCountryProjectsOrAll).not.toHaveBeenCalled();

      currentSpy.mockReturnValue({ id: 1 });

      await CountriesModule.loadCurrentCountryProjects()(dispatch, getStateSpy);
      expect(getStateSpy).toHaveBeenCalled();
      expect(currentSpy).toHaveBeenCalled();
      expect(CountriesModule.loadCountryProjectsOrAll).toHaveBeenCalledWith(1);
    }));

    test('setCurrentCountry', A(async () => {
      jest.spyOn(CountriesModule, 'loadCountryFields');
      jest.spyOn(CountriesModule, 'loadCountryMapData');
      jest.spyOn(CountriesModule, 'loadCountryLandingPageInfo');
      jest.spyOn(CountriesModule, 'loadCurrentCountryDistrictsProject');
      let getStateSpy = getState({ countries: {
        currentCountry: null
      } });

      dispatch.mockClear();

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

    test('setCurrentCountryFromCode', A(async () => {
      jest.spyOn(CountriesModule, 'setCurrentCountry');
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

    test('csvExport', A(async () => {
      jest.spyOn(axios, 'post').mockReturnValue(defaultAxiosSuccess);
      const result = await CountriesModule.csvExport(1);
      expect(axios.post).toHaveBeenCalledWith('/api/projects/csv-export/', 1);
      expect(result).toBe(1);
    }));
  });

  describe('REDUCERS', () => {
    test('SET_COUNTRIES_LIST', () => {
      let state = {};
      const action = { type: 'SET_COUNTRIES_LIST', countries: 1 };
      state = CountriesModule.default(state, action);
      expect(state.list).toBe(1);
    });

    test('SET_CURRENT_COUNTRY', () => {
      let state = {};
      const action = { type: 'SET_CURRENT_COUNTRY', country: 1 };
      state = CountriesModule.default(state, action);
      expect(state.currentCountry).toBe(1);
    });

    test('UNSET_CURRENT_COUNTRY', () => {
      let state = {};
      const action = { type: 'UNSET_CURRENT_COUNTRY' };
      state = CountriesModule.default(state, action);
      expect(state.currentCountry).toBe(null);
      expect(state.currentCountryCoverPage).toEqual({});
    });

    test('SET_COUNTRY_COVER_DATA', () => {
      let state = {};
      const action = { type: 'SET_COUNTRY_COVER_DATA', cover: 1 };
      state = CountriesModule.default(state, action);
      expect(state.currentCountryCoverPage).toBe(1);
    });

    test('UPDATE_COUNTRY_FIELDS_LIST', () => {
      let state = {};
      const action = { type: 'UPDATE_COUNTRY_FIELDS_LIST', fields: [1] };
      state = CountriesModule.default(state, action);
      expect(state.countryFields).toEqual([1]);
    });

    test('SET_CURRENT_COUNTRY_PROJECTS', () => {
      let state = {};
      const action = { type: 'SET_CURRENT_COUNTRY_PROJECTS', projects: 1 };
      state = CountriesModule.default(state, action);
      expect(state.currentCountryProjects).toBe(1);
    });

    test('SET_CURRENT_COUNTRY_DISTRICT_PROJECTS', () => {
      let state = {};
      const action = { type: 'SET_CURRENT_COUNTRY_DISTRICT_PROJECTS', projects: 1 };
      state = CountriesModule.default(state, action);
      expect(state.currentCountryDistrictsProjects).toBe(1);
    });
  });
});
