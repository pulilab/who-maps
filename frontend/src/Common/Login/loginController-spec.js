import loginController from './LoginController';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let lc = {};


describe('loginController', () => {

    beforeEach(() => {
        lc = loginController.loginFactory()();
        lc.loginForm = {
            $valid: {}
        };
    });

    it('should have a function that return the content height of the page ', () => {
        const h = lc.calculateHeight();
        expect(h).toBeDefined();
    });

    it('should have a function that execute the login service', () => {
        lc.user = {};
        spyOn(lc.ls, 'login').and.returnValue(Promise.resolve());
        lc.login();
        expect(lc.ls.login).toHaveBeenCalled();
    });

});
