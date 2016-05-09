import EditProfileService from './EditProfileService';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let ss = {};
const res = new window.Response('{"hello":"world"}', {
    status: 200,
    headers: {
        'Content-type': 'application/json'
    }
});

describe('EditProfileService', () => {

    beforeEach(() => {
        ss = new EditProfileService();
    });

    it('should have a function that post the registration ', () => {
        spyOn(ss, 'post').and.returnValue(Promise.resolve(res));
        expect(ss.updateProfile).toBeDefined();
        ss.updateProfile();
        expect(ss.post).toHaveBeenCalled();
    });

});
