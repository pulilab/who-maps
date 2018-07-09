import GeneralOverviewController from '../../src/Project/GeneralOverview/GeneralOverviewController';
import { $scope, $element, $state, $ngRedux } from '../testUtilities';
import * as ProjectModule from '../../src/store/modules/projects';
import * as CountriesModule from '../../src/store/modules/countries';

let controller = {};

describe('GeneralOverviewController', () => {
  beforeEach(() => {
    controller = GeneralOverviewController.factory()({}, $element, $state(), $ngRedux);
    controller.scope = $scope(controller);
  });

  test('mapData fn', () => {
    jest.spyOn(ProjectModule, 'getSimilarProject').mockReturnValue([{ id: 1 }, { id: 2 }]);
    jest.spyOn(CountriesModule, 'getCountriesList').mockReturnValue(1);
    controller.project = { id: 1 };
    const result = controller.mapData({});
    expect(ProjectModule.getSimilarProject).toHaveBeenCalled();
    expect(CountriesModule.getCountriesList).toHaveBeenCalled();
    expect(result.similarProject).toEqual([{ id: 2 }]);
    expect(result.countriesList).toEqual(1);
  });

  test('should have an onInit function', () => {
    jest.spyOn(controller, 'watchers').mockReturnValue(undefined);
    jest.spyOn(controller, 'defaultOnInit').mockReturnValue(undefined);

    controller.onInit();
    expect(controller.defaultOnInit).toHaveBeenCalled();
    expect(controller.watchers).toHaveBeenCalled();
    expect(controller.$ngRedux.connect).toHaveBeenCalled();
  });

  test('should have a watcher function', () => {
    controller.project = {};
    jest.spyOn(controller, 'validateDateRange').mockReturnValue(undefined);
    controller.watchers();
    expect(controller.scope.$watch).toHaveBeenCalled();
    expect(controller.scope.$watchGroup).toHaveBeenCalled();
    expect(controller.validateDateRange).toHaveBeenCalled();
  });
  test('validateDateRange fn', () => {
    jest.spyOn(controller, 'setCustomError').mockReturnValue(undefined);
    jest.spyOn(controller, 'handleCustomError').mockReturnValue(undefined);
    const dates = [new Date(), new Date()];
    controller.validateDateRange(dates);
    expect(controller.handleCustomError).toHaveBeenCalled();
    dates[0].setYear(2200);
    controller.validateDateRange(dates);
    expect(controller.setCustomError).toHaveBeenCalled();

    const result = controller.validateDateRange([undefined, undefined]);
    expect(result).toBe(undefined);
  });

  test('getUsers fn.', () => {
    expect(controller.getUsers).toBeDefined();
    controller.users = [
      {
        name: 'Jess', organisation_name: 'Flikli'
      }, {
        name: 'Nico', organisation_name: 'Pulilab'
      }, {
        name: 'Tigest', organisation_name: 'WHO'
      }, {
        name: 'Garret'
      }, {
        organisation_name: 'WHO'
      }
    ];
    expect(controller.getUsers('tig')[0].organisation_name).toBe('WHO');
    expect(controller.getUsers('E').length).toBe(2);
  });

  test(' async checkName fn.', async (done) => {
    jest.spyOn(controller, 'handleCustomError').mockReturnValue(undefined);
    jest.spyOn(controller, 'setCustomError').mockReturnValue(undefined);
    controller.projectName = 'a';
    controller.currentName = 'a';
    controller.searchDuplicateProjectName = jest.fn();

    await controller.checkName();
    expect(controller.handleCustomError).toHaveBeenCalledWith('name');
    expect(controller.searchDuplicateProjectName).not.toHaveBeenCalled();
    expect(controller.setCustomError).not.toHaveBeenCalled();

    controller.currentName = 'b';
    await controller.checkName();
    expect(controller.handleCustomError).toHaveBeenCalledWith('name');
    expect(controller.searchDuplicateProjectName).toHaveBeenCalledWith('a');
    expect(controller.setCustomError).not.toHaveBeenCalled();

    controller.similarProject = [{ name: 'b' }];
    await controller.checkName();
    expect(controller.handleCustomError).toHaveBeenCalledWith('name');
    expect(controller.searchDuplicateProjectName).toHaveBeenCalledWith('a');
    expect(controller.setCustomError).not.toHaveBeenCalled();

    controller.similarProject = [{ name: 'A' }];
    await controller.checkName();
    expect(controller.handleCustomError).toHaveBeenCalledWith('name');
    expect(controller.searchDuplicateProjectName).toHaveBeenCalledWith('a');
    expect(controller.setCustomError).toHaveBeenCalledWith('name', 'Project name is not unique');
    done()
  });

  test('openSimilarProject fn.', () => {
    const event = {
      preventDefault: jest.fn()
    };

    const project = {
      isOwn: true
    };

    controller.openSimilarProject(project, event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(controller.state.go).toHaveBeenCalledWith('dashboard', expect.any(Object));

    project.isOwn = false;
    controller.openSimilarProject(project, event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(controller.state.go).toHaveBeenCalledWith('public-dashboard', expect.any(Object));
  });
});
