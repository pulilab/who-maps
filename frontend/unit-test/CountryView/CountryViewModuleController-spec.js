import CountryViewModuleController from '../../src/CountryView/CountryViewModuleController';
import { $scope, EE, $state, $ngRedux } from '../testUtilities';

/* global define, it, describe, expect, spyOn, beforeEach, jasmine, Promise, xit */

let vm = {};


describe('CountryViewModuleController', () => {

    beforeEach(() => {
        vm = CountryViewModuleController.countryControllerFactory()({}, {}, $state(), $ngRedux);
        vm.scope = $scope(vm);
        vm.EE = EE;
    });

    it('onInit fn.', () => {
        spyOn(vm, 'watchers');
        vm.$onInit();
        expect(vm.watchers).toHaveBeenCalled();
    });

    it('watcher fn.', () => {
        vm.countryProjects = [];
        spyOn(vm, 'applyFilters');
        spyOn(vm, 'generateFilters');
        spyOn(vm, 'updateCountry');
        vm.watchers();
        expect(vm.applyFilters).toHaveBeenCalled();
        expect(vm.generateFilters).toHaveBeenCalled();
        expect(vm.updateCountry).toHaveBeenCalled();
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
        it('update the coverages only if the filters actually modified the shown content', () => {
            spyOn(vm, 'filterNLDProjects');
            spyOn(vm, 'filterDLDProjects');
            vm.countryProjects = [{}];
            filters[0].filterMappingFn = () => ['a'];
            vm.applyFilters(filters, oldValues);

            vm.applyFilters(filters, oldValues);
            expect(vm.filterNLDProjects).toHaveBeenCalledTimes(1);
            expect(vm.filterDLDProjects).toHaveBeenCalledTimes(1);
        });

    });


    it('updateCountry fn.', () => {
        vm.projectsData = [];
        vm.setCurrentCountry = jasmine.createSpy('setCurrentCountry');
        vm.loadCountryProjectsOrAll = jasmine.createSpy('loadCountryProjectsOrAll');

        vm.updateCountry({ id: 1 });
        expect(vm.loadCountryProjectsOrAll).toHaveBeenCalled();

        vm.updateCountry({ id: 1, name: 'a' }, { id: 2, name: 'b' });
        expect(vm.loadCountryProjectsOrAll).toHaveBeenCalled();
        expect(vm.setCurrentCountry).toHaveBeenCalled();

    });

    it('has a print implementing_partners fn', () => {
        const result = vm.printImplementingPartners({ implementing_partners: [1, 2] });
        expect(result).toBe('1, 2');
    });

});
