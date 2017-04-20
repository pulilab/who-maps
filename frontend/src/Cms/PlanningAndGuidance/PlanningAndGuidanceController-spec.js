import PlanningAndGuidanceController from './PlanningAndGuidanceController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

const callInner = toCall => {
    toCall();
};

const scope = {
    $evalAsync: jasmine.createSpy('evalAsync').and.callFake(callInner)
};

const state = {
    go: jasmine.createSpy('go')
};

describe('PlanningAndGuidanceController', () => {

    beforeEach(()=> {
        controller = PlanningAndGuidanceController.factory()(scope, state);
    });

    it('should have a factory  function', () => {
        expect(PlanningAndGuidanceController.factory).toBeDefined();
        const onSpot = PlanningAndGuidanceController.factory()();
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });
    it('should have an on init function', ()=> {
        spyOn(controller, 'createFilters');
        spyOn(controller, 'watchers');
        controller.onInit();
        expect(controller.createFilters).toHaveBeenCalled();
        expect(controller.watchers).toHaveBeenCalled();
    });

    it('should have a function that create a filter object for the UI', () => {
        controller.createFilters();
        const rawFilter = require('../resources/domains');
        expect(controller.filters[0].name).toBe(rawFilter[0].name);
        expect(controller.filters[0].open).toBeFalsy();
        expect(controller.filters[0].selected).toBeFalsy();
        expect(controller.filters[0].domains[0].name).toBe(rawFilter[0].domains[0].name);
        expect(controller.filters[0].domains[0].open).toBeFalsy();

    });

    it('should have a function that activate the tabs', () => {

        controller.activate('LOL');
        expect(controller.active).toBe('LOL');
    });
    it('should have a function that toggle the open status', () => {
        const group = {
            open: false
        };
        controller.toggleFilterGroup(group);
        expect(group.open).toBeTruthy();
        controller.toggleFilterGroup(group);
        expect(group.open).toBeFalsy();
    });

    it('should have a function that toggle the main category and all the sub ones', () => {
        const group = {
            selected: true,
            open: false,
            domains: [{
                selected: false
            }]
        };
        controller.toggleAll(group);
        expect(group.open).toBeTruthy();
        expect(group.domains[0].selected).toBeTruthy();

        group.selected = false;
        controller.toggleAll(group);
        expect(group.open).toBeTruthy();
        expect(group.domains[0].selected).toBeFalsy();
    });
});
