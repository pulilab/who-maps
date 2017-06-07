import DialogMultiSelectorController from './DialogMultiSelectorController';
import { DialogMultiSelectorDialog } from './DialogMultiSelectorController';
import { dialog, $scope } from '../../testUtilities';
/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = {};

describe('DialogMultiSelector', () => {

    beforeEach(()=> {
        controller = DialogMultiSelectorController.factory()($scope(controller), dialog);
    });

    it('should have a factory  function', () => {
        expect(DialogMultiSelectorController.factory).toBeDefined();
        const onSpot = DialogMultiSelectorController.factory()($scope(controller), dialog);
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });

    it('should have a watcher function', () => {
        spyOn(controller, 'openDialog');
        controller.scope.$watch = (feed, action) => {
            action(true, false);
        };
        controller.watchers();
        expect(controller.openDialog).toHaveBeenCalled();
    });

    it('should have a showModal Fn', () => {
        const preventDefault = jasmine.createSpy('preventDefault');
        expect(controller.modalOpen).toBeFalsy();
        controller.showModal({
            preventDefault
        });
        expect(controller.modalOpen).toBe(true);
        expect(preventDefault).toHaveBeenCalled();
    });

    it('should have a openDialog fn', () => {
        controller.openDialog();
        expect(controller.dialog.show).toHaveBeenCalled();
    });


});


describe('DialogMultiSelectorDialog', () => {
    beforeEach(()=> {
        controller = DialogMultiSelectorDialog.factory()($scope(controller), dialog);
    });

    it('should have a factory  function', () => {
        expect(DialogMultiSelectorDialog.factory).toBeDefined();
        const onSpot = DialogMultiSelectorDialog.factory()($scope(controller));
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });

    it('should have a watcher function', () => {
        spyOn(controller, 'setSelected');
        controller.watchers();
        expect(controller.setSelected).toHaveBeenCalled();
    });

    it('should have a cancel function', () => {
        controller.cancel();
        expect(controller.dialog.cancel).toHaveBeenCalled();
    });


});
