import UUIDLoadController from '../../src/Common/UUIDLoad/UUIDLoadController';
import { $state, $ngRedux, EE } from '../testUtilities';

let ulc = {};

describe('UUID Project load Components controller', () => {
  beforeEach(() => {
    ulc = UUIDLoadController.uuidLoadFactory()($state(), $ngRedux);
    ulc.EE = EE;
    ulc.state.params = {
      projectUUID: 'randomxstuffcontainxxxx1'
    };
    ulc.$onInit();
  });

  test('can be initiated', () => {
    expect(ulc).toBeDefined();
    expect(typeof ulc).toBe('object');
  });

  test('should have a function that can transform an UUID in a projectID', async (done) => {
    expect(ulc.handleProjectLoad).toBeDefined();
    ulc.searchProjects = jest.fn().mockReturnValue(Promise.resolve());
    ulc.search = [];
    await ulc.handleProjectLoad();
    expect(ulc.state.go).not.toHaveBeenCalled();

    ulc.search = [{ id: 1 }];
    await ulc.handleProjectLoad();
    expect(ulc.state.go).toHaveBeenCalledWith('public-dashboard', { appName: 1 });

    ulc.profile = {
      member: [1]
    };
    await ulc.handleProjectLoad();
    expect(ulc.state.go).toHaveBeenCalledWith('dashboard', { appName: 1 });
    done();
  });
});
