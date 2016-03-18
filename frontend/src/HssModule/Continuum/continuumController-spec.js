import ContinuumController from './ContinuumController';
import { EE } from '../../Common/';

/* global define, it, describe, expect, beforeEach */

let cc = {};
const $timeout = (arg) => {
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
            expect(value.hasOwnProperty('icon')).toBeTruthy();
            expect(value.hasOwnProperty('colSpan')).toBeTruthy();
            expect(value.hasOwnProperty('rowSpan')).toBeTruthy();
            expect(value.hasOwnProperty('className')).toBeTruthy();
        });

    });

    it('should have a function that return the mother header map of tiles', () => {
        const motherRow = cc.motherRowGenerator();

        motherRow.forEach((value) => {
            expect(value.hasOwnProperty('content')).toBeTruthy();
            expect(value.hasOwnProperty('colSpan')).toBeTruthy();
            expect(value.hasOwnProperty('rowSpan')).toBeTruthy();
            expect(value.hasOwnProperty('className')).toBeTruthy();
            expect(value.hasOwnProperty('invisible')).toBeTruthy();
            expect(value.hasOwnProperty('clickHandler')).toBeTruthy();
            expect(value.hasOwnProperty('columnId')).toBeTruthy();
            expect(value.hasOwnProperty('activated')).toBeTruthy();
            expect(value.hasOwnProperty('introName')).toBeTruthy();
        });

    });

    it('should have a function that return the child header map of tiles', () => {
        const childRow = cc.childRowGenerator();

        childRow.forEach((value) => {
            expect(value.hasOwnProperty('content')).toBeTruthy();
            expect(value.hasOwnProperty('colSpan')).toBeTruthy();
            expect(value.hasOwnProperty('rowSpan')).toBeTruthy();
            expect(value.hasOwnProperty('className')).toBeTruthy();
            expect(value.hasOwnProperty('invisible')).toBeTruthy();
            expect(value.hasOwnProperty('clickHandler')).toBeTruthy();
            expect(value.hasOwnProperty('columnId')).toBeTruthy();
            expect(value.hasOwnProperty('activated')).toBeTruthy();
            expect(value.hasOwnProperty('introName')).toBeTruthy();
            expect(value.hasOwnProperty('empty')).toBeTruthy();
        });

    });
});
