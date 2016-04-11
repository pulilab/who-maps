import ProjectPartnersController from './ProjectPartnersController';
import { EE } from '../../Common/';

/* global define, it, describe, expect, beforeEach, jasmine, spyOn, xit */

let cc = {};
const $timeout = arg => {
    arg();
};

describe('HSS project partner controller', () => {

    beforeEach(() => {
        EE.initialize();
        cc = ProjectPartnersController.projectPartnersFactory()({}, $timeout, {});
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
        const logo = '' + cc.logos[0];

        cc.editMode = false;
        cc.delLogo(logo);
        expect(cc.logos[0]).toBe(logo);

        cc.editMode = true;
        cc.delLogo(logo);
        expect(cc.logos[0]).not.toBe(logo);
    });


    xit('calls upload on filechange', () => {
        document.getElementById = () => {
            return {
                files: [1]
            };
        };
        spyOn(cc, 'uploadLogo');

        cc.fileChange();
        expect(cc.uploadLogo).toHaveBeenCalledWith(1);
    });


});
