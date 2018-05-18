import AddNewContentController from '../../src/Cms/AddNewContent/AddNewContentController';
import { AddNewContentDialog } from '../../src/Cms/AddNewContent/AddNewContentController';
import { dialog, $scope, toast, $ngRedux } from '../testUtilities';
/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

const upload = {};

describe('AddNewContentController', () => {
  beforeEach(() => {
    controller = AddNewContentController.factory()();
  });

  it('should have a factory  function', () => {
    expect(AddNewContentController.factory).toBeDefined();
    const onSpot = AddNewContentController.factory()();
    expect(onSpot.constructor.name).toBe(controller.constructor.name);
  });
});

describe('AddNewContentDialog', () => {
  beforeEach(() => {
    controller = AddNewContentDialog.factory()($scope(controller), dialog, upload, toast, $ngRedux);
  });

  it('should have a factory  function', () => {
    expect(AddNewContentDialog.factory).toBeDefined();
    const onSpot = AddNewContentDialog.factory()($scope(controller), dialog, upload, toast, $ngRedux);
    expect(onSpot.constructor.name).toBe(controller.constructor.name);
  });

  it('should have a cancel function', () => {
    controller.cancel();
    expect(controller.dialog.cancel).toHaveBeenCalled();
  });

  it('should have a submit function', () => {
    controller.saveOrUpdateContent = jasmine.createSpy('saveOrUpdateContent').and.returnValue(Promise.resolve());
    controller.form = {
      $valid: false
    };
    controller.newContent = {
      textValid: false
    };
    controller.submit();
    expect(controller.toast.show).toHaveBeenCalledTimes(1);
    expect(controller.showTrixError).toBeTruthy();

    controller.form.$valid = true;
    controller.newContent.textValid = true;
    controller.submit();
    expect(controller.saveOrUpdateContent).toHaveBeenCalledTimes(1);

    controller.newContent.id = 1;
    controller.submit();
    expect(controller.saveOrUpdateContent).toHaveBeenCalledTimes(2);

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
