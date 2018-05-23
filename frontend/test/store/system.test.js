import * as SystemModule from '../../src/store/modules/system';
import * as ProjectModule from '../../src/store/modules/projects';
import { A, defaultAxiosSuccess, dispatch } from '../testUtilities';
import axios from '../../src/plugins/axios';
import * as CountriesModule from '../../src/store/modules/countries';

/* global  it, describe, expect, beforeEach, afterEach, spyOn, Promise */

describe('System Store Module', () => {
  describe('GETTERS', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    test('getUserProfiles fn.', () => {
      const state = {
        system: {
          profiles: undefined
        }
      };
      let result = SystemModule.getUserProfiles(state);
      expect(result).toEqual([]);

      state.system.profiles = [1];
      result = SystemModule.getUserProfiles(state);
      expect(result).toEqual([1]);
    });

    test('getSearchResult fn.', () => {
      jest.spyOn(CountriesModule, 'getCountry').mockReturnValue(undefined);
      const state = {
        system: {
          projectSearch: undefined
        }
      };
      let result = SystemModule.getSearchResult(state);
      expect(result).toEqual([]);

      state.system.projectSearch = [{ id: 1 }];
      jest.spyOn(ProjectModule, 'isMemberOrViewer').mockReturnValue({ isMember: true });
      result = SystemModule.getSearchResult(state);
      expect(result).toEqual([{ id: 1, isMember: true, country_name: '' }]);
    });

    test('getLanguages', () => {
      const state = {
        system: {
          languages: [{ flag: '1' }]
        }
      };
      const result = SystemModule.getLanguages(state);
      expect(result[0].flag).toBe('/static/flags/1');
    });

    test('getSearchFilters', () => {
      const state = {
        system: {
          search_filters: [1, 2, 3]
        }
      };
      const result = SystemModule.getSearchFilters(state);
      expect(result).not.toBe(state.system.search_filters);
      expect(result).toEqual(state.system.search_filters);
    });

    test('getLandingPageDefaults', () => {
      const state = {
        system: {
          landing_page_defaults: {}
        }
      };
      const result = SystemModule.getLandingPageDefaults(state);
      expect(result).not.toBe(state.system.landing_page_defaults);
      expect(result).toEqual(state.system.landing_page_defaults);
    });

    test('getAxis', () => {
      const state = {
        system: {
          axis: [1, 2, 3]
        }
      };
      const result = SystemModule.getAxis(state);
      expect(result).not.toBe(state.system.axis);
      expect(result).toEqual(state.system.axis);
    });

    test('getDomains', () => {
      const state = {
        system: {
          domains: [1, 2, 3]
        }
      };
      const result = SystemModule.getDomains(state);
      expect(result).not.toBe(state.system.domains);
      expect(result).toEqual(state.system.domains);
    });

    test('getQuestions', () => {
      const state = {
        system: {
          toolkit_questions: [1, 2, 3]
        }
      };
      const result = SystemModule.getQuestions(state);
      expect(result).not.toBe(state.system.toolkit_questions);
      expect(result).toEqual(state.system.toolkit_questions);
    });

    test('getThematicOverview', () => {
      const state = {
        system: {
          thematic_overview: {
            categories: [{ id: 1 }],
            sub_categories: [{ category: 1, name: 1 }]
          }
        }
      };
      const result = SystemModule.getThematicOverview(state);
      expect(result).not.toBe(state.system.thematic_overview.categories);
      expect(result[0].id).toBe(1);
      expect(result[0].domains[0].name).toBe(1);
    });

    test('getDomainsForThematic', () => {
      jest.spyOn(SystemModule, 'getAxis').mockReturnValue([{ id: 1, name: 'notFirst', domains: [] }]);
      jest.spyOn(SystemModule, 'getDomains').mockReturnValue([{ id: 2, axis: 1, name: 'd' }]);
      jest.spyOn(SystemModule, 'getThematicOverview').mockReturnValue([{ name: 'first', domains: [] }]);
      const result = SystemModule.getDomainsForThematic({});
      expect(result[0].name).toBe('first');
      expect(result[1].name).toBe('notFirst');
      expect(result[1].domains[0]).toEqual({ name: 'd' });

      expect(SystemModule.getAxis).toHaveBeenCalled();
      expect(SystemModule.getDomains).toHaveBeenCalled();
      expect(SystemModule.getThematicOverview).toHaveBeenCalled();
    });

    test('getSubLevelTypes', () => {
      const state = {
        system: {
          sub_level_types: [{ a: 1 }]
        }
      };
      const result = SystemModule.getSubLevelTypes(state);
      expect(result).toEqual(state.system.sub_level_types);
      expect(result).not.toBe(state.system.sub_level_types);
    });
  });

  describe('ACTIONS', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    test('loadUserProfiles fn', A(async () => {
      jest.spyOn(axios, 'get').mockReturnValue(defaultAxiosSuccess);
      await SystemModule.loadUserProfiles()(dispatch);
      expect(axios.get).toHaveBeenCalledWith('/api/userprofiles/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_USER_PROFILES', profiles: 1 });
    }));

    test('loadStaticData', A(async () => {
      jest.spyOn(axios, 'get').mockReturnValue(defaultAxiosSuccess);
      await SystemModule.loadStaticData()(dispatch);
      expect(axios.get).toHaveBeenCalledWith('/api/static-data/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_LANGUAGES', languages: undefined });
    }));

    test('searchProjects', A(async () => {
      jest.spyOn(axios, 'post').mockReturnValue(defaultAxiosSuccess);
      await SystemModule.searchProjects('a', { a: { name: 'b', value: 2 } })(dispatch);
      expect(axios.post).toHaveBeenCalledWith('/api/search/projects/', { query: 'a', b: 2 });
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PROJECT_SEARCH_RESULT', projects: 1 });
    }));

    test('unsetSearchedProjects', A(async () => {
      await SystemModule.unsetSearchedProjects()(dispatch);
      expect(dispatch).toHaveBeenCalledWith({ type: 'UNSET_PROJECT_SEARCH_RESULT' });
    }));

    test('searchOrganisation', A(async () => {
      jest.spyOn(axios, 'get').mockReturnValue(defaultAxiosSuccess);
      const result = await SystemModule.searchOrganisation('a');
      expect(axios.get).toHaveBeenCalledWith('/api/organisations/?name=a');
      expect(result).toBe(1);
    }));

    test('addOrganisation', A(async () => {
      jest.spyOn(axios, 'post').mockReturnValue(defaultAxiosSuccess);
      const result = await SystemModule.addOrganisation('a');
      expect(axios.post).toHaveBeenCalledWith('/api/organisations/', { name: 'a' });
      expect(result).toBe(1);
    }));
  });

  describe('REDUCERS', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });
    test('SET_USER_PROFILES', () => {
      let state = {};
      const action = { type: 'SET_USER_PROFILES', profiles: 1 };
      state = SystemModule.default(state, action);
      expect(state.profiles).toBe(1);
    });

    test('SET_PROJECT_SEARCH_RESULT', () => {
      let state = {};
      const action = { type: 'SET_PROJECT_SEARCH_RESULT', projects: 1 };
      state = SystemModule.default(state, action);
      expect(state.projectSearch).toBe(1);
    });

    test('UNSET_PROJECT_SEARCH_RESULT', () => {
      let state = {};
      const action = { type: 'UNSET_PROJECT_SEARCH_RESULT' };
      state = SystemModule.default(state, action);
      expect(state.projectSearch).toEqual([]);
    });

    test('SET_LANGUAGES', () => {
      let state = {};
      const action = { type: 'SET_LANGUAGES', languages: 1 };
      state = SystemModule.default(state, action);
      expect(state.languages).toEqual(1);
    });

    test('SET_AXIS', () => {
      let state = {};
      const action = { type: 'SET_AXIS', axis: 1 };
      state = SystemModule.default(state, action);
      expect(state.axis).toEqual(1);
    });

    test('SET_DOMAINS', () => {
      let state = {};
      const action = { type: 'SET_DOMAINS', domains: 1 };
      state = SystemModule.default(state, action);
      expect(state.domains).toEqual(1);
    });

    test('SET_LANDING_PAGE_DEFAULTS', () => {
      let state = {};
      const action = { type: 'SET_LANDING_PAGE_DEFAULTS', landing_page_defaults: 1 };
      state = SystemModule.default(state, action);
      expect(state.landing_page_defaults).toEqual(1);
    });

    test('SET_SEARCH_FILTERS', () => {
      let state = {};
      const action = { type: 'SET_SEARCH_FILTERS', search_filters: 1 };
      state = SystemModule.default(state, action);
      expect(state.search_filters).toEqual(1);
    });

    test('SET_THEMATIC_OVERVIEW', () => {
      let state = {};
      const action = { type: 'SET_THEMATIC_OVERVIEW', thematic_overview: 1 };
      state = SystemModule.default(state, action);
      expect(state.thematic_overview).toEqual(1);
    });

    test('SET_TOOLKIT_QUESTIONS', () => {
      let state = {};
      const action = { type: 'SET_TOOLKIT_QUESTIONS', toolkit_questions: 1 };
      state = SystemModule.default(state, action);
      expect(state.toolkit_questions).toEqual(1);
    });
  });
});
