import SystemController from '../../src/App/SystemController';
import * as UserModel from '../../src/store/modules/user';
import { $scope, $state, $ngRedux } from '../testUtilities';

/* global define, it, describe, beforeEach, expect, jasmine, spyOn, Promise */

let ac = {};

describe('SystemController', () => {

    beforeEach(() => {
        ac = SystemController.systemControllerFactory()($state, $scope, $ngRedux);
    });

    it('should have a factory function', () => {
        expect(SystemController.systemControllerFactory).toBeDefined();
        const onSpot = SystemController.systemControllerFactory()($state, $scope, $ngRedux);
        expect(onSpot.constructor.name).toBe(ac.constructor.name);
    });

    it('has a constructor, that defines 7 keys', () => {
        expect(ac.EE).toBeDefined();
        expect(ac.state).toBeDefined();
        expect(ac.scope).toBeDefined();
        expect(ac.unsubscribe).toBeDefined();
        expect(ac.$onInit).toBeDefined();
        expect(ac.$onDestroy).toBeDefined();
    });

    it('maps state', () => {
        spyOn(UserModel, 'getProfile').and.returnValue('PROFILE');;
        const mockState = { unnecessary_key: 'ASDF' };
        const mappedState = ac.mapState(mockState);
        expect(Object.keys(mappedState).length).toBe(1);
        expect(mappedState.userProfile).toBe('PROFILE');
        expect(UserModel.getProfile).toHaveBeenCalled();
    });

    it('has onInit fn.', () => {
        spyOn(ac, 'watchers');
        ac.$onInit();
        expect(ac.watchers).toHaveBeenCalled();
    });

    it('has onDestroy fn.', () => {
        expect(typeof ac.$onDestroy).toBe('function');
        spyOn(ac, 'unsubscribe');
        ac.$onDestroy();
        expect(ac.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('has watchers fn.', () => {
        ac.state.current = { name: 'NAME' };
        let a, b;
        ac.scope.$watch = (aa, bb) => {
            a = aa;
            b = bb;
        };
        spyOn(ac.scope, '$watch').and.callThrough();

        ac.watchers();

        expect(ac.scope.$watch).toHaveBeenCalledWith(a, b);
        expect(a()).toBe('NAME');
        b('landing');
        expect(ac.showCountryTopBar).toBe(true);
        b('terms-of-use');
        expect(ac.showCountryTopBar).toBe(true);
        b('some-other-string');
        expect(ac.showCountryTopBar).toBe(false);
    });

    it('has hasProfile fn.', () => {
        ac.userProfile = 'USERPROFILE';
        expect(ac.hasProfile()).toBe('USERPROFILE');
    });

    it('proxies $mdOpenMenu event', () => {
        const $mdOpenMenu = jasmine.createSpy('$mdOpenMenu');
        ac.openMenu($mdOpenMenu, 'EVENT');
        expect($mdOpenMenu).toHaveBeenCalledWith('EVENT');
    });
});
