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
        expect(rc.rs.reset).toBeDefined();
    });

});
