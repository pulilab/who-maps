import { default as DialogMultiSelectorController, DialogMultiSelectorDialog } from '../../src/Project/DialogMultiSelector/DialogMultiSelectorController';
import { dialog, $scope } from '../testUtilities';
/* global  it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = {};

describe('DialogMultiSelector', () => {
  beforeEach(() => {
    controller = DialogMultiSelectorController.factory()($scope(controller), dialog);
  });

  it('should have a factory  function', () => {
    expect(DialogMultiSelectorController.factory).toBeDefined();
    const onSpot = DialogMultiSelectorController.factory()($scope(controller), dialog);
    expect(onSpot.constructor.name).toBe(controller.constructor.name);
  });

  it('should have a watcher function', () => {
    spyOn(controller, 'openDialog');
    spyOn(controller, 'checkDuplicates');
    controller.scope.$watch = (feed, action) => {
      action(true, false);
    };
    controller.watchers();
    expect(controller.openDialog).toHaveBeenCalled();
    expect(controller.checkDuplicates).toHaveBeenCalled();
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
  beforeEach(() => {
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
    controller.selection = [{ id: 1 }];
    let res = controller.itemChecked({ id: 2 });
    expect(res).toBeFalsy();
    res = controller.itemChecked({ id: 1 });
    expect(res).toBeTruthy();
  });
  it('should have a function that add or remove an element form the selection', () => {
    controller.selection = [{ id: 1 }];
    controller.itemToggle({ id: 2 });
    expect(controller.selection[1].id).toBe(2);
    controller.itemToggle({ id: 2 });
    expect(controller.selection.length).toBe(1);
  });

  it('should have a fn that set open and open all accordingly to the selected items', () => {
    const ele = [
      {
        name: 'a',
        subGroups: [
          {
            name: 'b',
            items: ['a', 'b']
          },
          {
            name: 'c',
            items: ['ee', 'dd']
          }
        ]
      },
      {
        name: 'aa',
        subGroups: [
          {
            name: 'bb',
            items: ['aa', 'bb']
          },
          {
            name: 'cc',
            items: ['eee', 'ddd']
          }
        ]
      }
    ];
    controller.collectionName = 'items';
    controller.selection = ['a', 'ee'];
    controller.openSelected(ele);
    expect(ele[0].allOpen).toBe(true);
    expect(ele[0].subGroups[0].open).toBe(true);
    expect(ele[0].subGroups[1].open).toBe(true);
  });

  it('should have a fn that return the correct class string for a subGroup', () => {
    const subGroup = {
      open: false,
      class: 'a'
    };
    let r = controller.subGroupClass(subGroup);
    expect(r).toBe('closed a');
    subGroup.open = true;
    subGroup.class = 'b';
    r = controller.subGroupClass(subGroup);
    expect(r).toBe('open b');
  });
});
