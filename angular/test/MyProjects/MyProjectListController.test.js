import MyProjectListController from '../../src/MyProjects/MyProjectList/MyProjectListController';
import { $scope, $state, $ngRedux } from '../testUtilities';

let controller = {};

const scope = $scope(controller);

/* global it, describe, expect, beforeEach, afterEach, Promise */

describe('MyProjectListController', () => {
  beforeEach(() => {
    controller = new MyProjectListController(scope, $state(), $ngRedux);
  });

  test('onInit', () => {
    controller.$onInit();
    expect($ngRedux.connect).toHaveBeenCalled();
  });
  test('onDestroy', () => {
    controller.$onInit();
    controller.$onDestroy();
    expect(controller.unsubscribe).toHaveBeenCalled();
  });
});
