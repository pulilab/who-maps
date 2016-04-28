import LoginService from './LoginService';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let ls = {};
const res = new window.Response(
    '{"hello":"world"}',
    {
        status: 200,
        headers: {
            'Content-type': 'application/json'
        }
    });

describe('loginService', () => {

    beforeEach(() => {
        ls = new LoginService();
    });

    it('should have a function that process the json answer ', () => {
        spyOn(Promise, 'reject');
        expect(ls.processLoginJson).toBeDefined();
        ls.processLoginJson();
        expect(Promise.reject).toHaveBeenCalled();
    });

    it('should have a function that perform the login', (done) => {
        const donePromise = () => {
            done();
            return Promise.resolve(res);
        };
        spyOn(ls, 'processLoginJson');
        spyOn(ls, 'post').and.returnValue(donePromise());
        ls.login();
        expect(ls.processLoginJson).toHaveBeenCalled();
    });

    it('should have a function that store the data in the storage', () => {
        spyOn(ls.storage, 'set');
        ls.storeUser(1);
        expect(ls.storage.set).toHaveBeenCalledWith('user', 1);
    });


});
