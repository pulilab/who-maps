import AddNewContentController from './AddNewContentController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

describe('AddNewContentController', () => {

    beforeEach(()=> {
        controller = AddNewContentController.factory()();
    });

    it('should have a factory  function', () => {
        expect(AddNewContentController.factory).toBeDefined();
        const onSpot = AddNewContentController.factory()();
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });
});
