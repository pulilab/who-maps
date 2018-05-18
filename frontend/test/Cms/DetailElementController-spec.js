import DetailElementController from '../../src/Cms/DetailElement/DetailElementController';
import { DetailElementDialog } from '../../src/Cms/DetailElement/DetailElementController';
import { dialog, $scope, $ngRedux } from '../testUtilities';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

describe('DetailElementController', () => {
  beforeEach(() => {
    controller = DetailElementController.factory()(dialog);
    controller.scope = $scope(controller);
  });

  it('should have a scroll-to-comment fn', () => {
    spyOn(window.document, 'querySelector').and.returnValue({
      scrollIntoView: jasmine.createSpy('scrollIntoView')
    });
    controller.scrollToAddNewComment(true);
    controller.scrollToAddNewComment(false);
    expect(window.document.querySelector).toHaveBeenCalledTimes(1);
  });

  it('should have a showDialog function', () => {
    spyOn(controller, 'scrollToAddNewComment');
    controller.showDetailDialog();
    expect(controller.dialog.show).toHaveBeenCalled();
    expect(controller.scrollToAddNewComment).toHaveBeenCalled();
  });

  it('should have a factory function', () => {
    expect(DetailElementController.factory).toBeDefined();
    const onSpot = DetailElementController.factory()();
    expect(onSpot.constructor.name).toBe(controller.constructor.name);
  });
});

describe('DetailElementDialogController', () => {
  beforeEach(() => {
    controller = DetailElementDialog.factory({ id: 1 })($scope(controller), dialog, $ngRedux);
  });

  it('should have a factory function', () => {
    expect(DetailElementDialog.factory).toBeDefined();
    const onSpot = DetailElementDialog.factory()($scope(controller), dialog, $ngRedux);
    expect(onSpot.constructor.name).toBe(controller.constructor.name);
  });

  it('should have an init function', () => {
    spyOn(controller, 'watchers');
    controller.init();
    expect(controller.watchers).toHaveBeenCalled();
    expect(controller.editMode).toBe(false);
  });

  it('should have a watchers fn', () => {
    spyOn(controller, 'checkExistence');
    controller.watchers();
    expect(controller.checkExistence).toHaveBeenCalled();
  });

  it('should have a function that close the dialog if the element is not in the model anymore', () => {
    controller.checkExistence([{ id: 1 }]);
    controller.checkExistence([{ id: 2 }]);
    expect(controller.dialog.cancel).toHaveBeenCalled();
  });

  it('should have a scroll-to-comment fn', () => {
    spyOn(window.document, 'querySelector').and.returnValue({
      scrollIntoView: jasmine.createSpy('scrollIntoView')
    });
    controller.scrollToAddNewComment();
    expect(window.document.querySelector).toHaveBeenCalled();
  });

  it('should have a cancel fn', () => {
    controller.cancel();
    expect(controller.dialog.cancel).toHaveBeenCalled();
  });
  it('should have and Edit fn', () => {
    controller.content = { id: 1 };
    controller.edit();
    expect(controller.editMode).toBe(true);
    expect(controller.modified.id).toBe(1);

    controller.modified = { id: 2 };
    controller.editMode = true;
    controller.edit();
    expect(controller.editMode).toBe(false);
    expect(controller.modified.id).toBe(2);
  });

  it('should have and Update fn', async (done) => {
    controller.saveOrUpdateContent = jasmine.createSpy('saveOrUpdateContent').and.returnValue(Promise.resolve());
    controller.modified = { id: 1 };
    await controller.update();
    expect(controller.saveOrUpdateContent).toHaveBeenCalled();
    expect(controller.editMode).toBe(false);
    done();
  });

  it('should have a function that return true if the user is the author ', () => {
    controller.userProfile = {
      id: 1
    };
    controller.content = {
      author: 1
    };
    expect(controller.isAuthor()).toBe(true);

    controller.userProfile.id = 2;
    expect(controller.isAuthor()).toBe(false);
  });

  it('should have an addComment fn', async (done) => {
    controller.init();
    controller.newComment = {};
    controller.addNewComment = jasmine.createSpy('addNewComment').and.returnValue(Promise.resolve());
    await controller.addComment();
    expect(controller.addNewComment).toHaveBeenCalled();
    expect(controller.newComment.text).toBe(false);
    done();
  });
});
