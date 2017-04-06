import ListElementController from './ListElementController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

describe('ListElementController', () => {

    beforeEach(()=> {
        controller = ListElementController.factory()();
    });

    it('should have a factory  function', () => {
        expect(ListElementController.factory).toBeDefined();
        const onSpot = ListElementController.factory()();
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });
});
