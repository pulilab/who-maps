import * as UserModule from '../../src/store/modules/user';
import * as ProjectModule from '../../src/store/modules/projects';
import * as SystemModule from '../../src/store/modules/system';
import * as CountryModule from '../../src/store/modules/countries';
import Storage from '../../src/Common/Storage';
import { A, defaultAxiosSuccess, dispatch, getState } from '../testUtilities';
import axios from '../../src/plugins/axios';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise, console */

describe('USER Store Module', () => {


    describe('GETTERS', () => {
        it('getProfile', () => {
            const countrySpy = spyOn(CountryModule, 'getCountriesList');
            const state = {
                user: {
                    profile: {
                        id: 1,
                        country: 1
                    }
                }
            };
            let result = UserModule.getProfile(state);
            expect(result.id).toBe(1);
            expect(countrySpy).toHaveBeenCalled();

            countrySpy.and.returnValue([]);
            result = UserModule.getProfile(state);
            expect(result).toEqual({ id: 1, country: undefined });
            expect(countrySpy).toHaveBeenCalled();

            countrySpy.and.returnValue([{ id: 1, name: 'a' }]);
            result = UserModule.getProfile(state);
            expect(result).toEqual({ id: 1, country: { id: 1, name: 'a' } });
            expect(countrySpy).toHaveBeenCalled();

            result = UserModule.getProfile({ user: {} });
            expect(result).toEqual(undefined);

        });

        it('getUserLanguage', () => {
            const spy = spyOn(SystemModule, 'getLanguages').and.returnValue([]);
            const state = {};


            let result = UserModule.getUserLanguage(state);
            expect(result).toEqual(undefined);
            expect(SystemModule.getLanguages).toHaveBeenCalled();

            state.user = {};
            result = UserModule.getUserLanguage(state);
            expect(result).toEqual(undefined);
            expect(SystemModule.getLanguages).toHaveBeenCalled();


            state.user.profile = {};

            result = UserModule.getUserLanguage(state);
            expect(result).toEqual(undefined);
            expect(SystemModule.getLanguages).toHaveBeenCalled();

            state.user.profile.language = 1;
            spy.and.returnValue([{ code: 1, name: 'a' }]);

            result = UserModule.getUserLanguage(state);
            expect(result).toEqual({ code:1, name: 'a' });
            expect(SystemModule.getLanguages).toHaveBeenCalled();

        });

        it('isSuperUser', () => {
            const state = {
                user: {
                    profile: {
                        is_superuser: true
                    }
                }
            };
            const result = UserModule.isSuperUser(state);
            expect(result).toBe(true);
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
            let result = UserModule.handleProfile({ id: 1 });
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

        it('loadProfile', A(async () => {
            const spy = spyOn(Storage.prototype, 'get');
            dispatch.calls.reset();

            spyOn(axios, 'get').and.returnValue(defaultAxiosSuccess);
            spyOn(UserModule, 'handleProfile').and.returnValue(1);

            await UserModule.loadProfile()(dispatch, getState({ user: {} }));
            expect(dispatch).not.toHaveBeenCalled();

            spy.and.returnValue(true);

            await UserModule.loadProfile()(dispatch, getState({ user: { profile: 1 } }));
            expect(dispatch).not.toHaveBeenCalled();


            await UserModule.loadProfile()(dispatch, getState({ user: { user_profile_id: 99 } }));
            expect(axios.get).toHaveBeenCalledWith('/api/userprofiles/99/');
            expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PROFILE', profile: 1 });

            await UserModule.loadProfile()(dispatch, getState({ user: {} }));
            expect(axios.get).toHaveBeenCalledWith('/api/userprofiles/99/');
            expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PROFILE', profile: 1 });

        }));

        it('doSignup', A(async () => {
            const spy = spyOn(axios, 'post').and.returnValue(
              Promise.resolve({ data: { key: 'a', is_superuser: false } }));
            spyOn(UserModule, 'storeData');
            const signup = { account_type: 1, password1: 2, password2: 2, email: 3 };

            await UserModule.doSignup(signup)(dispatch);

            expect(axios.post).toHaveBeenCalledWith('/api/rest-auth/registration/', signup);
            expect(UserModule.storeData).toHaveBeenCalledWith({ token: 'a', key: 'a', is_superuser: false }, 3);

            spy.and.returnValue(Promise.reject({ response: { data: 1 } }));

            try {
                await UserModule.doSignup(signup)(dispatch);
            }
            catch (e) {
                expect(e).toEqual(1);
            }

        }));

        it('doLogin', A(async () => {
            const spy = spyOn(axios, 'post').and.returnValue(defaultAxiosSuccess);
            spyOn(UserModule, 'storeData');
            spyOn(UserModule, 'loadProfile');
            spyOn(ProjectModule, 'loadUserProjects');

            await UserModule.doLogin({ username: 1, password: 2 })(dispatch);
            expect(axios.post).toHaveBeenCalledWith('/api/api-token-auth/', { username: 1, password: 2 });
            expect(UserModule.storeData).toHaveBeenCalledWith(1, 1);
            expect(dispatch).toHaveBeenCalledWith({ type: 'SET_USER', user: 1 });
            expect(UserModule.loadProfile).toHaveBeenCalled();

            spy.and.returnValue(Promise.reject({ response: { data: 1 } }));
            try {
                await UserModule.doLogin({ username: 1, password: 2 })(dispatch);
            }
            catch (e) {
                expect(e).toBe(1);
            }
        }));

        it('saveProfile', A(async () => {
            spyOn(Storage.prototype, 'get').and.returnValue(null);
            spyOn(UserModule, 'handleProfile').and.returnValue(1);
            spyOn(axios, 'put').and.returnValue(defaultAxiosSuccess);
            spyOn(axios, 'post').and.returnValue(defaultAxiosSuccess);
            const state = { user: {} };

            await UserModule.saveProfile({ organisation: { id: 1 }, country: { id: 1 } })(dispatch, getState(state));
            expect(axios.post).toHaveBeenCalledWith('/api/userprofiles/', { organisation: 1, country: 1 });
            expect(UserModule.handleProfile).toHaveBeenCalledWith(1);
            expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PROFILE', profile: 1 });

            state.user.user_profile_id =  1;
            await UserModule.saveProfile({ organisation: { id: 1 }, country: { id: 1 } })(dispatch, getState(state));
            expect(axios.put).toHaveBeenCalledWith('/api/userprofiles/1/', { organisation: 1, country: 1 });
            expect(UserModule.handleProfile).toHaveBeenCalledWith(1);
            expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PROFILE', profile: 1 });

        }));

        it('doLogout', () => {
            spyOn(Storage.prototype, 'clear');
            spyOn(console, 'warn');
            UserModule.doLogout()(dispatch);
            expect(Storage.prototype.clear).toHaveBeenCalled();
            expect(dispatch).toHaveBeenCalledWith({ type: 'CLEAR_USER_PROJECTS' });
            expect(dispatch).toHaveBeenCalledWith({ type: 'CLEAR_TOOLKIT_DATA' });
            expect(dispatch).toHaveBeenCalledWith({ type: 'CLEAR_CMS_DATA' });
            expect(dispatch).toHaveBeenCalledWith({ type: 'UNSET_USER' });
            const throwingSpy = jasmine.createSpy('faulty').and.throwError('mock error');
            UserModule.doLogout()(throwingSpy);
            expect(console.warn).toHaveBeenCalled();
        });


        it('updateTeamViewers', () => {
            const state = {
                user: {
                    profile: {
                        member: [1],
                        viewer: [2]
                    }
                }
            };
            UserModule.updateTeamViewers([3], [4])(dispatch, getState(state));
            expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_TEAM_VIEWER', member: [1, 3], viewer: [2, 4] });
        });

        it('verifyEmail', A(async () => {
            spyOn(axios, 'post').and.returnValue(defaultAxiosSuccess);
            const result = await UserModule.verifyEmail('a');
            expect(axios.post).toHaveBeenCalledWith('/api/rest-auth/registration/verify-email/', 'a');
            expect(result).toBe(1);
        }));

        it('resetPassword', A(async () => {
            spyOn(axios, 'post').and.returnValue(defaultAxiosSuccess);
            const result = await UserModule.resetPassword('a');
            expect(axios.post).toHaveBeenCalledWith('/api/rest-auth/password/reset/', 'a');
            expect(result).toBe(1);
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

            state.profile = {
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


    });

});
