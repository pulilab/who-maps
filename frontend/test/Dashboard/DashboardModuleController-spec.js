import DashboardModuleController from '../../src/Dashboard/DashboardModuleController';
import { $scope, EE, $state, $ngRedux } from '../testUtilities';

/* global define, it, describe, expect, spyOn, beforeEach, jasmine, Promise, xit */

let vm = {};

describe('DashboardModuleController', () => {
  beforeEach(() => {
    vm = DashboardModuleController.factory()({}, {}, $state(), $ngRedux);
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

    it('should not run if the only change is on the open - close ', () => {
      vm.filterBit = 0;
      oldValues[0].open = false;
      vm.checkIfFilterIsApplied(filters, oldValues);
      expect(vm.filterBit).toBe(0);
    });

    it('should call the mappingFilter fn on the filter object', () => {
      vm.countryProjects = [{}];
      vm.selectedCountry = {
        project_approval: true
      };
      vm.filters = filters;
      vm.applyFilters([false]);
      expect(filterMappingFn).toHaveBeenCalled();
    });
    it('should show only project that contain one or more enabled filters', () => {
      vm.countryProjects = [{}];
      vm.selectedCountry = {
        project_approval: true
      };
      filters[0].filterMappingFn = () => ['a'];
      vm.filters = filters;
      vm.applyFilters([false]);
      expect(vm.projectsData[0]).toBe(vm.countryProjects[0]);
    });
  });

  it('handleTabSwitch fn.', () => {
    vm.selectedCountry = { id: 1 };
    vm.loadCountryProjectsOrAll = jasmine.createSpy('loadCountryProjectsOrAll');
    vm.handleTabSwitch(0, 1);
    expect(vm.loadCountryProjectsOrAll).not.toHaveBeenCalled();

    vm.selectedCountry = { id: false };
    vm.handleTabSwitch(1, 0);
    expect(vm.loadCountryProjectsOrAll).not.toHaveBeenCalled();

    vm.mapData = { id: 1 };
    vm.handleTabSwitch(0, 1);
    expect(vm.loadCountryProjectsOrAll).toHaveBeenCalledWith(1);
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
