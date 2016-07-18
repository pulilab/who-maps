import _ from 'lodash';
import InterventionsController from './InterventionsController';
import { EE } from '../../Common/';
import { continuumData, interventionsLib, target_population, target_population_structure } from '../hssMockData';

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
        ic.data = {
            continuum: continuumData,
            interventions: interventionsLib,
            target_population
        };
        console.log(target_population)
        ic.structure = {
            interventions: interventionsLib,
            target_population: target_population_structure
        };
        ic.service = {
            postInterventions: () => {}
        };
        ic.$onInit();
    });

    it('should have a function that change the edit mode', () => {

        expect(ic.handleEditMode).toBeDefined();
        ic.handleEditMode(true);
        expect(ic.editMode).toBeTruthy();

    });

    it('should have a function that emit the layout-done event', () => {
        spyOn(window.EE, 'emit');
        ic.layoutDone();
        expect(window.EE.emit).toHaveBeenCalled();
    });

    it('should have an onInit function that handle the angular binding', () => {
        ic.interventionRow = void 0;
        expect(ic.interventionRow).not.toBeDefined();
        ic.$onInit();
        expect(ic.interventionRow).toBeDefined();
    });

    it('should have a function that change the activated status of a specific column', () => {

        expect(ic.handleColumnActivation).toBeDefined();
        const mockEvent = {
            columnId: 1,
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

    it('should have a function that check the max number of interventions selected', () => {
        spyOn(ic, 'resizeInterventionsRow');
        ic.interventionRow[0].content = [1, 2, 3];
        ic.checkSelected();
        expect(ic.resizeInterventionsRow).toHaveBeenCalledWith(2);

    });

    it('should have a function that calculate the interventions rows', () => {
        const model = [1, 2, 3, 4];
        spyOn(ic, 'resizeInterventionsRow');
        ic.calculateInterventionHeight(model);
        expect(ic.resizeInterventionsRow).toHaveBeenCalledWith(2.4);
        ic.calculateInterventionHeight({});
        expect(ic.resizeInterventionsRow).toHaveBeenCalledTimes(1);
    });

    it('should have a function that resize all the rows', () => {
        ic.resizeInterventionsRow(9);
        ic.resizeInterventionsRow(null);
        expect(ic.interventionsRowSpan.size).toBe(9);
        _.forEach(ic.interventionRow, item => {
            expect(item.rowSpan).toBe(9);
        });
    });

    it('should have a function that save the interventions', () => {
        spyOn(ic, 'calculateInterventionHeight');
        ic.interventionRow[0].content = [1, 2, 3];
        ic.saveInterventions(0, 'a');
        expect(ic.calculateInterventionHeight).toHaveBeenCalled();
    });
});
