import CommentWidgetController from '../../src/Cms/CommentWidget/CommentWidgetController';
import { $scope, $ngRedux } from '../testUtilities';

/* global it, describe, expect, beforeEach, afterEach, jasmine, Promise */

let controller = null;

describe('CommentWidgetController', () => {
  beforeEach(() => {
    controller = CommentWidgetController.factory()($scope(controller), $ngRedux);
    controller.$onInit();
  });

  it('should have a factory  function', () => {
    expect(CommentWidgetController.factory).toBeDefined();
    const onSpot = CommentWidgetController.factory()($scope(controller), $ngRedux);
    expect(onSpot.constructor.name).toBe(controller.constructor.name);
  });

  it('should have an onInit function', () => {
    controller.$onInit();
    expect(controller.expanded).toBe(false);
    expect(controller.editMode).toBe(false);
  });
  it('should have a function that return true if the user is the author ', () => {
    controller.userProfile = {
      id: 1
    };
    controller.comment = {
      user: 1
    };
    expect(controller.isAuthor()).toBe(true);

    controller.userProfile.id = 2;
    expect(controller.isAuthor()).toBe(false);
  });

  it('should have a function to get a user username', () => {
    controller.profiles = [];
    let result = controller.getUsername();
    expect(result).toBe('No name');

    controller.profiles = [{ id: 1, name: 1 }];
    controller.comment = {
      user: 1
    };
    result = controller.getUsername();
    expect(result).toBe(1);
  });

  it('should have and Edit fn', () => {
    controller.comment = { id: 1 };
    controller.edit();
    expect(controller.editMode).toBe(true);
    expect(controller.modified.id).toBe(1);
  });
  it('should have and Update fn', async (done) => {
    controller.updateComment = jasmine.createSpy('updateComment').and.returnValue(Promise.resolve());
    controller.modified = { id: 1 };
    await controller.update();
    expect(controller.updateComment).toHaveBeenCalled();
    expect(controller.editMode).toBe(false);
    done();
  });

  it('should have a readMore fn', () => {
    controller.readMore();
    expect(controller.expanded).toBe(true);
    controller.readMore();
    expect(controller.expanded).toBe(false);
  });
});
