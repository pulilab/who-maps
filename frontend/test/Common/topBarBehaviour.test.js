import TopBar from '../../src/Common/TopBarBheaviour';
import { $state, $ngRedux, $scope, EE } from '../testUtilities';

/* global  it, describe, beforeEach, expect, Promise */

let controller = {};

describe('TopBarBehaviour', () => {
  beforeEach(() => {
    controller = new TopBar($state(), {}, $ngRedux);
    controller.scope = $scope(controller);
    controller.EE = EE;
  });

  it('should have an init function', () => {
    expect(controller.commonInit).toBeDefined();
  });
});
