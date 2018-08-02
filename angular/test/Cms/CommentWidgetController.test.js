import CommentWidgetController from '../../src/Cms/CommentWidget/CommentWidgetController';
import { $scope, $ngRedux } from '../testUtilities';

let controller = null;

describe('CommentWidgetController', () => {
  beforeEach(() => {
    controller = CommentWidgetController.factory()($scope(controller), $ngRedux);
    controller.$onInit();
  });

  test('should have a factory  function', () => {
    expect(CommentWidgetController.factory).toBeDefined();
    const onSpot = CommentWidgetController.factory()($scope(controller), $ngRedux);
    expect(onSpot.constructor.name).toBe(controller.constructor.name);
  });

  test('should have an onInit function', () => {
    controller.$onInit();
    expect(controller.expanded).toBe(false);
    expect(controller.editMode).toBe(false);
  });
  test('should have a function that return true if the user is the author ', () => {
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

  test('should have a function to get a user username', () => {
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

  test('should have and Edit fn', () => {
    controller.comment = { id: 1 };
    controller.edit();
    expect(controller.editMode).toBe(true);
    expect(controller.modified.id).toBe(1);
  });
  test('should have and Update fn', async (done) => {
    controller.updateComment = jest.fn().mockReturnValue(Promise.resolve());
    controller.modified = { id: 1 };
    await controller.update();
    expect(controller.updateComment).toHaveBeenCalled();
    expect(controller.editMode).toBe(false);
    done();
  });

  test('should have a readMore fn', () => {
    controller.readMore();
    expect(controller.expanded).toBe(true);
    controller.readMore();
    expect(controller.expanded).toBe(false);
  });
});
