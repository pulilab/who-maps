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
});
