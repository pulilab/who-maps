import InterventionsController from './InterventionsController';
import { EE } from '../../Common/';

/* global define, it, describe, expect, beforeEach, jasmine, spyOn */

let ic = {};
const $timeout = arg => {
    arg();
};

describe('interventionsController', () => {

    beforeEach(() => {
        EE.initialize();
        ic = InterventionsController.interventionsFactory()($timeout);
        ic.tiles = 7;
        ic.interventionRow = ic.middleColumnGenerator();
    });

    it('should have a function that change the edit mode', () => {

        expect(ic.handleEditMode).toBeDefined();
        ic.handleEditMode(true);
        expect(ic.editMode).toBeTruthy();

    });

    it('should have a function that change the activated status of a specific column', () => {

        expect(ic.handleColumnActivation).toBeDefined();
        const mockEvent = {
            columnId: 0,
            activated: true
        };

        ic.handleColumnActivation(mockEvent);

        const firstTile = ic.interventionRow[mockEvent.columnId];
        expect(firstTile.activated).toBeTruthy();

        const secondTile = ic.interventionRow[mockEvent.columnId + 1];
        expect(secondTile.activated).toBeFalsy();
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

        ic.interventionRow.forEach(value => {
            ['content', 'colSpan', 'rowSpan', 'className',
                'columnId', 'activated', 'introName', 'selectValues',
                'classGenerator']
                .forEach(prop => {
                    expect(value.hasOwnProperty(prop)).toBeTruthy();
                });
        });

    });
});
