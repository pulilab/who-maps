import UUIDLoadController from '../../src/Common/UUIDLoad/UUIDLoadController';
import { $state, $ngRedux, EE, A } from '../testUtilities';
/* global Promise, define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn */

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

  it('can be initiated', () => {
    expect(ulc).toBeDefined();
    expect(typeof ulc).toBe('object');
  });

  it('should have a function that can transform an UUID in a projectID', A(async () => {
    expect(ulc.handleProjectLoad).toBeDefined();
    ulc.searchProjects = jasmine.createSpy('searchProjects').and.returnValue(Promise.resolve());
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
  }));
});
