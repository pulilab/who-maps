import { default as LandingPageModuleController } from '../../src/LandingPage/LandingPageController';
import { $anchorScroll, $location, $scope, $state, EE, $ngRedux } from '../testUtilities';
import * as Utilities from '../../src/Utilities';


let landing = {};

describe('LandingPageModuleController', () => {
  beforeEach(() => {
    landing = LandingPageModuleController
      .landingControllerFactory()({}, $state(), $location, $anchorScroll, $ngRedux);
    landing.scope = $scope(landing);
    landing.EE = EE;
  });

  test('onInit function', () => {
    jest.spyOn(Utilities, 'getSubDomain').mockReturnValue(undefined);
    landing.setCurrentCountryFromCode = jest.fn();
    landing.onInit();
    expect(Utilities.getSubDomain).toHaveBeenCalled();
    expect(landing.setCurrentCountryFromCode).toHaveBeenCalled();
  });

  test('should have an onDestroy function', () => {
    expect(landing.$onDestroy).toBeDefined();
    landing.$onDestroy();
  });
  test('should have an function to scroll to an anchor', () => {
    landing.scrollTo('asd');
    expect(landing.$anchorScroll).toHaveBeenCalled();
  });
});
