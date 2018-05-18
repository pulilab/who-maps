import { default as LandingPageModuleController } from '../../src/LandingPage/LandingPageController';
import { $anchorScroll, $location, $scope, $state, EE, $ngRedux } from '../testUtilities';
import * as Utilities from '../../src/Utilities';

/* global it, describe, expect, beforeEach, spyOn, jasmine, Promise */

let landing = {};

describe('LandingPageModuleController', () => {
  beforeEach(() => {
    landing = LandingPageModuleController
      .landingControllerFactory()({}, $state(), $location, $anchorScroll, $ngRedux);
    landing.scope = $scope(landing);
    landing.EE = EE;
  });

  it('onInit function', () => {
    spyOn(Utilities, 'getSubDomain');
    landing.setCurrentCountryFromCode = jasmine.createSpy('setCurrentCountryFromCode');
    landing.onInit();
    expect(Utilities.getSubDomain).toHaveBeenCalled();
    expect(landing.setCurrentCountryFromCode).toHaveBeenCalled();
  });

  it('should have an onDestroy function', () => {
    expect(landing.$onDestroy).toBeDefined();
    landing.$onDestroy();
  });
  it('should have an function to scroll to an anchor', () => {
    landing.scrollTo('asd');
    expect(landing.$anchorScroll).toHaveBeenCalled();
  });
});
