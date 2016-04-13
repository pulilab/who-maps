import { default as DashboardModuleController } from './DashboardModuleController';

/* global define, it, describe, expect, spyOn */

const vm = DashboardModuleController.dashboardControllerFactory()();
window.setTimeout = (fn) => { fn(); };
window.EE = { emit: () => {} };

describe('DashboardModuleController', () => {

    it('is defined', () => {
        expect(vm).toBeDefined();
        expect(typeof vm).toBe('object');
    });

    it('emits an event on window resize', () => {
        spyOn(window.EE, 'emit');
        vm.resizefn();
        expect(window.EE.emit).toHaveBeenCalledWith('dashResized');
    });

});
