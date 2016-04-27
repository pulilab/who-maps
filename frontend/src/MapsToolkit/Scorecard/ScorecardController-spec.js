import _ from 'lodash';
import ScorecardController from './ScorecardController';

/* global define, it, describe, expect, beforeEach, afterEach, spyOn, Promise, jasmine */

let sc = {};

const $state = {
    params: {
        axisId: 0,
        domainId: 0,
        appName: 1
    },
    go: jasmine.createSpy('go'),
    current: {
        name: ''
    }
};

const $scope = {
    $evalAsync: jasmine.createSpy('eval')
};

const mockData = require('../Resource/mockData.json');

const mockInvariantData = () => {
    return _.cloneDeep(mockData);
};

describe('ScorecardController', () => {

    beforeEach(() => {
        spyOn(ScorecardController.prototype, 'initialization').and.callThrough();
        sc = ScorecardController.scorecardFactory()($scope, $state);
        sc.$onInit();
    });

    afterEach(() => {
        sc.state.go.calls.reset();
    });

    it('should have a function that initializes the component', () => {
        expect(sc.initialization).toHaveBeenCalled();
        expect(sc.projectId).toBeDefined();
        expect(sc.axisId).toBeDefined();
    });

    it('should have a function that processes the data', () => {
        const mock = mockInvariantData();
        sc.handleProjectData(mock);
        expect(sc.axesSize).toBe(mock.length);
        expect(sc.data).toBeDefined();
        expect(sc.dataLoaded).toBe(true);
        expect(sc.scope.$evalAsync).toHaveBeenCalled();
    });

    it('should have a function that leads to the maps toolkit on the proper domain', () => {
        const d = {
            id: 1
        };
        sc.updateScore(d);
        expect(sc.state.go).toHaveBeenCalledWith('maps', { axisId: 0, domainId: 0 });
    });

    it('should have a function that goes to the next axis in the maps page', () => {
        sc.goToNextAxis();
        expect(sc.state.go).toHaveBeenCalledWith('maps', { axisId: 1 });
    });

    it('should have a function that disable go to next axis if is the last one', () => {
        sc.handleProjectData(mockInvariantData());
        let r = sc.disableGoToNextAxis();
        expect(r).toBe(false);
        sc.axisId = sc.axesSize;
        r = sc.disableGoToNextAxis();
        expect(r).toBe(true);
    });

    it('should not filter data when its in summary mode', () => {
        sc.summary = true;
        sc.handleProjectData(mockInvariantData());
        const summaryData = sc.data;
        sc.summary = false;
        sc.handleProjectData(mockInvariantData());
        expect(sc.data).not.toBe(summaryData);
        expect(sc.data.domains).toBeDefined();
        expect(summaryData.domains).not.toBeDefined();
        expect(summaryData[0].domains).toBeDefined();
    });

    it('should have a function that injects axis data', () => {
        sc.handleProjectData(mockInvariantData());
        expect(sc.data.axisName).toBeDefined();
        expect(sc.data.axisClass).toBeDefined();
        expect(sc.data.axisPicture).toBeDefined();
    });

});
