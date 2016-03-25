import IntroJsController from './IntroJsController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn */

let ic = {};
const $timeout = arg => {
    arg();
};

describe('introJsController', () => {

    beforeEach(() => {
        ic = IntroJsController.introJsFactory($timeout);
        console.log(ic);
    });

});
