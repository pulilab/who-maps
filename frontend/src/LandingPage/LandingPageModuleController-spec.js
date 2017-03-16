import { default as LandingPageModuleController } from './LandingPageController';

/* global define, it, describe, expect, beforeEach, jasmine */

let landing = new LandingPageModuleController();

const $anchorScroll = () => {};
const $scope = {
    $evalAsync: toCall => {
        return toCall();
    }
};
const $location = {
    hash: (input) => {
        return input;
    }
};


describe('LandingPageModuleController', () => {
    beforeEach(() => {
        landing = LandingPageModuleController.landingControllerFactory()($scope, $location, $anchorScroll);
    });

    it('should have an onInit function', () => {
        expect(landing.$onInit).toBeDefined();
        landing.$onInit();
    });

    it('should have an onDestroy function', () => {
        expect(landing.$onDestroy).toBeDefined();
        landing.$onDestroy();
    });
    it('should have an function to scroll to an anchor', () => {
        spyOn(landing, '$anchorScroll').and.returnValue(true);
        landing.scrollTo('asd');
        expect(landing.$anchorScroll).toHaveBeenCalled();
    });

   it('should have a function to fetch the custom country data', (done) => {
        expect(landing.ccs.getCountryData).toBeDefined();
        spyOn(landing.ccs, 'getCountryData').and.returnValue(Promise.resolve({cover:'some'}));
        landing.$onInit();
    });
});
