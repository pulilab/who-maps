import { default as DashboardModuleController } from './DashboardModuleController';

/* global define, it, describe, expect, spyOn, beforeEach, jasmine */
let vm = {};
const state = {
    params: {
        appName: '1'
    },
    go: jasmine.createSpy('go')
};

window.setTimeout = (fn) => { fn(); };

describe('DashboardModuleController', () => {

    beforeEach(() => {
        spyOn(window.EE, 'on').and.callThrough();
        vm = DashboardModuleController.dashboardControllerFactory()({}, state);
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

    it('\'s .fetchProjectData method starts fetching other needed data', () => {

        // vm.projectId = 1;
        spyOn(vm, 'fetchCountryMap');
        spyOn(vm, 'parseMapData');
        spyOn(vm, 'fetchCoverageVersions');

        const mock = { country: 1, coverage: 2 };
        vm.fetchProjectData(mock);

        expect(vm.projectData).toBe(mock);
        expect(vm.fetchCountryMap).toHaveBeenCalledWith(mock.country);
        expect(vm.parseMapData).toHaveBeenCalledWith(mock.coverage);
        expect(vm.fetchCoverageVersions).toHaveBeenCalled();
    });

    it('\'s .fetchCountryMap method fetches from the right endpoint', () => {
        vm.service.getAxisData = () => {
            return { then: (fn) => { fn('adat'); } };
        };
        spyOn(vm.service, 'getAxisData').and.callThrough();
        vm.fetchAxisData();
        expect(vm.service.getAxisData).toHaveBeenCalled();
        expect(vm.axisData).toBe('adat');
    });

    it('\'s .fetchToolkitData method fetches from the right endpoint, calls .fetchToolkitVersions', () => {
        vm.service.getToolkitData = () => {
            return { then: (fn) => { fn('adat'); } };
        };
        spyOn(vm.service, 'getToolkitData').and.callThrough();
        spyOn(vm, 'fetchToolkitVersions');

        vm.fetchToolkitData();
        expect(vm.service.getToolkitData).toHaveBeenCalled();
        expect(vm.fetchToolkitVersions).toHaveBeenCalled();
    });

    it('\'s .fetchCountryMap fn. calls the service with the id given, then emits', () => {
        vm.mapService.getCountryTopo = () => {
            return { then: (fn) => { fn('adat'); } };
        };
        spyOn(vm.EE, 'emit');
        spyOn(vm.mapService, 'getCountryTopo').and.callThrough();
        vm.fetchCountryMap('aaa');

        expect(vm.mapService.getCountryTopo).toHaveBeenCalled();
        expect(vm.EE.emit).toHaveBeenCalledWith('topoArrived', 'adat');
    });

    it('parseMapData fn. parses coverage data, emits EE with it', () => {
        const mock = [
            {
                'district': 'Pujehun District',
                'clients': 100,
                'health_workers': 10,
                'facilities': 1
            }, {
                'district': 'Bonthe District',
                'clients': 100,
                'health_workers': 20,
                'facilities': 1
            }, {
                'district': 'Moyamba District',
                'Superdoc': 1
            }
        ];
        spyOn(vm.EE, 'emit');
        vm.parseMapData(mock);
        expect(vm.EE.emit).toHaveBeenCalled();

        expect(vm.perfMockMap.labels.length).toBe(3);
        vm.perfMockMap.labels.forEach((key) => {
            expect(typeof vm.perfMockMap.data[key]).toBe('object');
        });
    });

    it('\'s .snapShot fn. reaches out to the save snapshot via service', () => {
        vm.projectId = 1;
        vm.service.snapShot = () => {
            return { then: fn => { fn(); } };
        };
        spyOn(vm.service, 'snapShot').and.callThrough();
        vm.snapShot();
        expect(vm.service.snapShot).toHaveBeenCalledWith(1);
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

    it('handles axis components domain change event with redirecting to correct maps toolkit page', () => {
        expect(vm.EE.on).toHaveBeenCalled();

        vm.handleChangeDomain(1, 1);
        expect(vm.state.go).toHaveBeenCalledWith('maps', { 'axisId': 1,  'domainId': 1 });
    });

    it('should have a function that handle a change axis event', () => {
        vm.handleChangeAxis(1);
        expect(vm.state.go).toHaveBeenCalledWith('maps', { 'axisId': 1,  'domainId': 0 });
    });

});
