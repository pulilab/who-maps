import { default as CountryTopBarController } from './CountryTopBarController';
import { EE } from '../common';
import { $state, $scope, $timeout } from '../../testUtilities';

EE.initialize();

/* global define, it, describe, beforeEach, expect, jasmine, spyOn, Promise */

let controller = {};

const scope = $scope(controller);

const boundFunctions = {};

const ccsSpies = {
    getCountryData: jasmine.createSpy('getCountryData').and.returnValue(Promise.resolve()),
    getSubDomain: jasmine.createSpy('getSubDomain').and.returnValue('ug'),
    getCountryFlag: jasmine.createSpy('getCountryFlag').and.returnValue('url-ug')
};

describe('CountryTopBarController', () => {

    beforeEach(() => {
        boundFunctions.onInit = spyOn(CountryTopBarController.prototype, 'onInit').and.callThrough();
        controller = CountryTopBarController.countryTopBarControllerFactory()($state, scope, $timeout);
        controller.state.current = { name:  'something' };
    });

    it('should have an init function', () => {
        expect(controller.onInit).toBeDefined();
        controller.$onInit();
        expect(boundFunctions.onInit).toHaveBeenCalled();
    });

    it('should call setProfile data if the user is present', () => {
        controller.cs = {};
        controller.cs.loadedPromise = {
            then: toCall => toCall()
        };
        spyOn(controller, 'setProfileData');
        spyOn(controller, 'commonInit');
        controller.user = true;
        controller.onInit();
        expect(controller.setProfileData).toHaveBeenCalled();
    });

    it('should get the country data', ()=> {
        controller.ccs = ccsSpies;
        controller.onInit();
        expect(ccsSpies.getSubDomain).toHaveBeenCalled();
        expect(ccsSpies.getCountryFlag).toHaveBeenCalled();
        expect(ccsSpies.getCountryData).toHaveBeenCalled();
    });

    it('should wait for the profile to be ready', ()=> {
        controller.user = false;
        controller.$onInit();
        expect(controller.profileDataReady).toBeFalsy();
    });

    it('should have a function that set the profile data', ()=> {
        controller.$onInit();
        expect(controller.setProfileData).toBeDefined();
        expect(controller.profileDataReady).toBeFalsy();
        controller.cs.userProfile = true;
        controller.setProfileData();
        expect(controller.profileDataReady).toBeTruthy();
    });

    it('should have a scroll event handler', () => {
        expect(controller.scrollEventHandler).toBeDefined();
        const event = {
            target : {
                scrollTop: 0
            }
        };
        controller.scrollEventHandler(event);
        expect(controller.isScrolled).toBe('not-scrolled');
        event.target.scrollTop = 110;
        controller.scrollEventHandler(event);
        expect(controller.isScrolled).toBe('scrolled-down');
    });

});
