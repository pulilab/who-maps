
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
    $ngRedux.dispatch.mockImplementation(() => Promise.resolve('resolvedPromiseMock'));
  });

  afterEach(() => {
    $ngRedux.dispatch.mockClear();
  });

  test('is defined, importable', () => {
    expect(typeof config).toBe('function');
  });

  test('resolves base/user via $stateProvider', async (done) => {
    const res = await baseUserResolver($ngRedux);
    expect($ngRedux.dispatch).toHaveBeenCalledTimes(4);
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(2);
    expect(res[0]).toBe('resolvedPromiseMock');
    expect(res[1]).toBe('resolvedPromiseMock');
    done();
  });

  test('resolves share/user via $stateProvider', async (done) => {
    const res = await shareUserResolver($ngRedux);
    expect($ngRedux.dispatch).toHaveBeenCalledTimes(1);
    expect(res).toBe('resolvedPromiseMock');
    done();
  });

  test('resolves app/data via $stateProvider', async (done) => {
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

  test('resolves public/data via $stateProvider', async (done) => {
    const res = await publicDataResolver($ngRedux);
    expect($ngRedux.dispatch).toHaveBeenCalledTimes(5);
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(3);
    expect(res[0]).toBe('resolvedPromiseMock');
    expect(res[1]).toBe('resolvedPromiseMock');
    expect(res[2]).toBe('resolvedPromiseMock');
    done();
  });

  test('maps out default project name', async (done) => {
    await appNameMapper($ngRedux);
    expect($ngRedux.getState).toHaveBeenCalledTimes(1);
    done();
  });
});
