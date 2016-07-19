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

const CommonService = {
    userProfile: {
        viewer: [],
        member: []
    }
};

describe('HssModuleController', () => {

    beforeEach(() => {
        cc = HssModuleController.hssControllerFactory()($scope, $state);
        expect(cc).toBeDefined();
        cc.cs = CommonService;
        cc.$onInit();
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
        const mockValues = 2;
        expect(cc.dataReady).toBeFalsy();
        cc.handleServerData(mockValues);
        expect(cc.dataReady).toBeTruthy();
        expect(cc.data).toBe(mockValues);
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


    it('simply forwards simple activation requests', () => {
        spyOn(window.EE, 'emit');
        const mock = 'this string should be an object';
        cc.askedToActivateColumn(mock);
        expect(window.EE.emit).toHaveBeenCalled();
    });
});
