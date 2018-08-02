import SystemController from '../../src/App/SystemController';
import * as UserModel from '../../src/store/modules/user';
import { $scope, $state, $ngRedux, EE } from '../testUtilities';

let ac = {};

describe('SystemController', () => {
  beforeEach(() => {
    ac = SystemController.systemControllerFactory()($state, {}, $ngRedux);
    ac.scope = $scope(ac);
    ac.EE = EE;
  });

  test('should have a factory function', () => {
    expect(SystemController.systemControllerFactory).toBeDefined();
    const onSpot = SystemController.systemControllerFactory()($state, {}, $ngRedux);
    expect(onSpot.constructor.name).toBe(ac.constructor.name);
  });

  test('has a constructor, that defines 7 keys', () => {
    expect(ac.state).toBeDefined();
    expect(ac.scope).toBeDefined();
    expect(ac.unsubscribe).toBeDefined();
    expect(ac.$onInit).toBeDefined();
    expect(ac.$onDestroy).toBeDefined();
  });

  test('maps state', () => {
    jest.spyOn(UserModel, 'getProfile').mockReturnValue('PROFILE'); ;
    const mockState = { unnecessary_key: 'ASDF', user: {} };
    const mappedState = ac.mapState(mockState);
    expect(Object.keys(mappedState).length).toBe(4);
    expect(mappedState.userProfile).toBe('PROFILE');
    expect(UserModel.getProfile).toHaveBeenCalled();
  });

  test('has onInit fn.', () => {
    jest.spyOn(ac, 'watchers').mockReturnValue(undefined);
    ac.$onInit();
    expect(ac.watchers).toHaveBeenCalled();
  });

  test('has onDestroy fn.', () => {
    expect(typeof ac.$onDestroy).toBe('function');
    jest.spyOn(ac, 'unsubscribe');
    ac.$onDestroy();
    expect(ac.unsubscribe).toHaveBeenCalledTimes(1);
  });

  test('has watchers fn.', () => {
    ac.state.current = { name: 'NAME' };
    let a, b;
    ac.scope.$watch = (aa, bb) => {
      a = aa;
      b = bb;
    };
    jest.spyOn(ac.scope, '$watch');

    ac.watchers();

    expect(ac.scope.$watch).toHaveBeenCalledWith(a, b);
    expect(a()).toBe('NAME');
    b('landing');
    expect(ac.showCountryTopBar).toBe(true);
    b('terms-of-use');
    expect(ac.showCountryTopBar).toBe(true);
    b('some-other-string');
    expect(ac.showCountryTopBar).toBe(false);
  });

  test('has hasProfile fn.', () => {
    ac.userProfile = 'USERPROFILE';
    expect(ac.hasProfile()).toBe('USERPROFILE');
  });

  test('proxies $mdOpenMenu event', () => {
    const $mdOpenMenu = jasmine.createSpy('$mdOpenMenu');
    ac.openMenu($mdOpenMenu, 'EVENT');
    expect($mdOpenMenu).toHaveBeenCalledWith('EVENT');
  });
});
