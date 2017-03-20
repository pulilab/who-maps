import { default as CountryTopBarController } from './CountryTopBarController';
import { EE } from '../common';

EE.initialize();

/* global define, it, describe, beforeEach, expect, jasmine, spyOn, Promise */

let controller = {};
const $state = {
    go: () => {},
    current: {
        name: 'mock'
    }
};

const mockData = {
    countries: [{
        id: 1,
        name: 'asd'
    }]
};

const $scope = {
    $watch: () => {}
};

const $timeout = toCall => {
    return toCall();
};

const boundFunctions = {};

const ccsSpies = {
    getCountryData: jasmine.createSpy('getCountryData').and.returnValue(Promise.resolve()),
    getSubDomain: jasmine.createSpy('getSubDomain').and.returnValue('ug'),
    getCountryFlag: jasmine.createSpy('getCountryFlag').and.returnValue('url-ug')
};

describe('CountryTopBarController', () => {

    beforeEach(() => {
        boundFunctions.onInit = spyOn(CountryTopBarController.prototype, 'onInit').and.callThrough();
        controller = CountryTopBarController.countryTopBarControllerFactory()($state, $scope, $timeout);
    });

    it('should have an init function', () => {
        expect(controller.onInit).toBeDefined();
        controller.$onInit();
        expect(boundFunctions.onInit).toHaveBeenCalled();
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

    it('should have a show CLV button function', () => {
        controller.isLogin = true;
        let result = controller.showCountryLevelViewButton();
        expect(result).toBeTruthy();
        controller.isLogin = false;
        result = controller.showCountryLevelViewButton();
        expect(result).toBeFalsy();
    });
    it('should have a show a Login and Signup buttons function', () => {
        controller.isLogin = true;
        const result = {
            login: controller.showLogin(),
            signup: controller.showSignUp()
        };
        expect(result.login).toBeFalsy();
        expect(result.signup).toBeFalsy();

        controller.isLogin = false;
        result.login = controller.showLogin();
        result.signup = controller.showSignUp();
        expect(result.login).toBeTruthy();
        expect(result.signup).toBeTruthy();
    });


    it('should have a show new project button function', ()=>{
        controller.profileDataReady = true;
        controller.userProfile = {
            account_type: 'I'
        };
        spyOn(controller, 'hasProfile').and.returnValue(true);
        const result = controller.showNewProjectButton();
        expect(result).toBeTruthy();
        expect(controller.hasProfile).toHaveBeenCalled();
    });

    it('should have a show dashboard button function', ()=>{
        controller.profileDataReady = true;
        let result = controller.showGoToMyDashboardButton();
        expect(result).toBeTruthy();
        controller.profileDataReady = false;
        result = controller.showGoToMyDashboardButton();
        expect(result).toBeFalsy();
    });

    it('should have a has profile function', ()=>{
        controller.onInit();
        const spy = spyOn(controller.cs, 'hasProfile');
        spy.and.returnValue(true);
        let result = controller.hasProfile();
        expect(result).toBeTruthy();

        spy.and.returnValue(false);
        result = controller.hasProfile();
        expect(result).toBeFalsy();
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
