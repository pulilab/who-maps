import ApplicationsController from './ApplicationsController';
import _ from 'lodash';
import { continuumStructure, continuumData, applicationsLib, taxonomyLib } from '../hssMockData';
import { EE } from '../../Common/';
import 'es6-promise';


/* global define, it, xit, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let ac = {};
const $timeout = arg => {
    arg();
};
const $dialog = {
    confirm: () => {
    },

    show: () =>{
        return Promise.resolve();
    }
};
const confirmMock = {
    title: () => {
        return confirmMock;
    },
    textContent: () => {
        return confirmMock;
    },
    ariaLabel: () => {
        return confirmMock;
    },
    ok: () => {
        return confirmMock;
    },
    cancel: () => {
        return confirmMock;
    }
};

const hssBackup = _.cloneDeep(continuumData);

function testObjectProperty(properties, collection) {
    properties.forEach(prop => {
        collection.forEach(item => {
            expect(item.hasOwnProperty(prop)).toBeTruthy();
        });
    });
}


describe('applicationsController', () => {

    beforeEach(() => {
        EE.initialize();
        ac = ApplicationsController.applicationsFactory()($timeout, $dialog);
        ac.tiles = 7;
        ac.structure = {
            taxonomies: taxonomyLib,
            continuum: continuumStructure,
            applications: applicationsLib
        };
        ac.data = {
            continuum: continuumData,
            constraints: taxonomyLib,
            taxonomies: []
        };
        ac.service = {
            postBubbles: () => {},
            postTaxonomy: () => {}
        };
        ac.$onInit();
    });

    afterEach(() => {
        _.merge(continuumData, hssBackup);
    });

    it('should have a function that change the edit mode', () => {

        expect(ac.handleEditMode).toBeDefined();
        ac.handleEditMode(true);
        expect(ac.editMode).toBeTruthy();

    });

    it('should have a function that fire when the grid tile layout are done', () => {
        expect(ac.layoutReady).toBeFalsy();
        ac.layoutDone();
        expect(ac.layoutReady).toBeTruthy();

    });

    it('should have a function that change the activated status of a specific column', () => {
        const mockEvent = {
            activated: true,
            columnId: 0
        };
        ac.handleColumnActivation(mockEvent);
        ac.toggleSubApp(ac.applicationRow[0]);

        const firstColumn = ac.applicationRow[3]; // the zero column is an header
        expect(firstColumn.activated).toBeTruthy();

        const secondColumn = ac.applicationRow[5];
        expect(secondColumn.activated).toBeFalsy();

    });

    it('should have a function that handle the constraints change event', () => {
        const mockEvent = [{ name: 'Information', active: true }];
        ac.constraintsUpdated(mockEvent);
        expect(ac.selectedConstraints.length).toBeGreaterThan(0);
    });

    it('should have a function that returns a base string of class ', () => {
        const tileMock = {
            columnId: 1,
            className: 'test'
        };
        const classString = ac.classGenerator(tileMock);
        expect(classString).toContain('test even');
    });

    xit('should have a function that returns an application specific string of class ', () => {
        const firstColumn = ac.applicationRow[3];
        const classString = ac.applicationClassGenerator(firstColumn);
        expect(classString).toContain('app odd app-main applications_middle_0'
        + ' view-mode application_disabled no-bubble activated app-closed');
    });

    it('should have a function that return the activated '
    + 'state of the column if the mother or child continuum are activated', () => {

        ac.data.continuum[1].state = true;
        expect(ac.applicationActivated(1)).toBeTruthy();

        ac.data.continuum[1].state = false;
        expect(ac.applicationActivated(1)).toBeFalsy();
    });

    it('should have a function that returns an array of application header tile', () => {
        const applicationRow = ac.applicationHeaderGenerator(1);
        testObjectProperty(['content', 'className', 'colSpan', 'rowSpan', 'rowIndex',
            'subApplications', 'applicationId', 'isHeader', 'isMain', 'rowBubbles',
            'classGenerator', 'clickHandler', 'introName', 'applicationStyle'], applicationRow);

    });

    it('should have a function that rerutns an array of application middle column tile', () => {
        const applicationRow = ac.applicationsMiddleColumnDecorator(1);
        testObjectProperty(['content', 'className', 'rowIndex', 'columnId', 'colSpan', 'rowSpan',
            'bubbleDrawn', 'isInput', 'invisible', 'subAppOpen', 'isMain', 'rowEnabled',
            'applicationId', 'activated', 'introName', 'classGenerator', 'clickHandler', 'fatherId'], applicationRow);
    });

    it('should have a function that returns a subApplication specific string of class', () => {
        ac.toggleSubApp(ac.applicationRow[0]);
        const firstColumn = ac.applicationRow[3];
        firstColumn.isMain = false;
        const subApp = _.values(applicationsLib[1].subApplications);
        const classArray = ac.subApplicationClassGenerator(subApp, firstColumn).split(' ');
        _.remove(classArray, item => {
            return item === '';
        });
        const expectedArray = ['app', 'odd', 'app-sub', 'applications_middle_0',
         'view-mode', 'application_disabled', 'no-bubble', 'activated', 'app-closed', 'sub'];
        expect(_.difference(classArray, expectedArray).length).toBe(0);
    });

    it('should have a function that returns a string label for sub applications', () => {
        const tile = {
            rowIndex: 1,
            isMain: false,
            applicationId: 1
        };
        expect(ac.labelGenerator(tile)).toBe('1b');

        tile.isMain = true;

        expect(ac.labelGenerator(tile)).toBe(1);

    });

    it('should have a function that returns an array of sub application header tile', () => {
        const subApp = _.values(applicationsLib[1].subApplications);
        const row = ac.subApplicationHeaderGenerator(subApp, 1, 1);
        testObjectProperty(['content', 'className', 'colSpan', 'rowSpan', 'isInput', 'isHeader', 'isMain',
            'rowEnabled', 'rowIndex', 'fatherId', 'applicationId', 'disabled', 'rowBubbles',
            'classGenerator', 'clickHandler', 'applicationStyle'], row);
    });

    it('should have a function that returns an array of sub application middle tile', () => {
        const subApp = _.values(applicationsLib[1].subApplications);
        const row = ac.subAppMiddleColumnDecorator(subApp, 1, 1);
        testObjectProperty(['content', 'className', 'rowIndex', 'columnId', 'colSpan',
            'rowSpan', 'bubbleDrawn', 'isInput', 'insertMode', 'invisible', 'applicationId',
            'activated', 'fatherId', 'disabled', 'isMain', 'clickHandler', 'classGenerator'], row);
    });

    it('should have a function that returns an array of taxonomy tile', () => {
        const row = ac.taxonomyColumnGenerator(1, 1, false);
        testObjectProperty(['content', 'className', 'colSpan', 'rowSpan', 'fatherId', 'isInput',
            'isSelect', 'isMain', 'disabled', 'isTax', 'rowIndex', 'rowEnabled'], row);
    });

    it('should have a function that returns all the sub application tiles', () => {
        spyOn(ac, 'subApplicationHeaderGenerator').and.returnValue({});
        spyOn(ac, 'subAppMiddleColumnDecorator').and.returnValue({});
        spyOn(ac, 'taxonomyColumnGenerator').and.returnValue({});
        ac.subApplicationRows(1);

        expect(ac.subApplicationHeaderGenerator);
        expect(ac.subAppMiddleColumnDecorator).toHaveBeenCalled();
        expect(ac.taxonomyColumnGenerator).toHaveBeenCalled();
    });

    it('should have a function that returns all the applications tiles', () => {
        spyOn(ac, 'applicationHeaderGenerator').and.returnValue({});
        spyOn(ac, 'applicationsMiddleColumnDecorator').and.returnValue({});
        spyOn(ac, 'subApplicationRows').and.returnValue({});
        spyOn(ac, 'taxonomyColumnGenerator').and.returnValue({});
        ac.applicationRowGenerator();

        expect(ac.applicationHeaderGenerator).toHaveBeenCalled();
        // expect(ac.applicationsMiddleColumnDecorator).toHaveBeenCalled();
        expect(ac.subApplicationRows).toHaveBeenCalled();
        expect(ac.taxonomyColumnGenerator).toHaveBeenCalled();

    });

    it('should have a function that set sub application tiles as enabled when appropriate', () => {

        function customFilterRowTwo(value) {
            return value.fatherId === '2'
                && value.isInput
                && value.columnId === 1;
        }

        function customFilterRowThree(value) {
            return value.fatherId === '3'
                && value.isInput
                && value.columnId === 1;
        }

        ac.applicationRow = _.chain(ac.applicationRow)
            .filter(customFilterRowTwo)
            .map(value => {
                value.content = 'test';
                return value;
            })
            .value();

        ac.applicationRow = ac.createRowStructure(ac.applicationRow);

        expect(ac.rowObject).toBeDefined();

        _.chain(ac.applicationRow)
            .filter(customFilterRowTwo)
            .forEach(value => {
                expect(value.disabled).toBeFalsy();
            })
            .value();

        _.chain(ac.applicationRow)
            .filter(customFilterRowThree)
            .forEach(value => {
                expect(value.disabled).toBeTruthy();
            })
            .value();
    });

    it('should have a function that enable the view of sub applications only in edit mode', () => {
        const firstHeader = _.cloneDeep(ac.applicationRow[0]);

        ac.toggleSubApp(ac.applicationRow[0]);
        expect(_.isEqual(firstHeader, ac.applicationRow[0])).toBeTruthy();

        ac.editMode = true;

        ac.toggleSubApp(ac.applicationRow[0]);
        expect(_.isEqual(firstHeader, ac.applicationRow[0])).toBeFalsy();

        _.chain(ac.applicationRow)
            .filter(value => {
                return value.fatherId && value.fatherId === firstHeader.applicationId;
            })
            .forEach(value => {
                expect(value.disabled).toBeFalsy();
            })
            .value();
    });

    it('should have a function that enable all the sub applicaiton when entering edit mode', () => {
        expect(ac.applicationRow[3].disabled).toBeTruthy();
        ac.openAllSubApp();
        expect(ac.applicationRow[3].disabled).toBeTruthy();
        ac.editMode = true;
        ac.openAllSubApp();
        _.forEach(ac.applicationRow, tile => {
            expect(tile.disabled).toBeFalsy();
        });
    });

    it('should have a function that counts click and execute appropriate'
    + 'functions based on click number, only in edit mode', () => {
        spyOn(ac, 'tileBalloonStartHandler');
        spyOn(ac, 'tileBalloonEndHandler');


        expect(ac.tileClickCounter).toBe(0);
        ac.toggleSubApp(ac.applicationRow[0]);
        const firstColumn = ac.applicationRow[3];

        ac.appClickHandler(firstColumn);
        expect(ac.tileClickCounter).toBe(0);
        expect(ac.tileBalloonStartHandler).not.toHaveBeenCalled();
        expect(ac.tileBalloonEndHandler).not.toHaveBeenCalled();

        ac.editMode = true;
        ac.appClickHandler(firstColumn);
        expect(ac.tileClickCounter).toBe(1);
        expect(ac.tileBalloonStartHandler).toHaveBeenCalled();
        expect(ac.tileBalloonEndHandler).not.toHaveBeenCalled();

        ac.appClickHandler(firstColumn);
        expect(ac.tileClickCounter).toBe(0);
        expect(ac.tileBalloonStartHandler).toHaveBeenCalledTimes(1);
        expect(ac.tileBalloonEndHandler).toHaveBeenCalled();
    });

    it('should have a function that catches the enter key', () => {
        const mockEvent = {
            which: 14
        };
        spyOn(ac, 'focusBubble');
        ac.inputHandler({}, mockEvent);
        expect(ac.focusBubble).not.toHaveBeenCalled();

        mockEvent.which = 13;
        ac.inputHandler({}, mockEvent);
        expect(ac.focusBubble).toHaveBeenCalled();
    });

    it('should have a function that find proper tiles candidate to create a bubble', () => {
        ac.toggleSubApp(ac.applicationRow[0]);

        ac.startTile = ac.applicationRow[6];
        let candidates = ac.findSameRowCandidate(ac.applicationRow[7]);
        expect(candidates.length).toBe(2);

        _.forEach(candidates, candidate => {
            expect(candidate.rowIndex).toBe(ac.startTile.rowIndex);
            expect(candidate.fatherId).toBe(ac.startTile.fatherId);
            expect(candidate.columnId).toBeLessThan(ac.applicationRow[7].columnId + 1);
            expect(candidate.columnId).toBeGreaterThan(ac.startTile.columnId - 1);
        });

        ac.startTile = ac.applicationRow[1];
        candidates = ac.findSameRowCandidate(ac.applicationRow[4]);
        expect(candidates.length).toBe(0);

        ac.startTile = ac.applicationRow[5];
        ac.startTile.fatherId = 9;
        candidates = ac.findSameRowCandidate(ac.applicationRow[6]);
        expect(candidates.length).toBe(0);
    });

    it('should have a function that return an empty list if a list'
    + 'with no contiguous activated tile is provided ', () =>{
        const mockTiles = [
            { columnId: 2 },
            { columnId: 3 },
            { columnId: 4 }];
        let result = ac.isRowContiguous(mockTiles);
        expect(result.length).toBe(3);

        mockTiles[2].columnId = 99;
        result = ac.isRowContiguous(mockTiles);
        expect(result.length).toBe(0);
    });

    it('should have a function that set the startTile ', () => {

        expect(_.isEmpty(ac.startTile)).toBeTruthy();

        ac.tileBalloonStartHandler({ columnId: 1 });
        expect(_.isEmpty(ac.startTile)).toBeFalsy();
    });

    it('should have a function that redesign the tile when a balloon ' +
        'is created and reset the startTile if invalid tile is supplied', () => {

        // This guy here should probably be an inner describe... @___@
        ac.toggleSubApp(ac.applicationRow[0]);

        const initialTiles = ac.applicationRow.length;
        ac.startTile = ac.applicationRow[6];

        const tile = ac.applicationRow[6];
        expect(tile.colSpan).toBe(1);

        ac.tileBalloonEndHandler(ac.applicationRow[8]);

        expect(tile.colSpan).toBe(3);
        expect(tile.bubbleDrawn).toBeTruthy();

        expect(tile.status).toBe(ac.applicationRow[0].applicationStyle);
        expect(ac.applicationRow.length).toBe(initialTiles - 2);

        ac.tileBalloonEndHandler(ac.applicationRow[4]);
        expect(ac.startTile).toBeUndefined();
    });

    it('should have a function that perform a bubble deletion', () => {
        const tile = ac.applicationRow[6];
        ac.startTile = tile;
        ac.tileBalloonEndHandler(ac.applicationRow[7]);
        expect(tile.bubbleDrawn).toBeTruthy();
        ac.deleteBubble(tile);
        expect(tile.bubbleDrawn).toBeFalsy();
        expect(ac.applicationRow[6].colSpan).toBe(1);
        expect(ac.applicationRow[2].rowBubbles.length).toBe(0);
    });

    it('should have a function that call a confirm dialog', () => {
        spyOn(ac.dialog, 'confirm').and.returnValue(confirmMock);
        ac.confirmDeleteBubble({});
        expect(ac.dialog.confirm).toHaveBeenCalled();
    });

    it('should have a function that search for columns with content', () => {
        spyOn(window.EE, 'emit');
        ac.searchForFilledColumns();
        expect(window.EE.emit).toHaveBeenCalled();
    });

    it('should have a function to save the taxonomy', () => {
        spyOn(ac.hs, 'postTaxonomy');
        ac.saveTaxonomy(0, 0);
        expect(ac.hs.postTaxonomy).toHaveBeenCalled();
    });

    it('should have a function to handle the change event', () => {
        spyOn(ac, 'saveBubbles');
        ac.changeHandler({});
        expect(ac.saveBubbles).toHaveBeenCalled();
    });

    it('should have a function that save the bubbles to the backend', () => {
        spyOn(ac.hs, 'postBubbles');
        ac.saveBubbles({});
        expect(ac.hs.postBubbles).toHaveBeenCalled();
    });
});
