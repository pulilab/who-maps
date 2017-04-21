import AddNewContentController from './AddNewContentController';
import { AddNewContentDialog } from './AddNewContentController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

const scope = {};
const dialog = {
    cancel: jasmine.createSpy('cancel'),
    hide: jasmine.createSpy('hide')
};

const toast = {};

toast.show = jasmine.createSpy('showToast').and.returnValue(toast);
toast.simple = jasmine.createSpy('simple').and.returnValue(toast);
toast.parent = jasmine.createSpy('parent').and.returnValue(toast);
toast.position = jasmine.createSpy('position').and.returnValue(toast);
toast.textContent = jasmine.createSpy('textContent').and.returnValue(toast);
toast.hideDelay = jasmine.createSpy('hideDelay').and.returnValue(toast);


const cs = {
    updateContent: jasmine.createSpy('updateContent').and.returnValue(Promise.resolve()),
    addContent: jasmine.createSpy('addContent').and.returnValue(Promise.resolve())
};

const upload = {};

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


describe('AddNewContentDialog', () => {
    beforeEach(()=> {
        controller = AddNewContentDialog.factory()(scope, dialog, upload, toast);
        controller.cs = cs;
    });

    it('should have a factory  function', () => {
        expect(AddNewContentDialog.factory).toBeDefined();
        const onSpot = AddNewContentDialog.factory()();
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });

    it('should have a cancel function', () => {
        controller.cancel();
        expect(controller.dialog.cancel).toHaveBeenCalled();
    });

    it('should have a submit function', () => {
        controller.form = {
            $valid : false
        };
        controller.newContent = {
            textValid: false
        };
        controller.submit();
        expect(controller.toast.show).toHaveBeenCalledTimes(1);
        expect(controller.showTrixError).toBeTruthy();

        controller.form.$valid = true;
        controller.submit();
        expect(controller.cs.addContent).toHaveBeenCalledTimes(1);

        controller.newContent.id = 1;
        controller.submit();
        expect(controller.cs.updateContent).toHaveBeenCalledTimes(1);

        expect(controller.dialog.hide).toHaveBeenCalledTimes(2);

    });

    it('should have a beforeChange function that disable the submit', () => {
        expect(controller.disableSubmit).toBeFalsy();
        controller.beforeImageSelect();
        expect(controller.disableSubmit).toBeTruthy();
    });
    it('should have an onChange function that enable the submit', () => {
        controller.beforeImageSelect();
        expect(controller.disableSubmit).toBeTruthy();
        controller.imageSelected();
        expect(controller.disableSubmit).toBeFalsy();
    });
});
