import ProjectPartnersController from './ProjectPartnersController';
import { EE } from '../../Common/';

/* global define, it, describe, expect, beforeEach, jasmine, spyOn, xit, Promise */

let cc = {};

const $state = {
    params: {
        appName: 1
    }
};

const $scope = {
    $evalAsynch: jasmine.createSpy('evalasync')
};

describe('HSS project partner controller', () => {

    beforeEach(() => {
        EE.initialize();
        cc = ProjectPartnersController.projectPartnersFactory()($scope, $state, {});
        cc.$onInit();
    });


    it('is defined and can be instantiated', () => {
        expect(cc).toBeDefined();
    });


    it('changes inner, bindable editMode prop upon the proper events', () =>{
        expect(cc.editMode).toBe(false);
        cc.EE.emit('hssEditMode', true);
        expect(cc.editMode).toBe(true);
    });


    it('has a method for deleting logos', () => {
        spyOn(cc.pps, 'deleteLogo').and.returnValue(Promise.resolve());
        cc.logos = [{ id: 1 }];
        const logo = cc.logos[0];

        cc.editMode = false;
        cc.delLogo(logo);
        expect(cc.logos[0]).toBe(logo);

        cc.editMode = true;
        cc.delLogo(logo);
        expect(cc.pps.deleteLogo).toHaveBeenCalledTimes(1);
    });
});
