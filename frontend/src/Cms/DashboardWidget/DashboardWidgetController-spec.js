import DashboardWidgetController from './DashboardWidgetController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

describe('DashboardWidgetController', () => {

    beforeEach(()=> {
        controller = DashboardWidgetController.factory()();
    });

    it('should have a factory  function', () => {
        expect(DashboardWidgetController.factory).toBeDefined();
        const onSpot = DashboardWidgetController.factory()();
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });
});
