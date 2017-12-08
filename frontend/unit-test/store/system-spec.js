import * as SystemModule from '../../src/store/modules/system';
import * as ProjectModule from '../../src/store/modules/projects';
import { A, dispatch, axiosSpy } from '../testUtilities';
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
            spyOn(axios, 'get').and.returnValue(Promise.resolve({data: 1}));
            await SystemModule.loadUserProfiles()(dispatch);
            expect(axios.get).toHaveBeenCalledWith('/api/userprofiles/');
            expect(dispatch).toHaveBeenCalledWith({ type: 'SET_USER_PROFILES', profiles: 1});
        }));

    });

});
