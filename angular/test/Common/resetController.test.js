import ResetController from '../../src/Common/Reset/ResetController';
import { $scope } from '../testUtilities';
import * as UserModule from '../../src/store/modules/user';

let rc = {};

describe('ResetController', () => {
  beforeEach(() => {
    rc = ResetController.resetFactory()({});
    rc.scope = $scope(rc);
    rc.resetForm = {
      $valid: true
    };
  });

  test('should have a function that execute the reset service', async (done) => {
    rc.email = 'alma@korte.com';
    jest.spyOn(UserModule, 'resetPassword').mockReturnValue(Promise.resolve());
    await rc.reset();
    expect(UserModule.resetPassword).toHaveBeenCalled();
    done();
  });
});
