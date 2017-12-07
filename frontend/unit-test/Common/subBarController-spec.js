import { default as SubBarController } from '../../src/Common/SubBar/SubBarController';
import { $state, $scope, $ngRedux, EE } from '../testUtilities';

/* global define, it, describe, beforeEach, expect, jasmine, spyOn, Promise */

let ac = {};


describe('SubBarController', () => {

    beforeEach(() => {
        ac = SubBarController.subBarControllerFactory()($state(), {}, $ngRedux);
        ac.sope = $scope(ac);
        ac.EE = EE;
    });


    it('should have a function that update the selected project', () => {
        ac.projects = [{ name: 'asd', id: 1 }];
        ac.navigateToProject('asd');
        expect(ac.state.go).toHaveBeenCalled();
    });

    it('should have a function to open a modal menu', () => {
        const spy = jasmine.createSpy('menuOpener');
        ac.openMenu(spy, {});
        expect(spy).toHaveBeenCalled();
    });
});
