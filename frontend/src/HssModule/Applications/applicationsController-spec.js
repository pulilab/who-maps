import ApplicationsController from './ApplicationsController';
import _ from 'lodash';
import { hss, applicationsLib } from '../hssMockData';
import { EE } from '../../Common/';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn */

let ac = {};
const $timeout = arg => {
    arg();
};
const hssBackup = _.cloneDeep(hss);

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
        ac = ApplicationsController.applicationsFactory()($timeout);
        ac.tiles = 7;
        ac.applicationRow = ac.applicationRowGenerator();
    });

    afterEach(() => {
        _.merge(hss, hssBackup);
    });

    it('should have a function that change the edit mode', () => {

        expect(ac.handleEditMode).toBeDefined();
        ac.handleEditMode(true);
        expect(ac.editMode).toBeTruthy();

    });

    it('should have a function that change the activated status of a specific column', () => {
        const mockEvent = {
            activated: true,
            columnId: 0
        };
        ac.handleColumnActivation(mockEvent);
        const firstColumn = ac.applicationRow[1].activated; // the zero column is an header
        expect(firstColumn).toBeTruthy();

        const secondColumn = ac.applicationRow[2].activated;
        expect(secondColumn.activated).toBeFalsy();

    });

    it('should have a function that returns a base string of class ', () => {
        const tileMock = {
            columnId: 1,
            className: 'test'
        };
        const classString = ac.classGenerator(tileMock);
        expect(classString).toContain('test even');
    });

    it('should have a function that returns an application specific string of class ', () => {
        const firstColumn = ac.applicationRow[1];
        const classString = ac.applicationClassGenerator(firstColumn);
        expect(classString).toContain('odd application_disabled no-bubble activated app-closed applications_middle_0 empty-tile');
    });

    it('should have a function that return the activated state of the column if the mother or child continuum are activated', () => {

        hss[1].mother.activated = true;
        expect(ac.applicationActivated(1)).toBeTruthy();

        hss[1].mother.activated = false;
        expect(ac.applicationActivated(1)).toBeFalsy();

        hss[1].child.activated = true;
        expect(ac.applicationActivated(1)).toBeTruthy();

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
        const firstColumn = ac.applicationRow[1];
        const subApp = _.values(applicationsLib[1].subApplications);
        const classString = ac.subApplicationClassGenerator(subApp, firstColumn);
        expect(classString).toContain('odd application_disabled no-bubble activated app-closed applications_middle_0 empty-tile');
    });

    it('should have a function that returns a string label for sub applications', () => {
        expect(ac.appLabelGenerator(1, 0)).toBe('1a');
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
        expect(ac.applicationsMiddleColumnDecorator).toHaveBeenCalled();
        expect(ac.subApplicationRows).toHaveBeenCalled();
        expect(ac.taxonomyColumnGenerator).toHaveBeenCalled();

    });

    it('should have a function that set sub application tiles as enabled when appropriate', () => {
        _.chain(ac.applicationRow)
            .filter(value => {
                return value.fatherId === '2'
                    && value.isInput
                    && value.columnId === 1;
            })
            .map(value => {
                return value;
            })
            .value();
    });
});
