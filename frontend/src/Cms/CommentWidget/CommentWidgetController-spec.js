import CommentWidgetController from './CommentWidgetController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

const scope = {
    $evalAsync: jasmine.createSpy('$evalAsync').and.callFake(toCall => {
        toCall();
    })
};

describe('CommentWidgetController', () => {

    beforeEach(()=> {
        controller = CommentWidgetController.factory()(scope);
        controller.$onInit();
    });

    it('should have an onInit function', () => {
        controller.$onInit();
        expect(controller.expanded).toBe(false);
        expect(controller.editMode).toBe(false);
        expect(controller.cs.constructor.name).toBe('CmsService');
    });
    it('should have a function that return true if the user is the author ', () => {
        controller.cs.currentUserId = 1;
        controller.comment = {
            user: 1
        };
        expect(controller.isAuthor()).toBe(true);

        controller.cs.currentUserId = 2;
        expect(controller.isAuthor()).toBe(false);
    });

    it('should have a function to get a user username', () => {
        spyOn(controller.cs, 'getNameFromId');
        controller.getUsername();
        expect(controller.cs.getNameFromId).toHaveBeenCalled();

    });

    it('should have and Edit fn', () => {
        controller.comment = { id: 1 };
        controller.edit();
        expect(controller.editMode).toBe(true);
        expect(controller.modified.id).toBe(1);
    });
    it('should have and Update fn', (done) => {
        spyOn(controller.cs, 'updateComment').and.returnValue(Promise.resolve());
        controller.modified = { id: 1 };
        controller.update().then(() => {
            expect(controller.cs.updateComment).toHaveBeenCalled();
            expect(controller.editMode).toBe(false);
            expect(controller.comment.id).toBe(1);
            done();
        });
    });

    it('should have a readMore fn', () => {
        controller.readMore();
        expect(controller.expanded).toBe(true);
        controller.readMore();
        expect(controller.expanded).toBe(false);

    });

    it('should have a factory  function', () => {
        expect(CommentWidgetController.factory).toBeDefined();
        const onSpot = CommentWidgetController.factory()();
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });
});
