import ContinuumController from './ContinuumController';
import { EE } from '../../Common/';

/* global define, it, describe, expect, beforeEach, jasmine, spyOn, xit */

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
            ['type', 'icon', 'colSpan', 'rowSpan'].forEach(prop => {
                expect(value.hasOwnProperty(prop)).toBeTruthy();
            });
        });
    });

    it('should have a function that returns the mother header map of tiles', () => {
        const motherRow = cc.motherRowGenerator();

        motherRow.forEach(value => {
            ['type', 'content', 'colSpan', 'rowSpan', 'invisible',
             'clickHandler', 'columnId', 'activated', 'introName']
            .forEach(prop => {
                expect(value.hasOwnProperty(prop)).toBeTruthy();
            });
        });
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

    it('should have a function that return a string of css classes', () => {
        let tileMock = {
            type: 'firstrow',
            activated: true,
            columnId: 1
        };
        let classString = cc.classGenerator(tileMock);
        ['firstrow', 'even', 'activated'].forEach(clas => {
            expect(classString).toContain(clas);
        });

        tileMock = {
            type: 'mother',
            activated: false,
            columnId: 2
        };
        classString = cc.classGenerator(tileMock);
        ['mother', 'odd', 'deactivated'].forEach(clas => {
            expect(classString).toContain(clas);
        });
    });

    it('classGenerator fn. that return a string of classes for the child row', () => {
        const tileMock = {
            activated: true,
            columnId: 0,
            type: 'child'

        };
        const classString = cc.classGenerator(tileMock);
        expect(classString).toContain('child odd activated zindex-100 empty');
    });

    describe('has a function for activating columns', () => {

        it(', which runs only in edit mode', () => {
            cc.editMode = false;
            const tileMock = {
                activated: false,
                columnId: 3
            };
            cc.toggleColumnActivationClick(tileMock);
            expect(tileMock.activated).toBe(false);
        });

        it(', which doesn\'t execute on empty tiles', () => {
            cc.editMode = true;
            const tileMock = {
                activated: false,
                columnId: 3,
                empty: true
            };
            cc.toggleColumnActivationClick(tileMock);
            expect(tileMock.activated).toBe(false);
        });

        it(', which emits to hss controller, and uses response event to simply activate col', () => {
            spyOn(window.EE, 'emit');
            spyOn(cc, 'checkColumnActivation');
            const tileMock = {
                activated: false,
                columnId: 3
            };
            cc.editMode = true;
            cc.toggleColumnActivationClick(tileMock);
            expect(window.EE.emit).toHaveBeenCalledWith('hssPleaseActivateColumn', {
                columnId: 3,
                activated: true
            });
            expect(cc.checkColumnActivation).toHaveBeenCalledWith(tileMock);

        });

        xit(', which handles row logic, and emits globally', () => {
            spyOn(window.EE, 'emit');

            cc.editMode = true;
            const tileMock = {
                activated: false,
                columnId: 3
            };
            cc.firstRow = [0, 1, 2, {
                activated: false
            }];
            cc.toggleColumnActivationClick(tileMock);
            expect(cc.firstRow[3].activated).toBe(true);
            expect(tileMock.activated).toBe(true);

            cc.toggleColumnActivationClick(tileMock);
            expect(cc.firstRow[3].activated).toBe(false);
            expect(tileMock.activated).toBe(false);

            expect(window.EE.emit).toHaveBeenCalled();

        });
    });

    xit('has a fn., that emits on columnactivation', () => {
        expect(cc.columnChEmit).toBeDefined();
        spyOn(window.EE, 'emit');
        cc.columnChEmit(2, true);
        expect(window.EE.emit).toHaveBeenCalledWith('hssColumnActiveState', {
            columnId: 2,
            activated: true
        });
    });

    it('has a function for exporting a -pdf file', () => {
        spyOn(console, 'warn');
        expect(cc.exportPdf).toBeDefined();
        cc.exportPdf();
        expect(console.warn).toHaveBeenCalledWith('The "export to .pdf" function is not yet available!');
    });

});
