import LoginService from './LoginService';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let ls = {};


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

    it('should have a function that store the data in the storage', () => {
        spyOn(ls.storage, 'set');
        ls.storeUser(1);
        expect(ls.storage.set).toHaveBeenCalledWith('user', 1);
    });


});
