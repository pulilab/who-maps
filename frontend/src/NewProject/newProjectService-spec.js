import NewProjectService from './NewProjectService';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let ss = {};
const res = new window.Response('{"hello":"world"}', {
    status: 200,
    headers: {
        'Content-type': 'application/json'
    }
});

describe('NewProjectService', () => {

    beforeEach(() => {
        ss = new NewProjectService();
    });

    it('should have a function that post the registration ', () => {
        spyOn(ss, 'post').and.returnValue(Promise.resolve(res));
        expect(ss.newProject).toBeDefined();
        ss.newProject();
        expect(ss.post).toHaveBeenCalled();
    });

});
