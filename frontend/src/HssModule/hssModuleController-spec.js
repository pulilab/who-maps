import HssModuleController from './HssModuleController';
import _ from 'lodash';
/* global define, it, describe, expect, spyOn, beforeEach */
let cc = {};
const $scope = {
    $evalAsync: () => {}
};

const $state = {
    params: {}
};

const $animate = {
    enabled: () => {}
};

describe('HssModuleController', () => {

    beforeEach(() => {
        cc = HssModuleController.hssControllerFactory()($scope, $state, $animate);
        expect(cc).toBeDefined();
    });

    it('has a function that handle the editMode change', () => {
        cc.handleEditMode(true);
        expect(cc.editMode).toBeTruthy();
    });

    it('has a function that handle the layout-done event', () => {
        expect(cc.gridLoading).toBe(3);
        _.forEach(_.range(cc.gridLoading), () => {
            cc.handleLayoutEvent();
        });
        expect(cc.gridLoading).toBe(0);
        cc.handleLayoutEvent();
        expect(cc.gridLoading).toBe(0);
    });

    it('has a function that handle the backend data and structure', () => {
        const mockValues = [1, 2];
        expect(cc.dataReady).toBeFalsy();
        cc.handleServerData(mockValues);
        expect(cc.dataReady).toBeTruthy();
        expect(cc.structure).toBe(1);
        expect(cc.data).toBe(2);
    });

    it('has a function which refreshes the array containing info about column contents', () => {
        const arrMock = [true, true, false, true];
        cc.reFresh(arrMock);
        expect(cc.columnHasContent).toBe(arrMock);
    });

    it('answers to questions regarding columns having content', () => {
        spyOn(window.EE, 'emit');
        cc.onAskIfColumnGotContent();
        expect(window.EE.emit).toHaveBeenCalled();
    });

    it('answers to questions regarding last two column having any content', () => {
        spyOn(window.EE, 'emit');
        cc.onLastTwoContentAsked();
        expect(window.EE.emit).toHaveBeenCalled();
    });

    it('simply forwards simple activation requests', () => {
        spyOn(window.EE, 'emit');
        const mock = 'this string should be an object';
        cc.askedToActivateColumn(mock);
        expect(window.EE.emit).toHaveBeenCalled();
    });
});
