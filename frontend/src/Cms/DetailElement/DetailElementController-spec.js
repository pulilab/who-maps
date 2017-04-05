import DetailElementController from './DetailElementController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

describe('DetailElementController', () => {

    beforeEach(()=> {
        controller = DetailElementController.factory()();
    });

    it('should have a factory  function', () => {
        expect(DetailElementController.factory).toBeDefined();
        const onSpot = DetailElementController.factory()();
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });
});
