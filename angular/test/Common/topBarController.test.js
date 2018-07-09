import { default as TopBarController } from '../../src/Common/TopBar/TopBarController';
import { $scope, $state, $ngRedux, EE } from '../testUtilities';

let ac = {};

describe('TopBarController', () => {
  beforeEach(() => {
    ac = TopBarController.topBarControllerFactory()($state(), {}, $ngRedux);
    ac.scope = $scope(ac);
    ac.EE = EE;
  });

  test('should have a watcher function', () => {
    jest.spyOn(ac, 'setAxisDomain');
    ac.watchers();
    expect(ac.setAxisDomain).toHaveBeenCalled();
  });

  test('should have a function that set domain and axis when appropriate', () => {
    const params = {
      axisId: null,
      domainId: null
    };
    ac.setAxisDomain(params);
    expect(ac.axis).toBe(0);
    expect(ac.domain).toBe(0);
    params.axisId = 1;
    params.domainId = 2;

    ac.setAxisDomain(params);
    expect(ac.axis).toBe(1);
    expect(ac.domain).toBe(2);
  });
});
