import ApplicationsController from './ApplicationsController';
import { EE } from '../../Common/';

/* global define, it, describe, expect, beforeEach, jasmine, spyOn */

let ic = {};
const $timeout = arg => {
    arg();
};

describe('applicationsController', () => {

    beforeEach(() => {
        EE.initialize();
        ic = ApplicationsController.applicationsFactory()($timeout);
        ic.tiles = 7;
        ic.applicationRow = ic.applicationRowGenerator();
    });

    it('should have a function that change the edit mode', () => {

        expect(ic.handleEditMode).toBeDefined();
        ic.handleEditMode(true);
        expect(ic.editMode).toBeTruthy();

    });

    it('should have a function that change the activated status of a specific column', () => {

    });

    it('should have a function that returns a string of class ', () => {
        const tileMock = {
            columnId: 1,
            className: 'test'
        };
        const classString = ic.classGenerator(tileMock);
        expect(classString).toContain('test even');
    });

    it('should have a function that returns the interventions map of tiles', () => {


    });
});
