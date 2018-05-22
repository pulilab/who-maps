import DashboardModuleController from '../../src/Dashboard/DashboardModuleController';
import { $scope, EE, $state, $ngRedux } from '../testUtilities';

let vm = {};

describe('DashboardModuleController', () => {
  beforeEach(() => {
    vm = DashboardModuleController.factory()({}, {}, $state(), $ngRedux);
    vm.scope = $scope(vm);
    vm.EE = EE;
  });

  test('onInit fn.', () => {
    jest.spyOn(vm, 'watchers').mockReturnValue(undefined);
    vm.$onInit();
    expect(vm.watchers).toHaveBeenCalled();
  });

  test('watcher fn.', () => {
    vm.countryProjects = [];
    jest.spyOn(vm, 'applyFilters').mockReturnValue(undefined);
    jest.spyOn(vm, 'generateFilters').mockReturnValue(undefined);
    jest.spyOn(vm, 'updateCountry').mockReturnValue(undefined);
    vm.watchers();
    expect(vm.applyFilters).toHaveBeenCalled();
    expect(vm.generateFilters).toHaveBeenCalled();
    expect(vm.updateCountry).toHaveBeenCalled();
  });

  describe('apply filters function', () => {
    let filters = [];
    let oldValues = [];
    const filterMappingFn = jest.fn().mockReturnValue([]);

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

    test('should not run if the only change is on the open - close ', () => {
      vm.filterBit = 0;
      oldValues[0].open = false;
      vm.checkIfFilterIsApplied(filters, oldValues);
      expect(vm.filterBit).toBe(0);
    });

    test('should call the mappingFilter fn on the filter object', () => {
      vm.countryProjects = [{}];
      vm.selectedCountry = {
        project_approval: true
      };
      vm.filters = filters;
      vm.applyFilters([false]);
      expect(filterMappingFn).toHaveBeenCalled();
    });
    test('should show only project that contain one or more enabled filters', () => {
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

  test('handleTabSwitch fn.', () => {
    vm.selectedCountry = { id: 1 };
    vm.loadCountryProjectsOrAll = jest.fn();
    vm.handleTabSwitch(0, 1);
    expect(vm.loadCountryProjectsOrAll).not.toHaveBeenCalled();

    vm.selectedCountry = { id: false };
    vm.handleTabSwitch(1, 0);
    expect(vm.loadCountryProjectsOrAll).not.toHaveBeenCalled();

    vm.mapData = { id: 1 };
    vm.handleTabSwitch(0, 1);
    expect(vm.loadCountryProjectsOrAll).toHaveBeenCalledWith(1);
  });

  test('updateCountry fn.', () => {
    vm.projectsData = [];
    vm.setCurrentCountry = jest.fn()
    vm.loadCountryProjectsOrAll = jest.fn()

    vm.updateCountry({ id: 1 });
    expect(vm.loadCountryProjectsOrAll).toHaveBeenCalled();

    vm.updateCountry({ id: 1, name: 'a' }, { id: 2, name: 'b' });
    expect(vm.loadCountryProjectsOrAll).toHaveBeenCalled();
    expect(vm.setCurrentCountry).toHaveBeenCalled();
  });

  test('has a print implementing_partners fn', () => {
    const result = vm.printImplementingPartners({ implementing_partners: [1, 2] });
    expect(result).toBe('1, 2');
  });
});
