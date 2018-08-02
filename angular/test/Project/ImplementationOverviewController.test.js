import ImplementationOverviewController from '../../src/Project/ImplementationOverview/ImplementationOverviewController';
import { $scope, $element, $ngRedux } from '../testUtilities';
import * as CountriesModule from '../../src/store/modules/countries';

let controller = null;

const structure = {
  health_focus_areas: []
};

describe('ImplementationOverview', () => {
  beforeEach(() => {
    controller = ImplementationOverviewController.factory()({}, $element, $ngRedux);
    controller.scope = $scope(controller);
  });

  test('mapData fn.', () => {
    jest.spyOn(CountriesModule, 'getCurrentCountryFirstSubLevel').mockReturnValue(1);
    jest.spyOn(CountriesModule, 'getCurrentCountrySecondSubLevel').mockReturnValue(2);
    jest.spyOn(CountriesModule, 'getCurrentCountryFacilityList').mockReturnValue(3);
    jest.spyOn(CountriesModule, 'getCurrentCountrySubLevelNames').mockReturnValue([1, 2]);
    const result = controller.mapData({});
    expect(CountriesModule.getCurrentCountryFirstSubLevel).toHaveBeenCalled();
    expect(CountriesModule.getCurrentCountrySecondSubLevel).toHaveBeenCalled();
    expect(CountriesModule.getCurrentCountrySubLevelNames).toHaveBeenCalled();
    expect(result.districtList).toBe(1);
    expect(result.secondSubLevelList).toBe(2);
    expect(result.subLevelNames).toEqual([1, 2]);
    expect(result.facilities).toEqual(3);
  });

  test('should have an on init function', () => {
    jest.spyOn(controller, 'watchers').mockReturnValue(undefined);
    jest.spyOn(controller, 'defaultOnInit').mockReturnValue(undefined);
    controller.structure = structure;
    controller.onInit();
    expect(controller.watchers).toHaveBeenCalled();
    expect(controller.defaultOnInit).toHaveBeenCalled();
  });

  test('onDestroy fn.', () => {
    controller.unsubscribe = jest.fn();
    controller.defaultOnDestroy = jest.fn();
    controller.onDestroy();
    expect(controller.unsubscribe).toHaveBeenCalled();
    expect(controller.defaultOnDestroy).toHaveBeenCalled();
  });

  test('watchers fn.', () => {
    controller.project = {};
    controller.project.platforms = [];
    controller.structure = {};
    controller.structure.technology_platform = [];
    jest.spyOn(controller, 'setAvailableDictOptions').mockReturnValue(undefined);
    jest.spyOn(controller, 'clearDistrict').mockReturnValue(undefined);
    jest.spyOn(controller, 'addClearOption').mockReturnValue(undefined);
    jest.spyOn(controller, 'initializeFacilityList').mockReturnValue(undefined);
    controller.watchers();
    expect(controller.scope.$watch).toHaveBeenCalled();
    expect(controller.scope.$watchGroup).toHaveBeenCalled();
    expect(controller.setAvailableDictOptions).toHaveBeenCalled();
    expect(controller.clearDistrict).toHaveBeenCalled();
    expect(controller.addClearOption).toHaveBeenCalled();
    expect(controller.initializeFacilityList).toHaveBeenCalled();
  });

  test('addClearOption fn', () => {
    let district = null;
    controller.addClearOption(district);
    expect(district).toEqual(null);

    district = [];
    controller.addClearOption(district);
    expect(district).toEqual([]);

    district = [{
      available: ['Clear selection']
    }];

    controller.addClearOption(district);
    expect(district).toEqual(district);

    district = [{
      available: ['Clear selection'],
      district: 1
    }];

    controller.addClearOption(district);
    expect(district).toEqual(district);

    district = [{
      available: ['a', 'b'],
      district: 1
    }];

    controller.addClearOption(district);
    expect(district[0].available[0]).toEqual('Clear selection');
  });

  test('clearDistrict Fn.', () => {
    let coverage = null;
    controller.clearDistrict(coverage);
    expect(coverage).toEqual(null);

    coverage = [];
    controller.clearDistrict(coverage);
    expect(coverage).toEqual([]);

    coverage = [{
      district: 1,
      health_workers: 2,
      facilities: 3,
      clients: 4
    }];

    controller.clearDistrict(coverage);
    expect(coverage).toEqual(coverage);

    coverage = [{
      district: 'Clear selection',
      health_workers: 2,
      facilities: 3,
      clients: 4
    }];

    controller.clearDistrict(coverage);
    expect(coverage[0]).toEqual({
      district: undefined,
      health_workers: undefined,
      facilities: undefined,
      clients: undefined
    });
  });

  test('removeUnavailableDistricts fn', () => {
    controller.project = {};
    let districts = null;
    controller.removeUnavailableDistricts(districts);
    expect(controller.project).toEqual(controller.project);

    controller.project.coverage = [];
    controller.removeUnavailableDistricts(districts);
    expect(controller.project).toEqual(controller.project);

    controller.project.coverage = [{ district: 1 }];
    controller.removeUnavailableDistricts(districts);
    expect(controller.project).toEqual(controller.project);

    districts = [];
    controller.removeUnavailableDistricts(districts);
    expect(controller.project).toEqual(controller.project);

    districts = [1, 2];
    controller.removeUnavailableDistricts(districts);
    expect(controller.project).toEqual(controller.project);

    controller.project.coverage = [{ district: 99 }];
    controller.removeUnavailableDistricts(districts);
    expect(controller.project.coverage).toEqual([{ district: undefined }]);
  });

  test('should have a mapping fn for interventions', () => {
    const health_focus_areas = [
      {
        name: 'a',
        subGroups: [{
          name: 'b',
          items: ['a', 'b']
        }, {
          name: 'c',
          items: ['ee', 'dd']
        }]
      },
      {
        name: 'aa',
        subGroups: [{
          name: 'bb',
          items: ['aa', 'bb']
        }, {
          name: 'cc',
          items: ['eee', 'ddd']
        }]
      }
    ];
    const r = controller.mapHealthFocusAreas(health_focus_areas);
    expect(r[0].subGroups[0].name).toBe('a');
    expect(r[0].subGroups[0].class).toBe('group-1');
  });
});
