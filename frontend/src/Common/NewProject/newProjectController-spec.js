import newProjectController from './NewProjectController';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let sc = {};


describe('newProjectController', () => {

    beforeEach(() => {
        sc = newProjectController.newProjectFactory()();
    });

});
