import { default as LandingPageModuleController } from './LandingPageModuleController';

/* global define, it, describe, expect */

describe('LandingPageModuleController', () => {
    it('should have a function that return -some-', () => {
        const result = LandingPageModuleController.printAndReturnSome();
        expect(result).toBe('some');
    });
});
