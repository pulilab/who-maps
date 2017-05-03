import TopBar from './TopBarBheaviour';
import EE  from './EE';

EE.initialize();

/* global define, it, describe, beforeEach, expect, jasmine, spyOn, Promise */

let controller = {};
const $state = {
    go: () => {},
    current: {
        name: 'mock'
    }
};


const $scope = {
    $watch: () => {},
    $evalAsync: ()=>{}
};


const boundFunctions = {};

const ccsSpies = {
    getCountryData: jasmine.createSpy('getCountryData').and.returnValue(Promise.resolve()),
    getSubDomain: jasmine.createSpy('getSubDomain').and.returnValue('ug'),
    getCountryFlag: jasmine.createSpy('getCountryFlag').and.returnValue('url-ug'),
    hasProfile: jasmine.createSpy('commonInit').and.returnValue(true)
};

describe('TopBar', () => {

    beforeEach(() => {
        boundFunctions.commonInit = spyOn(TopBar.prototype, 'commonInit').and.callThrough();
        controller = new TopBar($state, $scope);
        controller.cs = ccsSpies;
    });

    it('should have an init function', () => {
        expect(controller.commonInit).toBeDefined();
    });

    it('should wait for the profile to be ready', ()=> {
        controller.user = false;
        controller.commonInit();
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
        controller.commonInit();
        const spy = spyOn(controller.cs, 'hasProfile');
        spy.and.returnValue(true);
        let result = controller.hasProfile();
        expect(result).toBeTruthy();

        spy.and.returnValue(false);
        result = controller.hasProfile();
        expect(result).toBeFalsy();
    });

});
