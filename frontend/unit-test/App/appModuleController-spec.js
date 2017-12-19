import AppModuleController from '../../src/App/AppModuleController';
import { $scope, $state, toast, $ngRedux } from '../testUtilities';
import { EE } from '../../src/Common/common';

/* global define, it, describe, beforeEach, expect, jasmine, spyOn, Promise */

let ac = {};

fdescribe('AppModuleController', () => {

    beforeEach(() => {
        EE.initialize();
        ac = AppModuleController.appControllerFactory()($state, $scope, {}, toast, $ngRedux);
    });

    it('should have a factory function', () => {
        expect(AppModuleController.appControllerFactory).toBeDefined();
        const onSpot = AppModuleController.appControllerFactory()($state, $scope, {}, toast, $ngRedux);
        expect(onSpot.constructor.name).toBe(ac.constructor.name);
    });

    it('has a constructor, that defines 7 keys', () => {
        expect(ac.state).toBeDefined();
        expect(ac.scope).toBeDefined();
        expect(ac.dialog).toBeDefined();
        expect(ac.rootScope).toBeDefined();
        expect(ac.$onInit).toBeDefined();
        expect(ac.$onDestroy).toBeDefined();
        expect(ac.unsubscribe).toBeDefined();
    });

    it('maps state', () => {
        const mockState = { user: 'USER', projects: 'PROJECTS', unnecessary_key: 'ASDF' };
        const mappedState = ac.mapState(mockState);
        expect(Object.keys(mappedState).length).toBe(2);
        expect(mappedState.user).toBe('USER');
        expect(mappedState.projects).toBe('PROJECTS');
    });

    it('has onInit fn.', () => {
        spyOn(ac, 'watchers');
        ac.state.params = { appName: 'APPNAME' };
        ac.state.current = { name: 'NAME' };

        ac.$onInit();
        expect(ac.watchers).toHaveBeenCalled();
        expect(ac.projectId).toBe('APPNAME');
        expect(ac.currentPage).toBe('NAME');
        expect(ac.showCountryTopBar).toBe(false);
    });

    it('has onDestroy fn.', () => {
        expect(typeof ac.$onDestroy).toBe('function');
        spyOn(ac, 'unsubscribe');
        ac.$onDestroy();
        expect(ac.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('has computeShowSubBar fn.', () => {
        ac.showCountryTopBar = false;
        ac.user = true;
        ac.projects = [0, 1, 2];
        ac.state.current = { name: 'notNewProject' };

        const yes = ac.computeShowSubBar();
        expect(yes).toBe(true);

        ac.showCountryTopBar = true;
        const no = ac.computeShowSubBar();
        expect(no).toBe(false);
    });

    it('has watchers fn.', () => {
        ac.state.current = { name: 'NAME' };
        let a, b;
        ac.scope.$watch = (aa, bb) => {
            a = aa;
            b = bb;
        };
        spyOn(ac.scope, '$watch').and.callThrough();
        spyOn(ac, 'computeShowSubBar');

        ac.watchers();

        expect(ac.scope.$watch).toHaveBeenCalledWith(a, b);
        expect(a()).toBe('NAME')
        b('VALUE');
        expect(ac.currentPage).toBe('VALUE');
        expect(ac.computeShowSubBar).toHaveBeenCalled();
    });
});
