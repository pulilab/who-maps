import SearchbarController from '../../src/Common/Searchbar/SearchbarController';
import { $state, $scope, $ngRedux, EE } from '../testUtilities';

let sb = {};

describe('Searchbar Components controller', () => {
  beforeEach(() => {
    sb = SearchbarController.searchbarFactory()($state(), {}, $ngRedux);
    sb.scope = $scope(sb);
    sb.EE = EE;
    sb.$onInit();
  });

  test('can be initiated', () => {
    expect(sb).toBeDefined();
    expect(typeof sb).toBe('object');
  });

  test('fetches basic information about search results', () => {
    expect(typeof sb.resultNr).toBe('number');
  });

  test('should have a function that toggle the showSearch', () => {
    expect(sb.showSearch).toBe(false);
    sb.toggleSearch();
    expect(sb.showSearch).toBe(true);
  });

  test('should have a function that perform a search', () => {
    sb.searchProjects = jest.fn().mockReturnValue(Promise.resolve());
    sb.filters = [{
      active: false,
      value: 1
    }];
    sb.search('yolo');

    expect(sb.searchProjects).not.toHaveBeenCalled();
    sb.filters[0].active = true;
    sb.searchStr = 'swag';
    sb.search('swag');
    expect(sb.searchProjects).toHaveBeenCalledTimes(1);
  });
});
