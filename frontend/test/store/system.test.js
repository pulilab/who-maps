import * as SystemModule from '../../src/store/modules/system';
import * as ProjectModule from '../../src/store/modules/projects';
import { A, defaultAxiosSuccess, dispatch } from '../testUtilities';
import axios from '../../src/plugins/axios';
import * as CountriesModule from '../../src/store/modules/countries';

/* global  it, describe, expect, beforeEach, afterEach, spyOn, Promise */

describe('System Store Module', () => {
  describe('GETTERS', () => {
    it('getUserProfiles fn.', () => {
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

    it('getSearchResult fn.', () => {
      spyOn(CountriesModule, 'getCountry');
      const state = {
        system: {
          projectSearch: undefined
        }
      };
      let result = SystemModule.getSearchResult(state);
      expect(result).toEqual([]);

      state.system.projectSearch = [{ id: 1 }];
      spyOn(ProjectModule, 'isMemberOrViewer').and.returnValue({ isMember: true });
      result = SystemModule.getSearchResult(state);
      expect(result).toEqual([{ id: 1, isMember: true, country_name: '' }]);
    });

    it('getLanguages', () => {
      const state = {
        system: {
          languages: [{ flag: '1' }]
        }
      };
      const result = SystemModule.getLanguages(state);
      expect(result[0].flag).toBe('/static/flags/1');
    });

    it('getSearchFilters', () => {
      const state = {
        system: {
          search_filters: [1, 2, 3]
        }
      };
      const result = SystemModule.getSearchFilters(state);
      expect(result).not.toBe(state.system.search_filters);
      expect(result).toEqual(state.system.search_filters);
    });

    it('getLandingPageDefaults', () => {
      const state = {
        system: {
          landing_page_defaults: {}
        }
      };
      const result = SystemModule.getLandingPageDefaults(state);
      expect(result).not.toBe(state.system.landing_page_defaults);
      expect(result).toEqual(state.system.landing_page_defaults);
    });

    it('getAxis', () => {
      const state = {
        system: {
          axis: [1, 2, 3]
        }
      };
      const result = SystemModule.getAxis(state);
      expect(result).not.toBe(state.system.axis);
      expect(result).toEqual(state.system.axis);
    });

    it('getDomains', () => {
      const state = {
        system: {
          domains: [1, 2, 3]
        }
      };
      const result = SystemModule.getDomains(state);
      expect(result).not.toBe(state.system.domains);
      expect(result).toEqual(state.system.domains);
    });

    it('getQuestions', () => {
      const state = {
        system: {
          toolkit_questions: [1, 2, 3]
        }
      };
      const result = SystemModule.getQuestions(state);
      expect(result).not.toBe(state.system.toolkit_questions);
      expect(result).toEqual(state.system.toolkit_questions);
    });

    it('getThematicOverview', () => {
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

    it('getDomainsForThematic', () => {
      spyOn(SystemModule, 'getAxis').and.returnValue([{ id: 1, name: 'notFirst', domains: [] }]);
      spyOn(SystemModule, 'getDomains').and.returnValue([{ id: 2, axis: 1, name: 'd' }]);
      spyOn(SystemModule, 'getThematicOverview').and.returnValue([{ name: 'first', domains: [] }]);
      const result = SystemModule.getDomainsForThematic({});
      expect(result[0].name).toBe('first');
      expect(result[1].name).toBe('notFirst');
      expect(result[1].domains[0]).toEqual({ name: 'd' });

      expect(SystemModule.getAxis).toHaveBeenCalled();
      expect(SystemModule.getDomains).toHaveBeenCalled();
      expect(SystemModule.getThematicOverview).toHaveBeenCalled();
    });

    it('getSubLevelTypes', () => {
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
    it('loadUserProfiles fn', A(async () => {
      spyOn(axios, 'get').and.returnValue(defaultAxiosSuccess);
      await SystemModule.loadUserProfiles()(dispatch);
      expect(axios.get).toHaveBeenCalledWith('/api/userprofiles/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_USER_PROFILES', profiles: 1 });
    }));

    it('loadStaticData', A(async () => {
      spyOn(axios, 'get').and.returnValue(defaultAxiosSuccess);
      await SystemModule.loadStaticData()(dispatch);
      expect(axios.get).toHaveBeenCalledWith('/api/static-data/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_LANGUAGES', languages: undefined });
    }));

    it('searchProjects', A(async () => {
      spyOn(axios, 'post').and.returnValue(defaultAxiosSuccess);
      await SystemModule.searchProjects('a', { a: { name: 'b', value: 2 } })(dispatch);
      expect(axios.post).toHaveBeenCalledWith('/api/search/projects/', { query: 'a', b: 2 });
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PROJECT_SEARCH_RESULT', projects: 1 });
    }));

    it('unsetSearchedProjects', A(async () => {
      await SystemModule.unsetSearchedProjects()(dispatch);
      expect(dispatch).toHaveBeenCalledWith({ type: 'UNSET_PROJECT_SEARCH_RESULT' });
    }));

    it('searchOrganisation', A(async () => {
      spyOn(axios, 'get').and.returnValue(defaultAxiosSuccess);
      const result = await SystemModule.searchOrganisation('a');
      expect(axios.get).toHaveBeenCalledWith('/api/organisations/?name=a');
      expect(result).toBe(1);
    }));

    it('addOrganisation', A(async () => {
      spyOn(axios, 'post').and.returnValue(defaultAxiosSuccess);
      const result = await SystemModule.addOrganisation('a');
      expect(axios.post).toHaveBeenCalledWith('/api/organisations/', { name: 'a' });
      expect(result).toBe(1);
    }));
  });

  describe('REDUCERS', () => {
    it('SET_USER_PROFILES', () => {
      let state = {};
      const action = { type: 'SET_USER_PROFILES', profiles: 1 };
      state = SystemModule.default(state, action);
      expect(state.profiles).toBe(1);
    });

    it('SET_PROJECT_SEARCH_RESULT', () => {
      let state = {};
      const action = { type: 'SET_PROJECT_SEARCH_RESULT', projects: 1 };
      state = SystemModule.default(state, action);
      expect(state.projectSearch).toBe(1);
    });

    it('UNSET_PROJECT_SEARCH_RESULT', () => {
      let state = {};
      const action = { type: 'UNSET_PROJECT_SEARCH_RESULT' };
      state = SystemModule.default(state, action);
      expect(state.projectSearch).toEqual([]);
    });

    it('SET_LANGUAGES', () => {
      let state = {};
      const action = { type: 'SET_LANGUAGES', languages: 1 };
      state = SystemModule.default(state, action);
      expect(state.languages).toEqual(1);
    });

    it('SET_AXIS', () => {
      let state = {};
      const action = { type: 'SET_AXIS', axis: 1 };
      state = SystemModule.default(state, action);
      expect(state.axis).toEqual(1);
    });

    it('SET_DOMAINS', () => {
      let state = {};
      const action = { type: 'SET_DOMAINS', domains: 1 };
      state = SystemModule.default(state, action);
      expect(state.domains).toEqual(1);
    });

    it('SET_LANDING_PAGE_DEFAULTS', () => {
      let state = {};
      const action = { type: 'SET_LANDING_PAGE_DEFAULTS', landing_page_defaults: 1 };
      state = SystemModule.default(state, action);
      expect(state.landing_page_defaults).toEqual(1);
    });

    it('SET_SEARCH_FILTERS', () => {
      let state = {};
      const action = { type: 'SET_SEARCH_FILTERS', search_filters: 1 };
      state = SystemModule.default(state, action);
      expect(state.search_filters).toEqual(1);
    });

    it('SET_THEMATIC_OVERVIEW', () => {
      let state = {};
      const action = { type: 'SET_THEMATIC_OVERVIEW', thematic_overview: 1 };
      state = SystemModule.default(state, action);
      expect(state.thematic_overview).toEqual(1);
    });

    it('SET_TOOLKIT_QUESTIONS', () => {
      let state = {};
      const action = { type: 'SET_TOOLKIT_QUESTIONS', toolkit_questions: 1 };
      state = SystemModule.default(state, action);
      expect(state.toolkit_questions).toEqual(1);
    });
  });
});
