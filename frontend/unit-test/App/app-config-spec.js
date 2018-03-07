/* global define, it, describe, beforeEach, afterEach, expect, jasmine, spyOn, Promise, fdescribe */
import { $ngRedux } from '../testUtilities';

import {
    config,
    baseUserResolver,
    shareUserResolver,
    appDataResolver,
    publicDataResolver,
    appNameMapper
} from '../../src/App/app-config';

describe('AppModule - configuration submodule', () => {

    beforeEach(() => {
        $ngRedux.dispatch.and.callFake(() => Promise.resolve('resolvedPromiseMock'));
    });

    afterEach(() => {
        $ngRedux.dispatch.calls.reset();
    });

    it('is defined, importable', () => {
        expect(typeof config).toBe('function');
    });

    it('resolves base/user via $stateProvider', async (done) => {
        const res = await baseUserResolver($ngRedux);
        expect($ngRedux.dispatch).toHaveBeenCalledTimes(4);
        expect(Array.isArray(res)).toBe(true);
        expect(res.length).toBe(2);
        expect(res[0]).toBe('resolvedPromiseMock');
        expect(res[1]).toBe('resolvedPromiseMock');
        done();
    });

    it('resolves share/user via $stateProvider', async (done) => {
        const res = await shareUserResolver($ngRedux);
        expect($ngRedux.dispatch).toHaveBeenCalledTimes(1);
        expect(res).toBe('resolvedPromiseMock');
        done();
    });

    it('resolves app/data via $stateProvider', async (done) => {
        const res = await appDataResolver($ngRedux);
        expect($ngRedux.dispatch).toHaveBeenCalledTimes(6);
        expect(Array.isArray(res)).toBe(true);
        expect(res.length).toBe(4);
        expect(res[0]).toBe('resolvedPromiseMock');
        expect(res[1]).toBe('resolvedPromiseMock');
        expect(res[2]).toBe('resolvedPromiseMock');
        expect(res[3]).toBe('resolvedPromiseMock');
        done();
    });

    it('resolves public/data via $stateProvider', async (done) => {
        const res = await publicDataResolver($ngRedux);
        expect($ngRedux.dispatch).toHaveBeenCalledTimes(5);
        expect(Array.isArray(res)).toBe(true);
        expect(res.length).toBe(3);
        expect(res[0]).toBe('resolvedPromiseMock');
        expect(res[1]).toBe('resolvedPromiseMock');
        expect(res[2]).toBe('resolvedPromiseMock');
        done();
    });

    it('maps out default project name', async (done) => {
        await appNameMapper($ngRedux);
        expect($ngRedux.getState).toHaveBeenCalledTimes(1);
        done();
    });
});
