/* global define, it, describe, beforeEach, afterEach, expect, jasmine, spyOn, Promise, fdescribe */
import { $state, toast, dialog, $ngRedux, $timeout } from '../testUtilities';
import axios from '../../src/plugins/axios';
import Storage from '../../src/Storage';

import { run, scrollToTopOnSuccess, checkProfile, setAxiosBaseTokenIfInStorage } from '../../src/App/app-run';
const spyScope = {};
const $rootScope = {};
spyScope.setAxiosBaseTokenIfInStorage = setAxiosBaseTokenIfInStorage;
import 'axios';


let onStartFn, onSuccessFn, onErrorFn, onFinishFn;

const $transitions = {
    onStart: jasmine.createSpy('onStart').and.callFake((obj, fn) => {
        onStartFn = fn;
    }),
    onSuccess: jasmine.createSpy('onSuccess').and.callFake((obj, fn) => {
        onSuccessFn = fn;
    }),
    onError: jasmine.createSpy('onError').and.callFake((obj, fn) => {
        onErrorFn = fn;
    }),
    onFinish: jasmine.createSpy('onFinish').and.callFake((obj, fn) => {
        onFinishFn = fn;
    })
};

describe('AppModule - run submodule', () => {

    beforeEach(() => {
        $ngRedux.dispatch.and.stub();
        $ngRedux.getState.and.callFake(() => ({
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

    it('is defined, and importable', () => {
        expect(typeof run).toBe('function');
    });

    it('scrolls to top on stateChange', () => {
        scrollToTopOnSuccess({ name: 'a' }, { name: 'b' });

        const mainContent = document.createElement('div');
        mainContent.className = 'main-content';
        document.body.appendChild(mainContent);
        mainContent.scrollTop = 10;

        scrollToTopOnSuccess({ name: 'a' },  { name: 'b' });
        expect(mainContent.scrollTop).toBe(0);
        mainContent.scrollTop = 10;

        scrollToTopOnSuccess({ name: 'editProject' },  { name: 'editProject' });
        expect(mainContent.scrollTop).toBe(0);
        mainContent.scrollTop = 10;
    });

    it('handles checking profile', () => {
        const profile = { name: 'NAME', country: 'COUNTRY', organisation_id: 'ORGANISATION_ID' };
        const t = { router: { stateService: { target: () => {} } } };
        spyOn(t.router.stateService, 'target').and.callThrough(str => Promise.resolve(str));

        checkProfile({}, t);
        expect(t.router.stateService.target).toHaveBeenCalledWith('editProfile');

        const ret = checkProfile(profile, t);
        expect(t.router.stateService.target).toHaveBeenCalledTimes(1);
        expect(typeof ret.then).toBe('function');
    });

    it('sets axios base token if finds it in the storage', () => {
        spyOn(axios, 'setAuthToken');
        spyOn(Storage.prototype, 'get').and.returnValue('token');
        setAxiosBaseTokenIfInStorage();
        expect(axios.setAuthToken).toHaveBeenCalledWith('token');
    });

    it('has run fn', () => {
        run($rootScope, $state, toast, dialog, $ngRedux, $timeout, $transitions, { /* gettextCatalog */ });

        // bind fn to outmost test scope with spies
        expect($transitions.onStart).toHaveBeenCalledWith({}, jasmine.any(Function));
        expect(typeof onStartFn).toBe('function');
        const onStartResult = onStartFn();
        expect(typeof onStartResult.then).toBe('function');

        expect($transitions.onSuccess).toHaveBeenCalledWith({}, jasmine.any(Function));
        expect(typeof onSuccessFn).toBe('function');
        const onSuccessResult = onSuccessFn({ from: () => 'a', to: () => 'b' });
        expect(typeof onSuccessResult.then).toBe('function');

        expect($transitions.onError).toHaveBeenCalledWith({}, jasmine.any(Function));
        expect(typeof onErrorFn).toBe('function');
        const onErrorResult = onErrorFn();
        expect(typeof onErrorResult.then).toBe('function');

        expect($transitions.onFinish).toHaveBeenCalledWith({}, jasmine.any(Function));
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
