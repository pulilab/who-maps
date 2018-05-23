import DashboardWidgetController from '../../src/Cms/DashboardWidget/DashboardWidgetController';
import { scores } from './mockData';
import { $scope, $ngRedux } from '../testUtilities';

let controller = {};

describe('DashboardWidgetController', () => {
  beforeEach(() => {
    controller = DashboardWidgetController.factory()(null, $ngRedux);
    controller.scope = $scope(controller);
  });

  test('should have a factory function', () => {
    expect(DashboardWidgetController.factory).toBeDefined();
    const onSpot = DashboardWidgetController.factory()($scope(controller), $ngRedux);
    expect(onSpot.constructor.name).toBe(controller.constructor.name);
  });

  test('should have an onInit function', () => {
    jest.spyOn(controller, 'watchers');
    controller.$onInit();
    expect(controller.watchers).toHaveBeenCalled();
  });

  test('should have a watcher function', () => {
    jest.spyOn(controller, 'watchers');
    jest.spyOn(controller, 'mapState').mockReturnValue(undefined);
    controller.$onInit();
    jest.spyOn(controller, 'setDomainVariables').mockReturnValue(undefined);
    jest.spyOn(controller, 'splitType').mockReturnValue(undefined);
    controller.scores = [1];
    controller.currentDomain = 2;
    controller.watchers();

    expect(controller.splitType).toHaveBeenCalled();
    expect(controller.setDomainVariables).toHaveBeenCalled();
  });

  test('should have a function that divide the data in it\'s category', () => {
    const data = [{ type: 1, domain: 1 }, { type: 1, domain: 2 }, { type: 2, domain: 1 }, { type: 3, domain: 1 }];
    controller.currentDomain = {
      id: 1,
      name: 'a'
    };
    controller.splitType(data);
    expect(controller.lessons.length).toBe(1);
    expect(controller.resources.length).toBe(1);
    expect(controller.experiences.length).toBe(1);
  });

  test('should have a function that set the domain Variables', () => {
    controller.setDomainVariables({ id: 1, name: 'Parameters of Scale', axis: 1, domain: 1 }, scores);
    expect(controller.axisColor).toBe('axis-1');
    expect(controller.domainIcon).toBe('domain-1');
    const score = Math.round((scores[0].domains[0].domain_sum * 100) / scores[0].domains[0].domain_max);
    expect(controller.domainScore).toBe(score);
  });

  test('should have a next domain fn', () => {
    jest.spyOn(controller, 'watchers').mockReturnValue(undefined);
    controller.domains = [{ id: 1 }, { id: 2 }];
    controller.currentDomain = controller.domains[0];
    controller.nextDomain();
    expect(controller.currentDomain.id).toBe(controller.domains[1].id);

    controller.currentDomain = controller.domains.slice(-1)[0];
    controller.nextDomain();
    expect(controller.currentDomain.id).toBe(controller.domains[0].id);
  });

  test('should have a prev domain fn', () => {
    jest.spyOn(controller, 'watchers').mockReturnValue(undefined);
    controller.domains = [{ id: 1 }, { id: 2 }];
    controller.currentDomain = controller.domains[1];
    controller.prevDomain();
    expect(controller.currentDomain.id).toBe(controller.domains[0].id);

    controller.currentDomain = controller.domains[0];
    controller.prevDomain();
    expect(controller.currentDomain.id).toBe(controller.domains.slice(-1)[0].id);
  });
});
