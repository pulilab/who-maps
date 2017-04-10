import PlanningAndGuidanceController from './PlanningAndGuidanceController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

describe('PlanningAndGuidanceController', () => {

    beforeEach(()=> {
        controller = PlanningAndGuidanceController.factory()();
    });

    it('should have a factory  function', () => {
        expect(PlanningAndGuidanceController.factory).toBeDefined();
        const onSpot = PlanningAndGuidanceController.factory()();
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });
    it('should have an on init function', ()=> {
        spyOn(controller, 'createFilters');
        controller.onInit();
        expect(controller.active).toBe('all');
        expect(controller.createFilters).toHaveBeenCalled();
    });

    it('should have a function that create a filter object for the UI', () => {
        controller.createFilters();
        const rawFilter = require('../resources/filters');
        expect(controller.filters[0].name).toBe(rawFilter[0].name);
        expect(controller.filters[0].open).toBeFalsy();
        expect(controller.filters[0].selected).toBeFalsy();
        expect(controller.filters[0].checkboxes[0].name).toBe(rawFilter[0].checkboxes[0]);
        expect(controller.filters[0].checkboxes[0].open).toBeFalsy();

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
            checkboxes: [{
                selected: false
            }]
        };
        controller.toggleAll(group);
        expect(group.open).toBeTruthy();
        expect(group.checkboxes[0].selected).toBeTruthy();

        group.selected = false;
        controller.toggleAll(group);
        expect(group.open).toBeTruthy();
        expect(group.checkboxes[0].selected).toBeFalsy();
    });
});
