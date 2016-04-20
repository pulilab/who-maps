import { default as AppModuleController } from './AppModuleController';
import { EE } from '../Common/';

EE.initialize();

/* global define, it, describe, beforeEach, expect, jasmine, spyOn */

let ac = {};
const $state = {
    go: () => {},
    current: {
        name: 'mock'
    }
};

const $scope = {
    $watch: () => {}
};

describe('AppModuleController', () => {

    beforeEach(() => {
        ac = AppModuleController.appControllerFactory()($state, $scope);
    });

    it('should have a function to handle the login event', () => {
        spyOn(ac, 'systemLogin');
        spyOn(ac, 'fillUserData');
        spyOn(ac.state, 'go');

        ac.handleLoginEvent(false);

        expect(ac.systemLogin).toHaveBeenCalled();
        expect(ac.fillUserData).toHaveBeenCalled();
        expect(ac.state.go).toHaveBeenCalled();
    });

    it('should have a function that update the sleected project', () => {
        spyOn(ac.state, 'go');
        ac.user = { projects: [{ name: 'asd', id: 1 }] };
        ac.updateProject('asd');
        expect(ac.state.go).toHaveBeenCalled();
    })

    it('should have a function to open a modal menu', () => {
        const spy = jasmine.createSpy('menuOpener');
        ac.openMenu(spy, {});
        expect(spy).toHaveBeenCalled();
    });

    it('should have a function to perform logout', () => {
        spyOn(ac, 'systemLogout');
        spyOn(ac, 'showCompleteNavigation');

        ac.logout();

        expect(ac.systemLogout).toHaveBeenCalled();
        expect(ac.showCompleteNavigation).toHaveBeenCalled();

    });

});
