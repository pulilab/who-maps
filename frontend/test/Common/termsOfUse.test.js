import termsOfUseController from '../../src/Common/TermsOfUse/TermsOfUseController';
import { $scope, $ngRedux, EE } from '../testUtilities';
import * as utilities from '../../src/Utilities';

let lc = {};

describe('loginController', () => {
  beforeEach(() => {
    lc = termsOfUseController.termOfUseFactory()({}, null, $ngRedux);
    lc.scope = $scope(lc);
    lc.loginForm = {
      $valid: {}
    };
  });

  test('onInit', () => {
    jest.spyOn(utilities, 'getSubDomain').mockReturnValue(undefined);
    jest.spyOn(utilities, 'calculateHeight').mockReturnValue(1);
    lc.setCurrentCountryFromCode = jest.fn();
    lc.$onInit();
    expect(utilities.getSubDomain).toHaveBeenCalled();
    expect(utilities.calculateHeight).toHaveBeenCalled();
    expect(lc.setCurrentCountryFromCode).toHaveBeenCalled();
    expect(lc.style).toEqual({height: 1});
  });
});
