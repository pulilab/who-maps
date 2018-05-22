import loginController from '../../src/Common/Login/LoginController';
import { $state, $scope, $ngRedux, EE } from '../testUtilities';

let lc = {};

describe('loginController', () => {
  beforeEach(() => {
    lc = loginController.loginFactory()({}, $state(), $ngRedux);
    lc.scope = $scope(lc);
    lc.EE = EE;
    lc.loginForm = {
      $valid: {}
    };
  });

  test('should have a function that execute the login service', () => {
    lc.user = {};
    lc.doLogin = jest.fn().mockReturnValue(Promise.resolve());
    lc.login();
    expect(lc.doLogin).toHaveBeenCalled();
  });
});
