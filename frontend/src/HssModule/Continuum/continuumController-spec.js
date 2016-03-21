import ContinuumController from './ContinuumController';
import { EE } from '../../Common/';

/* global define, it, describe, expect, beforeEach, jasmine, spyOn */

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

    it('should have a function that emits an event if editMode is changed', () => {
        cc.editMode = true;
        const spy = jasmine.createSpy();
        window.EE.on('hssEditMode', spy);
        cc.editModeChange();
        expect(spy).toHaveBeenCalled();
    });

    it('should have a function that returns the icon header map of tiles', () => {
        const firstRow = cc.firstRowGenerator();
        expect(firstRow.length).toBe(cc.tiles);

        firstRow.forEach((value) => {
            ['icon', 'colSpan', 'rowSpan', 'className'].forEach(prop => {
                expect(value.hasOwnProperty(prop)).toBeTruthy();
            });
        });

    });

    it('should have a function that return a string of css classes', () => {
        const tileMock = {
            activated: true,
            columnId: 1,
            className: 'test'
        };
        const classString = cc.classGenerator(tileMock);
        expect(classString).toContain('test even activated');
    });

    it('should have a function that returns the mother header map of tiles', () => {
        const motherRow = cc.motherRowGenerator();

        motherRow.forEach(value => {
            ['content', 'colSpan', 'rowSpan', 'className', 'invisible',
             'clickHandler', 'columnId', 'activated', 'introName']
            .forEach(prop => {
                expect(value.hasOwnProperty(prop)).toBeTruthy();
            });
        });

    });

    it('should have a function that return a string of classes for the child row', () => {
        const tileMock = {
            activated: true,
            columnId: 0,
            className: 'child'

        };
        const classString = cc.childClassGenerator(tileMock);
        expect(classString).toContain('child odd activated empty');
    });

    it('should have a function that returns the child header map of tiles', () => {
        const childRow = cc.childRowGenerator();

        childRow.forEach(value => {
            ['content', 'colSpan', 'rowSpan', 'className', 'invisible',
             'clickHandler', 'columnId', 'activated', 'introName', 'empty']
            .forEach(prop => {
                expect(value.hasOwnProperty(prop)).toBeTruthy();
            });
        });

    });

    it('has a function for activating columns, which runs only in edit mode, and emits globally', () => {

        cc.editMode = true;
        const tileMock = {
            activated: false,
            columnId: 3
        };
        spyOn(window.EE, 'emit');

        cc.toggleColumnActivationClick(tileMock);

        expect(tileMock.activated).toBe(true);
        expect(window.EE.emit).toHaveBeenCalledWith('hssColumnActiveState', [3, true]);

        cc.editMode = false;
        cc.toggleColumnActivationClick(tileMock);

        expect(tileMock.activated).toBe(true);
        expect(window.EE.emit).toHaveBeenCalledTimes(1);

    });

});
