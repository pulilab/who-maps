
import { $state, toast, dialog, $ngRedux, $timeout } from '../testUtilities';
import axios from '../../src/plugins/axios';
import Storage from '../../src/Storage';

import { run, scrollToTopOnSuccess, checkProfile, setAxiosBaseTokenIfInStorage } from '../../src/App/app-run';
import 'axios';
const spyScope = {};
const $rootScope = {};
spyScope.setAxiosBaseTokenIfInStorage = setAxiosBaseTokenIfInStorage;

let onStartFn, onSuccessFn, onErrorFn, onFinishFn;

const $transitions = {
  onStart: jest.fn().mockImplementation((obj, fn) => {
    onStartFn = fn;
  }),
  onSuccess: jest.fn().mockImplementation((obj, fn) => {
    onSuccessFn = fn;
  }),
  onError: jest.fn().mockImplementation((obj, fn) => {
    onErrorFn = fn;
  }),
  onFinish: jest.fn().mockImplementation((obj, fn) => {
    onFinishFn = fn;
  })
};

describe('AppModule - run submodule', () => {
  beforeEach(() => {
    $ngRedux.dispatch.mockRestore();
    $ngRedux.getState.mockImplementation(() => ({
      user: {
        profile: {
          name: 'NAME',
          country: 'COUNTRY',
          organisation_id: 'ORGANISATION_ID'
        }
      }
    }));
  });

  afterEach(() => {});

  test('is defined, and importable', () => {
    expect(typeof run).toBe('function');
  });

  test('scrolls to top on stateChange', () => {
    const mainContent = {};
    jest.spyOn(document, 'getElementsByClassName').mockReturnValue([mainContent]);
    mainContent.scrollTop = 10;
    scrollToTopOnSuccess('success', { name: 'a' }, { name: 'b' });
    expect(mainContent.scrollTop).toBe(0);

    scrollToTopOnSuccess({ name: 'editProject' }, { name: 'editProject' });
    expect(mainContent.scrollTop).toBe(0);
  });

  test('handles checking profile', () => {
    const profile = { name: 'NAME', country: 'COUNTRY', organisation_id: 'ORGANISATION_ID' };
    const t = { router: { stateService: { target: () => {} } } };
    jest.spyOn(t.router.stateService, 'target').mockImplementation(str => Promise.resolve(str));

    checkProfile({}, t);
    expect(t.router.stateService.target).toHaveBeenCalledWith('editProfile');

    const ret = checkProfile(profile, t);
    expect(t.router.stateService.target).toHaveBeenCalledTimes(1);
    expect(typeof ret.then).toBe('function');
  });

  test('sets axios base token if finds it in the storage', () => {
    jest.spyOn(axios, 'setAuthToken');
    jest.spyOn(Storage.prototype, 'get').mockReturnValue('token');
    setAxiosBaseTokenIfInStorage();
    expect(axios.setAuthToken).toHaveBeenCalledWith('token');
  });

  test('has run fn', () => {
    run($rootScope, $state, toast, dialog, $ngRedux, $timeout, $transitions, { /* gettextCatalog */ });

    // bind fn to outmost test scope with spies
    expect($transitions.onStart).toHaveBeenCalledWith({}, expect.any(Function));
    expect(typeof onStartFn).toBe('function');
    const onStartResult = onStartFn();
    expect(typeof onStartResult.then).toBe('function');

    expect($transitions.onSuccess).toHaveBeenCalledWith({}, expect.any(Function));
    expect(typeof onSuccessFn).toBe('function');
    const onSuccessResult = onSuccessFn({ from: () => 'a', to: () => 'b' });
    expect(typeof onSuccessResult.then).toBe('function');

    expect($transitions.onError).toHaveBeenCalledWith({}, expect.any(Function));
    expect(typeof onErrorFn).toBe('function');
    const onErrorResult = onErrorFn();
    expect(typeof onErrorResult.then).toBe('function');

    expect($transitions.onFinish).toHaveBeenCalledWith({}, expect.any(Function));
    expect(typeof onFinishFn).toBe('function');
    const onFinishResult = onFinishFn({
      to: () => ({ profileRequired: true }),
      params: () => ({ appname: 'asdf' })
    });
    expect(typeof onFinishResult.then).toBe('function');

    const onFinishResult2 = onFinishFn({
      to: () => {},
      params: () => ({ appname: 'asdf' })
    });
    expect(onFinishResult2).not.toBe(onFinishResult);
  });
});
