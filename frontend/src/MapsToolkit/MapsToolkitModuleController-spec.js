import { default as MapsToolkitModuleController } from './MapsToolkitModuleController';

/* global define, it, describe, expect */

describe('MapsToolkitModuleController', () => {
    it('should have a function that return -some-', () => {
        const result = MapsToolkitModuleController.printAndReturnSome();
        expect(result).toBe('some');
    });
});
