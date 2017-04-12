import ReportButtonController from './ReportButtonController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;


describe('ReportButtonController', () => {

    beforeEach(()=> {
        controller = ReportButtonController.factory()();
    });

    it('should have a factory  function', () => {
        expect(ReportButtonController.factory).toBeDefined();
        const onSpot = ReportButtonController.factory()();
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });
});
