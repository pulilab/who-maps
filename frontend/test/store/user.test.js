import * as UserModule from '../../src/store/modules/user';
import * as ProjectModule from '../../src/store/modules/projects';
import * as SystemModule from '../../src/store/modules/system';
import * as CountryModule from '../../src/store/modules/countries';
import Storage from '../../src/Storage';
import * as language from '../../src/plugins/language';
import { A, defaultAxiosSuccess, dispatch, getState } from '../testUtilities';
import axios from '../../src/plugins/axios';

describe('USER Store Module', () => {
  describe('GETTERS', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
      jest.spyOn(language, 'setLanguage').mockReturnValue(undefined);
    });
    test('getProfile', () => {
      const countrySpy = jest.spyOn(CountryModule, 'getCountriesList').mockReturnValue(undefined);
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

      countrySpy.mockReturnValue([]);
      result = UserModule.getProfile(state);
      expect(result).toEqual({ id: 1, country: undefined });
      expect(countrySpy).toHaveBeenCalled();

      countrySpy.mockReturnValue([{ id: 1, name: 'a' }]);
      result = UserModule.getProfile(state);
      expect(result).toEqual({ id: 1, country: { id: 1, name: 'a' } });
      expect(countrySpy).toHaveBeenCalled();

      result = UserModule.getProfile({ user: {} });
      expect(result).toEqual(undefined);
    });

    test('getUserLanguage', () => {
      const spy = jest.spyOn(SystemModule, 'getLanguages').mockReturnValue([]);
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
      spy.mockReturnValue([{ code: 1, name: 'a' }]);

      result = UserModule.getUserLanguage(state);
      expect(result).toEqual({ code: 1, name: 'a' });
      expect(SystemModule.getLanguages).toHaveBeenCalled();
    });

    test('isSuperUser', () => {
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
    beforeEach(() => {
      jest.restoreAllMocks()
      jest.spyOn(language, 'setLanguage').mockReturnValue(undefined);
    });
    test('storeData', () => {
      jest.spyOn(Storage.prototype, 'set').mockReturnValue(undefined);
      jest.spyOn(axios, 'setAuthToken').mockReturnValue(undefined);
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

    test('handleProfile', () => {
      jest.spyOn(Storage.prototype, 'get').mockReturnValue(undefined);
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

    test('loadProfile', async (done) => {
      const spy = jest.spyOn(Storage.prototype, 'get').mockReturnValue(undefined);
      dispatch.mockClear();

      jest.spyOn(axios, 'get').mockReturnValue(defaultAxiosSuccess);
      jest.spyOn(UserModule, 'handleProfile').mockReturnValue(1);

      await UserModule.loadProfile()(dispatch, getState({ user: {} }));
      expect(dispatch).not.toHaveBeenCalled();

      spy.mockReturnValue(true);

      await UserModule.loadProfile()(dispatch, getState({ user: { profile: 1 } }));
      expect(dispatch).not.toHaveBeenCalled();

      await UserModule.loadProfile()(dispatch, getState({ user: { user_profile_id: 99 } }));
      expect(axios.get).toHaveBeenCalledWith('/api/userprofiles/99/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PROFILE', profile: 1 });

      await UserModule.loadProfile()(dispatch, getState({ user: {} }));
      expect(axios.get).toHaveBeenCalledWith('/api/userprofiles/99/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PROFILE', profile: 1 });
      done();
    });

    test('doSignup', async (done) => {
      const spy = jest.spyOn(axios, 'post').mockReturnValue(
        Promise.resolve({ data: { key: 'a', is_superuser: false } }));
      jest.spyOn(UserModule, 'storeData').mockReturnValue(undefined);
      const signup = { account_type: 1, password1: 2, password2: 2, email: 3 };

      await UserModule.doSignup(signup)(dispatch);

      expect(axios.post).toHaveBeenCalledWith('/api/rest-auth/registration/', signup);
      expect(UserModule.storeData).toHaveBeenCalledWith({ token: 'a', key: 'a', is_superuser: false }, 3);
      const error = new Error();
      error.response = { data: 1 };
      spy.mockReturnValue(Promise.reject(error));

      try {
        await UserModule.doSignup(signup)(dispatch);
      } catch (e) {
        expect(e).toEqual(1);
      }
      done();
    });

    test('doLogin', async (done) => {
      const spy = jest.spyOn(axios, 'post').mockReturnValue(defaultAxiosSuccess);
      jest.spyOn(UserModule, 'storeData').mockReturnValue(undefined);
      jest.spyOn(UserModule, 'loadProfile').mockReturnValue(undefined);
      jest.spyOn(ProjectModule, 'loadUserProjects').mockReturnValue(undefined);

      await UserModule.doLogin({ username: 1, password: 2 })(dispatch);
      expect(axios.post).toHaveBeenCalledWith('/api/api-token-auth/', { username: 1, password: 2 });
      expect(UserModule.storeData).toHaveBeenCalledWith(1, 1);
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_USER', user: 1 });
      expect(UserModule.loadProfile).toHaveBeenCalled();
      const error = new Error();
      error.response = { data: 1 };
      spy.mockReturnValue(Promise.reject(error));
      try {
        await UserModule.doLogin({ username: 1, password: 2 })(dispatch);
      } catch (e) {
        expect(e).toBe(1);
      }
      done();
    });

    test('saveProfile', async (done) => {
      jest.spyOn(Storage.prototype, 'get').mockReturnValue(null);
      jest.spyOn(UserModule, 'handleProfile').mockReturnValue(1);
      jest.spyOn(axios, 'put').mockReturnValue(defaultAxiosSuccess);
      jest.spyOn(axios, 'post').mockReturnValue(defaultAxiosSuccess);
      const state = { user: {} };

      await UserModule.saveProfile({ organisation: { id: 1 }, country: { id: 1 } })(dispatch, getState(state));
      expect(axios.post).toHaveBeenCalledWith('/api/userprofiles/', { organisation: 1, country: 1 });
      expect(UserModule.handleProfile).toHaveBeenCalledWith(1);
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PROFILE', profile: 1 });

      state.user.user_profile_id = 1;
      await UserModule.saveProfile({ organisation: { id: 1 }, country: { id: 1 } })(dispatch, getState(state));
      expect(axios.put).toHaveBeenCalledWith('/api/userprofiles/1/', { organisation: 1, country: 1 });
      expect(UserModule.handleProfile).toHaveBeenCalledWith(1);
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PROFILE', profile: 1 });
      done();
    });

    test('doLogout', () => {
      jest.spyOn(Storage.prototype, 'clear').mockReturnValue(undefined);
      jest.spyOn(console, 'warn').mockReturnValue(undefined);
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

    test('updateTeamViewers', () => {
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

    test('verifyEmail', async (done) => {
      jest.spyOn(axios, 'post').mockReturnValue(defaultAxiosSuccess);
      const result = await UserModule.verifyEmail('a');
      expect(axios.post).toHaveBeenCalledWith('/api/rest-auth/registration/verify-email/', 'a');
      expect(result).toBe(1);
      done();
    });

    test('resetPassword', async (done) => {
      jest.spyOn(axios, 'post').mockReturnValue(defaultAxiosSuccess);
      const result = await UserModule.resetPassword('a');
      expect(axios.post).toHaveBeenCalledWith('/api/rest-auth/password/reset/', 'a');
      expect(result).toBe(1);
      done();
    });
  });

  describe('REDUCERS', () => {
    beforeEach(() => {
      jest.restoreAllMocks()
      jest.spyOn(language, 'setLanguage').mockReturnValue(undefined);
    });
    test('SET_USER', () => {
      let state = {};
      const action = { type: 'SET_USER', user: { id: 1 } };
      state = UserModule.default(state, action);
      expect(state.id).toBe(1);
    });

    test('SET_PROFILE', () => {
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

    test('UPDATE_TEAM_VIEWER', () => {
      let state = {};
      const action = { type: 'UPDATE_TEAM_VIEWER', member: [1], viewer: [2] };
      state = UserModule.default(state, action);
      expect(state.profile.member).toEqual([1]);
      expect(state.profile.viewer).toEqual([2]);
    });

    test('UNSET_USER', () => {
      let state = {};
      const action = { type: 'UNSET_USER' };
      state = UserModule.default(state, action);
      expect(state).toEqual({});
    });
  });
});
