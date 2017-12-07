import ResetController from '../../src/Common/Reset/ResetController';
import { $scope, A } from '../testUtilities';
import * as UserModule from '../../src/store/modules/user';
/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let rc = {};

describe('ResetController', () => {

    beforeEach(() => {
        rc = ResetController.resetFactory()({});
        rc.scope = $scope(rc);
        rc.resetForm = {
            $valid: true
        };
    });

    it('should have a function that execute the reset service', A( async () => {
        rc.email = 'alma@korte.com';
        spyOn(UserModule, 'resetPassword').and.returnValue(Promise.resolve());
        await rc.reset();
        expect(UserModule.resetPassword).toHaveBeenCalled();
    }));

});
