import * as UserModule from '../../src/store/modules/user';
import * as ProjectModule from '../../src/store/modules/projects';
import Storage from '../../src/Common/Storage';
import { A, defaultAxiosSuccess, dispatch } from '../testUtilities';
import axios from '../../src/plugins/axios';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

describe('USER Store Module', () => {


    describe('GETTERS', () => {
        it('getProfile', () => {
            const state = {
                user: {
                    profile: {
                        id: 1
                    }
                }
            };
            const result = UserModule.getProfile(state);
            expect(result.id).toBe(1);
        });

    });

    describe('ACTIONS', () => {

        it('storeData', () => {
            spyOn(Storage.prototype, 'set');
            spyOn(axios, 'setAuthToken');
            const data = {
                token: 1,
                user_profile_id: 2,
                is_superuser: 3
            };
            UserModule.storeData(data, 'a@a.com');
            expect(Storage.prototype.set).toHaveBeenCalledWith('token', 1);
            expect(Storage.prototype.set).toHaveBeenCalledWith('user_profile_id', 2);
            expect(Storage.prototype.set).toHaveBeenCalledWith('is_superuser', 3);
            expect(Storage.prototype.set).toHaveBeenCalledWith('login', true);
            expect(Storage.prototype.set).toHaveBeenCalledWith('email', 'a@a.com');
            expect(axios.setAuthToken).toHaveBeenCalledWith(1);
        });

        it('handleProfile', () => {
            spyOn(Storage.prototype, 'get');
            let result = UserModule.handleProfile({ id : 1 });
            expect(result.organisation).toEqual(null);
            result = UserModule.handleProfile({ organisation: 1 });
            expect(result.organisation).toEqual({
                id: 1,
                name: ''
            });

            result = UserModule.handleProfile({ organisation: 1, organisation_name: 'b' });
            expect(result.organisation).toEqual({
                id: 1,
                name: 'b'
            });
        });

        it('setCountry', A(async () => {
            await UserModule.setCountry(1)(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: 'SET_COUNTRY', country: 1 });

        }));

    });

    describe('REDUCERS', () => {
        it('SET_USER', () => {
            let state = {};
            const action = { type: 'SET_USER', user: { id: 1 } };
            state = UserModule.default(state, action);
            expect(state.id).toBe(1);

        });

        it('SET_PROFILE', () => {
            let state = {};
            let action = { type: 'SET_PROFILE', profile: { id: 1 } };
            state = UserModule.default(state, action);
            expect(state.profile.id).toBe(1);

            state.profile =  {
                id: 2
            };
            action = { type: 'SET_PROFILE', profile: { id: 1 } };
            state = UserModule.default(state, action);
            expect(state.profile.id).toBe(1);
        });

        it('UPDATE_TEAM_VIEWER', () => {
            let state = {};
            const action = { type: 'UPDATE_TEAM_VIEWER', member: [1], viewer: [2] };
            state = UserModule.default(state, action);
            expect(state.profile.member).toEqual([1]);
            expect(state.profile.viewer).toEqual([2]);
        });

        it('UNSET_USER', () => {
            let state = {};
            const action = { type: 'UNSET_USER' };
            state = UserModule.default(state, action);
            expect(state).toEqual({});
        });

        it('SET_COUNTRY', () => {
            let state = {};
            const action = { type: 'SET_COUNTRY', country: 2 };
            state = UserModule.default(state, action);
            expect(state.profile.country).toEqual(2);
        });


    });

});
