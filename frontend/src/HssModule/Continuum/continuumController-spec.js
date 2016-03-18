import ContinuumController from './ContinuumController';
import { EE } from '../../Common/';

/* global define, it, describe, expect, beforeEach, jasmine */

let cc = {};
const $timeout = arg => {
    arg();
};

describe('continuumController', () => {

    beforeEach(() => {
        EE.initialize();
        cc = ContinuumController.continuumFactory()($timeout);
        cc.tiles = 7;
    });

    it('should have a function that emit an event if editMode is changed', () => {
        cc.editMode = true;
        const spy = jasmine.createSpy();
        window.EE.on('editMode', spy);
        cc.editModeChange();
        expect(spy).toHaveBeenCalled();
    });


    it('should have a function that return the icon header map of tiles', () => {
        const firstRow = cc.firstRowGenerator();
        expect(firstRow.length).toBe(cc.tiles);

        firstRow.forEach((value) => {
            ['icon', 'colSpan', 'rowSpan', 'className'].forEach(prop => {
                expect(value.hasOwnProperty(prop)).toBeTruthy();
            });
        });

    });

    it('should have a function that return the mother header map of tiles', () => {
        const motherRow = cc.motherRowGenerator();

        motherRow.forEach(value => {
            ['content', 'colSpan', 'rowSpan', 'className', 'invisible',
             'clickHandler', 'columnId', 'activated', 'introName']
            .forEach(prop => {
                expect(value.hasOwnProperty(prop)).toBeTruthy();
            });
        });

    });

    it('should have a function that return the child header map of tiles', () => {
        const childRow = cc.childRowGenerator();

        childRow.forEach(value => {
            ['content', 'colSpan', 'rowSpan', 'className', 'invisible',
             'clickHandler', 'columnId', 'activated', 'introName', 'empty']
            .forEach(prop => {
                expect(value.hasOwnProperty(prop)).toBeTruthy();
            });
        });

    });
});
