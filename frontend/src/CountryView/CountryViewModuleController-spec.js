import { default as CountryViewModuleController } from './CountryViewModuleController';

/* global define, it, describe, xit, expect */

describe('CountryViewModuleController', () => {

    xit('should have a function that return -some-', () => {
        const result = CountryViewModuleController.printAndReturnSome();
        expect(result).toBe('some');
    });
});
