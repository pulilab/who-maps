import { default as SampleModuleController } from './SampleModuleController';

/* global define, it, describe, expect */

describe('SampleModuleController', () => {
    it('should have a function that return -some-', () => {
        const result = SampleModuleController.printAndReturnSome();
        expect(result).toBe('some');
    });
});
