import loginController from '../../src/Common/Login/LoginController';
import { $state, $scope, $ngRedux, EE } from '../testUtilities';

/* global it, describe, expect, beforeEach, afterEach, jasmine, Promise */

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

  it('should have a function that execute the login service', () => {
    lc.user = {};
    lc.doLogin = jasmine.createSpy('doLogin').and.returnValue(Promise.resolve());
    lc.login();
    expect(lc.doLogin).toHaveBeenCalled();
  });
});
