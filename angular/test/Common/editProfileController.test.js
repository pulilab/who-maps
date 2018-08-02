import EditProfileController from '../../src/Common/EditProfile/EditProfileController';
import { $state, $scope, $ngRedux, toast } from '../testUtilities';

let sc = {};

describe('EditProfileController', () => {
  beforeEach(() => {
    sc = EditProfileController.editProfileFactory()({}, $state, toast, $ngRedux);
    sc.scope = $scope(sc);
    sc.newProjectForm = {
      $valid: true,
      $setValidity: jest.fn()
    };
  });

  test('onInit', () => {
    sc.handleDataLoad = jest.fn();
    sc.$onInit();
    expect(sc.handleDataLoad).toHaveBeenCalled();
    expect(sc.dataLoaded).toBe(false);
  });
});
