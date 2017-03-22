import NavigationController from './NavigationController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = {};

const $anchorScroll = jasmine.createSpy('scroll');


describe('NavigationController', () => {

    beforeEach(() => {
        controller = new NavigationController($anchorScroll);
    });

    it('should have a function that invoke scroll', () => {
        expect(controller.locationHashChanged).toBeDefined();
        controller.locationHashChanged();
        expect(controller.scroll).toHaveBeenCalled();

    });
    it('should have a function that is triggered when the hash change', () => {
        controller.$onInit();
        window.location.hash = Math.random().toString(36).substring(7);
        expect(controller.scroll).toHaveBeenCalledTimes(1);

    });
    it('on destroy the bound events must not be triggerable anymore', () => {
        controller.$onDestroy();
        $anchorScroll.calls.reset();
        window.location.hash = Math.random().toString(36).substring(7);
        expect(controller.scroll).toHaveBeenCalledTimes(0);
    });
    it('should have a factory function', () => {
        expect(NavigationController.navigationFactory).toBeDefined();
        const factored = NavigationController.navigationFactory()($anchorScroll);
        expect(factored instanceof NavigationController).toBeTruthy();
    });

});
