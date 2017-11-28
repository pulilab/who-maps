import { default as LandingPageModuleController } from '../../src/LandingPage/LandingPageController';

/* global define, it, describe, expect, beforeEach, spyOn, jasmine, Promise */

let landing = {};

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

const eeSpy = {
    on: jasmine.createSpy('on'),
    removeListener: jasmine.createSpy('remove')
};

describe('LandingPageModuleController', () => {
    beforeEach(() => {
        landing = LandingPageModuleController.landingControllerFactory()($scope, $location, $anchorScroll);
        landing.EE = eeSpy;
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

    it('should have a function to fetch the custom country data', () => {
        expect(landing.ccs.getCountryData).toBeDefined();
        spyOn(landing.ccs, 'getCountryData').and.returnValue(Promise.resolve('some'));
        landing.$onInit();
    });
});
