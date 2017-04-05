import CommentWidgetController from './CommentWidgetController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

describe('CommentWidgetController', () => {

    beforeEach(()=> {
        controller = CommentWidgetController.factory()();
    });

    it('should have a factory  function', () => {
        expect(CommentWidgetController.factory).toBeDefined();
        const onSpot = CommentWidgetController.factory()();
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });
});
