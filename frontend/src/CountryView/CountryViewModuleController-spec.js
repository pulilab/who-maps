import { default as CountryViewModuleController } from './CountryViewModuleController';

/* global define, it, describe, expect */

describe('CountryViewModuleController', () => {

    it('should have a function that return -some-', () => {
        const result = CountryViewModuleController.printAndReturnSome();
        expect(result).toBe('some');
    });
});
