import termsOfUseController from '../../src/Common/TermsOfUse/TermsOfUseController';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let lc = {};


describe('loginController', () => {

    beforeEach(() => {
        lc = termsOfUseController.termOfUseFactory()();
        lc.loginForm = {
            $valid: {}
        };
    });

});
