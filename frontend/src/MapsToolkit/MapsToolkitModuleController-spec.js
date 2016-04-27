import _ from 'lodash';
import MapsToolkitModuleController from './MapsToolkitModuleController';

/* global define, it, describe, expect, beforeEach, spyOn, Promise */
let mc = {};

const $state = {
    params: {
        axisId: 0,
        domainId: 0
    },
    go: () => {
    },
    current: {
        name: ''
    }
};

const $scope = {
    $evalAsync: () => {}
};

const mockData = require('./Resource/mockData.json');

const mockInvariantData = () => {
    return _.cloneDeep(mockData);
};

describe('MapsToolkitModuleController', () => {

    beforeEach(() => {

        $state.params.axisId = 0;
        $state.params.domainId = 0;
        spyOn(MapsToolkitModuleController.prototype, 'handleChangeAxis').and.callThrough();
        spyOn(MapsToolkitModuleController.prototype, 'handleChangeDomain').and.callThrough();
        mc = new MapsToolkitModuleController.mapsControllerFactory()($scope, $state);
        mc.processAxesData(mockInvariantData());


    });

    it('should have a function that check the state and load the data', () => {
        spyOn(mc.ms, 'getProjectData').and.returnValue(Promise.resolve());
        mc.loadData();
        expect(mc.ms.getProjectData).toHaveBeenCalled();
        spyOn(mc.state, 'go');
        mc.axisId = '';
        mc.loadData();
        expect(mc.state.go).toHaveBeenCalled();

    });

    it('should have a function that handle a change of axis event', () => {
        window.EE.emit('mapsAxisChange');
        expect(mc.handleChangeAxis).toHaveBeenCalled();
    });

    it('should have a function that import all the html templates in a dictionary', () => {
        const t = mc.importHtmlTemplates();
        expect(t).toBeDefined();
        expect(t['1-1-3']).toBeDefined();
    });

    it('should have a function that prepare the axis data', () => {
        spyOn(mc, 'importHtmlTemplates').and.callThrough();
        mc.processAxesData(mockInvariantData());
        expect(mc.rawData).toBeDefined();
        expect(mc.domainStructure).toBeDefined();
        expect(mc.importHtmlTemplates).toHaveBeenCalled();
        expect(mc.domain).toBeDefined();
        expect(mc.dataLoaded).toBe(true);
    });

    it('should have a function that return an integer flex size based on the number of questions', () => {
        const q = {
            choices: [1, 2, 3]
        };
        let size = mc.calculateMainBoxSize(q);
        expect(size).toBe(60);
        size = mc.calculateMainBoxSize();
        expect(size).toBe(40);

    });

    it('should have a function that return true if the checkbox value match the current answer points', () => {
        let result = mc.checkChecked(0, 0, 2);
        expect(result).toBe(true);
        result = mc.checkChecked(0, 0, 1);
        expect(result).toBe(false);
    });

    it('should have a function that save the answer selected', () => {
        expect(mc.score).toBe(2);
        spyOn(mc.ms, 'saveAnswer');
        mc.setAnswer(0, 0, 0);
        expect(mc.score).toBe(0);
        expect(mc.ms.saveAnswer).toHaveBeenCalled();
        expect(mc.data.questions[0].answers[0].value).toBe(0);
    });

    it('should have a function that  disable the backbutton', () => {
        mc.domainId = 0;
        let res = mc.backButtonDisabled();
        expect(res).toBe(true);
        mc.domainId = 1;
        res = mc.backButtonDisabled();
        expect(res).toBe(false);
    });

    it('should have a function that disable the forward button', () => {
        mc.domainId = 2;
        let res = mc.forwardButtonDisabled();
        expect(res).toBe(true);
        mc.domainId = 1;
        res = mc.forwardButtonDisabled();
        expect(res).toBe(false);
    });

    it('should have a function that move to the next domain', () => {
        mc.domainId = 0;
        mc.goToNextDomain();
        expect(mc.handleChangeDomain).toHaveBeenCalled();
        mc.domainId = 2;
        mc.goToNextDomain();
        expect(mc.handleChangeDomain).toHaveBeenCalledTimes(1);
    });

    it('should have a function that move to the prev domain', () => {
        mc.domainId = 1;
        mc.goToPrevDomain();
        expect(mc.handleChangeDomain).toHaveBeenCalled();
        mc.domainId = 0;
        mc.goToPrevDomain();
        expect(mc.handleChangeDomain).toHaveBeenCalledTimes(1);
    });
});
