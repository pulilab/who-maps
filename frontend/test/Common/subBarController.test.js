import { default as SubBarController } from '../../src/Common/SubBar/SubBarController';
import { $state, $scope, $ngRedux, EE } from '../testUtilities';

let ac = {};

describe('SubBarController', () => {
  beforeEach(() => {
    ac = SubBarController.subBarControllerFactory()($state(), {}, $ngRedux);
    ac.sope = $scope(ac);
    ac.EE = EE;
  });

  test('should have a function that update the selected project', () => {
    ac.projects = [{ name: 'asd', id: 1 }];
    ac.navigateToProject('asd');
    expect(ac.state.go).toHaveBeenCalled();
  });

  test('should have a function to open a modal menu', () => {
    const spy = jest.fn();
    ac.openMenu(spy, {});
    expect(spy).toHaveBeenCalled();
  });
});
