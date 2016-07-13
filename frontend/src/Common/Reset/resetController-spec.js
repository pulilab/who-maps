import ResetController from './ResetController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let rc = {};

describe('ResetController', () => {

    beforeEach(() => {
        rc = ResetController.resetFactory()();
        rc.resetForm = {
            $valid: {}
        };
    });

    it('should have a function that execute the reset service', () => {
        rc.email = 'alma@korte.com';
        spyOn(rc.rs, 'reset').and.returnValue(Promise.resolve({ success: true }));
        rc.reset();
        expect(rc.rs.reset).toHaveBeenCalled();
        expect(rc.sent).toBeTruthy();
    });

});
