import MyProjectListController from '../../src/MyProjects/MyProjectList/MyProjectListController';
import { $scope, $state } from '../testUtilities';

let controller = {};

const scope = $scope(controller);

/* global it, describe, expect, beforeEach, afterEach, Promise */

describe('MyProjectListController', () => {
  beforeEach(() => {
    controller = new MyProjectListController(scope, $state());
  });
});
