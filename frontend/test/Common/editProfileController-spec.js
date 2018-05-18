import EditProfileController from '../../src/Common/EditProfile/EditProfileController';
import { $state, $scope, $ngRedux, toast } from '../testUtilities';

/* global it, describe, expect, beforeEach, afterEach, jasmine, Promise */

let sc = {};

describe('EditProfileController', () => {
  beforeEach(() => {
    sc = EditProfileController.editProfileFactory()({}, $state, toast, $ngRedux);
    sc.scope = $scope(sc);
    sc.newProjectForm = {
      $valid: true,
      $setValidity: jasmine.createSpy('$setValidity')
    };
  });
});
