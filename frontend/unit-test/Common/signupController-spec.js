import signupController from '../../src/Common/Signup/SignupController';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let sc = {};


describe('signupController', () => {

    beforeEach(() => {
        sc = signupController.signupFactory()();
    });


    it('should have a function that execute the signup service when the form is valid', () => {
        sc.user = {};
        spyOn(sc.ss, 'signup').and.returnValue(Promise.resolve());
        sc.signup({ '$valid': true });
        expect(sc.ss.signup).toHaveBeenCalled();
        sc.signup({ '$valid': false });
        expect(sc.ss.signup).toHaveBeenCalledTimes(1);
    });

    it('should have a function that process the registration response', () => {
        expect(sc.processRegistrationResult).toBeDefined();
    });

});
