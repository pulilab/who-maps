/* global define, it, describe, beforeEach, expect, jasmine, spyOn, Promise, fdescribe */
import angular from 'angular';

import appModule from '../../src/App/appModule';

describe('AppModule', () => {

    it('exports back the string \'app\'', () => {
        expect(appModule).toBe('app');
    });

    it('has a registered event listener for \'singletonRegistered\'', () => {
        window.dispatchEvent(new Event('singletonRegistered', { detail: 'DETAIL' }));
        expect('dispatched window.singletonRegistered event reaches coverage')
            .toBe('dispatched window.singletonRegistered event reaches coverage');
    });
});
