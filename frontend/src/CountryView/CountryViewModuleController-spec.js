import CountryViewModuleController from './CountryViewModuleController';
import { $scope, EE } from '../testUtilities';

/* global define, it, describe, expect, spyOn, beforeEach, jasmine, Promise, xit */

let vm = {};


const csMock = {
    hssStructure: {
        continuum: {}
    },
    projectStructure: {
        technology_platforms: {}
    },
    isViewer: () => {},
    isMember: () => {}
};


describe('CountryViewModuleController', () => {

    beforeEach(() => {
        const scope = $scope(vm);
        vm = CountryViewModuleController.countryControllerFactory()(scope);
        vm.cs = csMock;
        vm.EE = EE;
    });

    it('has onInit fn. which gets countries and setup the watcher', () => {
        spyOn(vm, 'getCountries');
        spyOn(vm, 'watchers');
        vm.$onInit();
        expect(vm.getCountries).toHaveBeenCalled();
        expect(vm.watchers).toHaveBeenCalled();
    });

    it('should have a watcher function', () => {
        spyOn(vm, 'applyFilters');
        spyOn(vm, 'generateFilters');
        vm.watchers();
        expect(vm.applyFilters).toHaveBeenCalled();
        expect(vm.generateFilters).toHaveBeenCalled();
    });

    describe('apply filters function', () => {

        let filters = [];
        let oldValues = [];
        const filterMappingFn = jasmine.createSpy('filterMappingFn').and.returnValue([]);

        beforeEach(() => {
            filters = [
                {
                    open: true,
                    filterMappingFn,
                    items: [{ value: true, name: 'a' }]
                },
                {
                    open: true,
                    filterMappingFn,
                    items: [{ value: true, name: 'b' }]
                }
            ];
            oldValues = filters.slice();
        });


        it('should not run if the only change is on the open - close ', ()  => {
            oldValues[0].open = false;
            vm.applyFilters(filters, oldValues);
            expect(vm.scope.$evalAsync).not.toHaveBeenCalled();
        });

        it('should call the mappingFilter fn on the filter object', () => {
            vm.countryProjects = [{}];
            vm.applyFilters(filters, oldValues);
            expect(filterMappingFn).toHaveBeenCalled();
        });
        it('should show only project that contain one or more enabled filters', () => {
            vm.countryProjects = [{}];
            filters[0].filterMappingFn = () => ['a'];
            vm.applyFilters(filters, oldValues);
            expect(vm.projectsData[0]).toBe(vm.countryProjects[0]);
        });
        it('emit projectsUpdated event only if the filters actually modified the shown content', () => {
            vm.EE.emit.calls.reset();
            vm.countryProjects = [{}];
            filters[0].filterMappingFn = () => ['a'];
            vm.applyFilters(filters, oldValues);
            expect(vm.EE.emit).toHaveBeenCalled();

            vm.applyFilters(filters, oldValues);
            expect(vm.EE.emit).toHaveBeenCalledTimes(1);
        });

    });

    it('has the commonservices\' isViewer and isMember fn.s', () => {
        spyOn(vm.cs, 'isViewer');
        spyOn(vm.cs, 'isMember');
        vm.isViewer('a');
        vm.isMember('b');
        expect(vm.cs.isViewer).toHaveBeenCalledWith('a');
        expect(vm.cs.isMember).toHaveBeenCalledWith('b');
    });

    it('has updateCountry fn.', () => {
        spyOn(vm, 'changeMapTo');
        spyOn(vm, 'getProjects');

        const countryObj = { name: 'aa' };
        vm.updateCountry(countryObj);
        expect(vm.changeMapTo).toHaveBeenCalledWith(countryObj);
        expect(vm.getProjects).toHaveBeenCalledWith(countryObj);

        countryObj.name = 'Show all countries';
        vm.updateCountry(countryObj);
        expect(vm.changeMapTo.calls.count()).toBe(1);
        expect(vm.getProjects.calls.count()).toBe(2);
    });

    it('has changeMapTo fn.', () => {
        const countryMock = { id: 'id' };
        spyOn(vm, 'fetchCountryMap');
        spyOn(vm, 'fetchDistrictProjects');

        vm.changeMapTo(countryMock);

        expect(vm.EE.emit).toHaveBeenCalledWith('country Changed');
        expect(vm.fetchCountryMap).toHaveBeenCalledWith('id');
        expect(vm.fetchDistrictProjects).toHaveBeenCalledWith('id');
    });


    it('has a print implementing_partners fn', () => {
        const result = vm.printImplementingPartners({ implementing_partners: [1, 2] });
        expect(result).toBe('1, 2');
    });

});
