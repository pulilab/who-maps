import TopBar from '../../src/Common/TopBarBheaviour';
import { $state, $ngRedux, $scope, EE } from '../testUtilities';

let controller = {};

describe('TopBarBehaviour', () => {
  beforeEach(() => {
    controller = new TopBar($state(), {}, $ngRedux);
    controller.scope = $scope(controller);
    controller.EE = EE;
  });

  test('should have an init function', () => {
    expect(controller.commonInit).toBeDefined();
  });
});
