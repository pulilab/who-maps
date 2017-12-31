import EditProfileController from '../../src/Common/EditProfile/EditProfileController';
import { $state, $scope,  $ngRedux, EE, toast } from '../testUtilities';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

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
