import { default as DashboardModuleController } from './DashboardModuleController';

/* global define, it, describe, expect */

describe('DashboardModuleController', () => {
    it('should have a function that return -some-', () => {
        const result = DashboardModuleController.printAndReturnSome();
        expect(result).toBe('some');
    });
});
