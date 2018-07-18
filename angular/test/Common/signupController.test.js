import signupController from '../../src/Common/Signup/SignupController';
import { $state, $scope, $location, $anchorScroll, $ngRedux, EE } from '../testUtilities';

let sc = {};

describe('signupController', () => {
  beforeEach(() => {
    sc = signupController.signupFactory()({}, $location, $anchorScroll, $ngRedux, $state());
    sc.scope = $scope(sc);
    sc.EE = EE;
  });

  test('should have a function that execute the signup service when the form is valid', () => {
    sc.user = {};
    sc.doSignup = jest.fn().mockReturnValue(Promise.resolve());
    sc.signup({ '$valid': true });
    expect(sc.doSignup).toHaveBeenCalled();
    sc.signup({ '$valid': false });
    expect(sc.doSignup).toHaveBeenCalledTimes(1);
  });
});
