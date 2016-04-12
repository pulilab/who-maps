import { default as AppModuleController } from './AppModuleController';
import { EE } from '../Common/';

EE.initialize();

/* global define, it, describe, beforeEach, expect, jasmine */

let ac = {};
const state = {
    go: () => {}
};

const scope = {
    $watch: () => {}
}

describe('AppModuleController', () => {

    beforeEach(() => {
        ac = AppModuleController.appControllerFactory()(state, scope);
    });

    it('should have a function to open a modal menu', () => {
        const spy = jasmine.createSpy('menuOpener');
        ac.openMenu(spy, {});
        expect(spy).toHaveBeenCalled();
    });

    it('should have a function to perform logout', () => {
        expect(ac.logout).toBeDefined();

    });

});
