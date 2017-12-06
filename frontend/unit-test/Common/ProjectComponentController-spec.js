import ProjectComponentController from '../../src/Common/ProjectComponent/ProjectComponentController';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let pcc = {};

describe('ProjectComponentController', () => {

    beforeEach(() => {
        spyOn(ProjectComponentController.prototype, 'initialization').and.callThrough();
        pcc = new ProjectComponentController();
        pcc.$onInit();
    });

    it('should have a function that handle the initialization', () => {
        pcc.$onInit();
        expect(pcc.initialization).toHaveBeenCalled();
    });

});
