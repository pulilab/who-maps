import { default as CmsModuleController } from './CmsModuleController';

/* global define, it, describe, expect */

describe('CmsModuleController', () => {
    it('should have a function that return -some-', () => {
        const result = CmsModuleController.printAndReturnSome();
        expect(result).toBe('some');
    });
});
