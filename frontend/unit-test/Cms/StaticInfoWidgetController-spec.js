import StaticInfoWidgetController from '../../src/Cms/StaticInfoWidget/StaticInfoWidgetController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;


describe('StaticInfoWidgetController', () => {

    beforeEach(()=> {
        controller = StaticInfoWidgetController.factory()();
    });

    it('should have a factory  function', () => {
        expect(StaticInfoWidgetController.factory).toBeDefined();
        const onSpot = StaticInfoWidgetController.factory()();
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });
});
