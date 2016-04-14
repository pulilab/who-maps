import SignupService from './SignupService';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let ss = {};


describe('SignupService', () => {

    beforeEach(() => {
        ss = new SignupService();
    });

    it('should have a function that post the registration ', () => {
        spyOn(ss, 'post').and.returnValue(Promise.resolve());
        expect(ss.signup).toBeDefined();
        ss.signup();
        expect(ss.post).toHaveBeenCalled();
    });

});
