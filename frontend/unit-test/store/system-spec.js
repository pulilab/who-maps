import * as SystemModule from '../../src/store/modules/system';
import * as ProjectModule from '../../src/store/modules/projects';
import { A, defaultAxiosSuccess, dispatch } from '../testUtilities';
import axios from '../../src/plugins/axios';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

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
            expect(result).toEqual([{ id: 1, isMember: true }]);

        });

    });

    describe('ACTIONS', () => {

        it('loadUserProfiles fn', A(async () => {
            spyOn(axios, 'get').and.returnValue(defaultAxiosSuccess);
            await SystemModule.loadUserProfiles()(dispatch);
            expect(axios.get).toHaveBeenCalledWith('/api/userprofiles/');
            expect(dispatch).toHaveBeenCalledWith({ type: 'SET_USER_PROFILES', profiles: 1 });
        }));

        it('searchProjects', A(async() => {
            spyOn(axios, 'post').and.returnValue(defaultAxiosSuccess);
            await SystemModule.searchProjects('a', { a: { name: 'b', value: 2 } })(dispatch);
            expect(axios.post).toHaveBeenCalledWith('/api/search/projects/', { query: 'a', b: 2 });
            expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PROJECT_SEARCH_RESULT', projects:1 });
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
            const action = { type: 'UNSET_PROJECT_SEARCH_RESULT'};
            state = SystemModule.default(state, action);
            expect(state.projectSearch).toEqual([]);

        });
    });

});
