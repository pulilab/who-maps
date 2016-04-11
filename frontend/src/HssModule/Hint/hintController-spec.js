import HintModuleController from './HintController';

/* global define, it, describe, expect, spyOn, beforeEach */
let cc = {};

describe('HintModuleController', () => {

    beforeEach(() => {
        cc = HintModuleController.hintControllerFactory()({});
        expect(cc).toBeDefined();
    });

    it('has a function that handle the editMode change', () => {
        cc.handleEditMode(true);
        expect(cc.editMode).toBeTruthy();
    });

    it('has a function that set the layout as ready to be displayed ', () => {
        expect(cc.layoutReady).toBeFalsy();
        cc.layoutDone();
        expect(cc.layoutReady).toBeTruthy();
    });

});
