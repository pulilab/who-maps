import TopBar from '../../src/Common/TopBarBheaviour';
import { $state, $ngRedux, $scope, EE } from '../testUtilities';


/* global define, it, describe, beforeEach, expect, jasmine, spyOn, Promise */

let controller = {};

describe('TopBarBehaviour', () => {

    beforeEach(() => {
        controller = new TopBar($state(), {}, $ngRedux);
        controller.scope = $scope(controller);
        controller.EE = EE;
    });

    it('should have an init function', () => {
        expect(controller.commonInit).toBeDefined();
    });

    it('should have a show CLV button function', () => {
        const spy = spyOn(controller, 'hasProfile').and.returnValue(true);
        let result = controller.showCountryLevelViewButton();
        expect(result).toBe(true);

        spy.and.returnValue(false);
        result = controller.showCountryLevelViewButton();
        expect(result).toBe(false);
    });

    it('should have a show a Login and Signup buttons function', () => {
        controller.userModel = {
            token: true
        };
        controller.state.current = {
            name: 'something'
        };

        const result = {
            login: controller.showLogin(),
            signup: controller.showSignUp()
        };
        expect(result.login).toBeFalsy();
        expect(result.signup).toBeFalsy();

        controller.userModel.token = false;

        result.login = controller.showLogin();
        result.signup = controller.showSignUp();
        expect(result.login).toBeTruthy();
        expect(result.signup).toBeTruthy();
    });


    it('should have a show new project button function', ()=>{
        const spy = spyOn(controller, 'hasProfile').and.returnValue(true);
        let result = controller.showNewProjectButton();
        expect(result).toBe(true);

        spy.and.returnValue(false);
        result = controller.showNewProjectButton();
        expect(result).toBe(false);
    });

    it('should have a show dashboard button function', ()=>{
        controller.userModel = {
            token: true
        };
        let result = controller.showGoToMyDashboardButton();
        expect(result).toBeTruthy();
        controller.userModel.token = false;
        result = controller.showGoToMyDashboardButton();
        expect(result).toBeFalsy();
    });

    it('should have a has profile function', ()=>{
        controller.userModel = {
            profile: {
                country: 1,
                organisation: 'a',
                name: 'b'
            }
        };
        let result = controller.hasProfile();
        expect(result).toBeTruthy();

        controller.userModel.profile.country = undefined;
        result = controller.hasProfile();
        expect(result).toBeFalsy();
    });

});
