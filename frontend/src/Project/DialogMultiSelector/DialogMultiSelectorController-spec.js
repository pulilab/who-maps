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


    it('should have a fn that set toggle all group', () => {
        controller.elements = [
            {
                'name': 'Client',
                'subGroups': [
                    {},
                    {},
                    {}
                ]
            },
            {
                'name': 'Provider',
                'subGroups': [
                    {},
                    {},
                    {}
                ]
            }
        ];
        controller.toggleAll(controller.elements[0]);
        expect(controller.elements[0].allOpen).toBe(true);
        controller.elements[0].subGroups.forEach(sub => {
            expect(sub.open).toBe(true);
        });
        expect(controller.elements[1].allOpen).toBeFalsy();
        controller.elements[1].subGroups.forEach(sub => {
            expect(sub.open).toBeFalsy();
        });
    });

    it('should have a cancel function', () => {
        controller.cancel();
        expect(controller.dialog.cancel).toHaveBeenCalled();
    });

    it('should have a function that add the selected strategies to the project model', () => {
        controller.selection = [1];
        controller.addSelected();
        expect(controller.dialog.hide).toHaveBeenCalledWith([1]);
    });

    it('should have a function tha toggle the open status on an object', () => {
        const item = {
            open: false
        };
        controller.toggle(item);
        expect(item.open).toBe(true);
        controller.toggle(item);
        expect(item.open).toBe(false);
    });

    it('should have a function that return true if an item is present in the selection', () => {
        controller.selection = ['a'];
        let res = controller.itemChecked('b');
        expect(res).toBeFalsy();
        res = controller.itemChecked('a');
        expect(res).toBeTruthy();
    });
    it('should have a function that add or remove an element form the selection', () => {
        controller.selection = ['a'];
        controller.itemToggle('b');
        expect(controller.selection[1]).toBe('b');
        controller.itemToggle('b');
        expect(controller.selection.length).toBe(1);
    });


});
