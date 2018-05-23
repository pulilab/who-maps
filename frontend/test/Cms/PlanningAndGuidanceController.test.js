import PlanningAndGuidanceController from '../../src/Cms/PlanningAndGuidance/PlanningAndGuidanceController';
import { $ngRedux, $scope, $state } from '../testUtilities';

let controller = null;

describe('PlanningAndGuidanceController', () => {
  beforeEach(() => {
    controller = PlanningAndGuidanceController.factory()(null, $state(), $ngRedux);
    controller.scope = $scope(controller);
  });

  test('should have a factory  function', () => {
    expect(PlanningAndGuidanceController.factory).toBeDefined();
    const onSpot = PlanningAndGuidanceController.factory()($scope(controller), $state(), $ngRedux);
    expect(onSpot.constructor.name).toBe(controller.constructor.name);
  });
  test('should have an on init function', () => {
    jest.spyOn(controller, 'createFilters').mockReturnValue(undefined);
    jest.spyOn(controller, 'watchers').mockReturnValue(undefined);
    controller.onInit();
    expect(controller.createFilters).toHaveBeenCalled();
    expect(controller.watchers).toHaveBeenCalled();
  });

  test('should have anDestroy fn', () => {
    jest.spyOn(controller, 'unsubscribe');
    controller.onDestroy();
    expect(controller.unsubscribe).toHaveBeenCalled();
  });

  test('should have a function that create a filter object for the UI', () => {
    controller.axes = [
      {
        name: 1,
        domains: [
          {
            name: 2, id: 1
          }
        ]
      }
    ];
    controller.createFilters();
    expect(controller.filters[0].name).toBe(1);
    expect(controller.filters[0].open).toBeFalsy();
    expect(controller.filters[0].selected).toBeFalsy();
    expect(controller.filters[0].domains[0].name).toBe(2);
    expect(controller.filters[0].domains[0].open).toBeFalsy();
  });

  test('should have a function that activate the tabs', () => {
    controller.activate('LOL');
    expect(controller.active).toBe('LOL');
  });

  test('should have a function that toggle the open status', () => {
    const group = {
      open: false
    };
    controller.toggleFilterGroup(group);
    expect(group.open).toBeTruthy();
    controller.toggleFilterGroup(group);
    expect(group.open).toBeFalsy();
  });

  test('should have a function that toggle the main category and all the sub ones', () => {
    const group = {
      selected: true,
      open: false,
      domains: [{
        selected: false
      }]
    };
    controller.toggleAll(group);
    expect(group.open).toBeTruthy();
    expect(group.domains[0].selected).toBeTruthy();

    group.selected = false;
    controller.toggleAll(group);
    expect(group.open).toBeTruthy();
    expect(group.domains[0].selected).toBeFalsy();
  });
});
