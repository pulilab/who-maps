import termsOfUseController from '../../src/Common/TermsOfUse/TermsOfUseController';

/* global  it, describe, expect, beforeEach, afterEach, Promise */

let lc = {};

describe('loginController', () => {
  beforeEach(() => {
    lc = termsOfUseController.termOfUseFactory()();
    lc.loginForm = {
      $valid: {}
    };
  });
});
