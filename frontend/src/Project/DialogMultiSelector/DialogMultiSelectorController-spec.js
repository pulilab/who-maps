import DialogMultiSelectorController from './DialogMultiSelectorController';
import { DialogMultiSelectorDialog } from './DialogMultiSelectorController';
import { dialog, $scope } from '../../testUtilities';
/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = {};

describe('DialogMultiSelector', () => {

    beforeEach(()=> {
        controller = DialogMultiSelectorController.factory()($scope(controller));
    });

    it('should have a factory  function', () => {
        expect(DialogMultiSelectorController.factory).toBeDefined();
        const onSpot = DialogMultiSelectorController.factory()($scope(controller));
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });

    it('should have a watcher function', () => {
        spyOn(controller, 'openDialog');
        controller.watchers();
        expect(controller.openDialog).toHaveBeenCalled();
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

    it('should have a cancel function', () => {
        controller.cancel();
        expect(controller.dialog.cancel).toHaveBeenCalled();
    });


});
