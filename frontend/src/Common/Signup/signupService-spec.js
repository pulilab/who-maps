import SignupService from './SignupService';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let ss = {};
const res = new window.Response('{"hello":"world"}', {
    status: 200,
    headers: {
        'Content-type': 'application/json'
    }
});

describe('SignupService', () => {

    beforeEach(() => {
        ss = new SignupService();
    });

    it('should have a function that post the registration ', () => {
        spyOn(ss, 'post').and.returnValue(Promise.resolve(res));
        expect(ss.signup).toBeDefined();
        ss.signup();
        expect(ss.post).toHaveBeenCalled();
    });

});
