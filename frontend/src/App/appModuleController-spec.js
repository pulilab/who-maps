import { default as AppModuleController } from './AppModuleController';

/* global define, it, describe, beforeEach, expect, jasmine */

let ac = {};

describe('AppModuleController', () => {

    beforeEach(() => {
        ac = AppModuleController.appControllerFactory()();
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
