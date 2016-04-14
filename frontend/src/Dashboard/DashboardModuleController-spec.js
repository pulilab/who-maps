import { default as DashboardModuleController } from './DashboardModuleController';

/* global define, it, describe, expect, spyOn, beforeEach */
let vm = {};

describe('DashboardModuleController', () => {

    beforeEach(() => {
        vm = DashboardModuleController.dashboardControllerFactory()();
        window.setTimeout = (fn) => { fn(); };
        window.EE = {};
        window.EE.emit = (a) => a;
    });

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
