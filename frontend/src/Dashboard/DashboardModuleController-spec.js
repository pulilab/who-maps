import { default as DashboardModuleController } from './DashboardModuleController';

/* global define, it, describe, expect, spyOn, beforeEach */
let vm = {};
window.setTimeout = (fn) => { fn(); };

describe('DashboardModuleController', () => {

    beforeEach(() => {
        vm = DashboardModuleController.dashboardControllerFactory()();
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

    it('has .prewProject() method, which handles decreasing active project binding indices in community wall', () => {
        vm.pi = [0, 1, 3];
        expect(vm.prewProject).toBeDefined();
        vm.prewProject(0);
        vm.prewProject(0);
        vm.prewProject(1);
        vm.prewProject(2);
        vm.prewProject(2);

        expect(vm.pi).toEqual([0, 0, 1]);
    });

    it('has .nextProject() method, which handles increasing active project binding indices in community wall', () => {
        vm.pi = [0, 0, 2];
        vm.commProjects = [[1, 2, 3], [1, 2, 3], [1, 2, 3, 4, 5]];
        expect(vm.nextProject).toBeDefined();
        vm.nextProject(0);
        vm.nextProject(0);
        vm.nextProject(1);
        vm.nextProject(2);
        vm.nextProject(2);
        vm.nextProject(2);

        expect(vm.pi).toEqual([2, 1, 4]);
    });

});
