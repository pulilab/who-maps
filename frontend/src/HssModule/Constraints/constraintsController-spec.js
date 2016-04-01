import ConstraintsController from './ConstraintsController';
import { EE } from '../../Common/';

/* global define, it, describe, expect, beforeEach, jasmine, spyOn */

let cc = {};
const $timeout = arg => {
    arg();
};

describe('constraintsController', () => {

    beforeEach(() => {
        EE.initialize();
        cc = ConstraintsController.constraintsFactory()($timeout);
    });

    it('should have a function that change the edit mode', () => {

        expect(cc.handleEditMode).toBeDefined();
        cc.handleEditMode(true);
        expect(cc.editMode).toBeTruthy();

    });

    it('should have a function that return an array of constraints toggles', () => {
        const constraints = cc.constraintsToggleGenerator();
        constraints.forEach(value => {
            ['name', 'icon', 'active']
                .forEach(prop => {
                    expect(value.hasOwnProperty(prop)).toBeTruthy();
                });
        });
    });

    it('should have a function that emit the constraint object globally', () => {
        spyOn(window.EE, 'emit');
        cc.constraints = cc.constraintsToggleGenerator();
        cc.constraintChanged();
        expect(window.EE.emit)
            .toHaveBeenCalledWith('hssConstraintsSelected', cc.constraints);
    });

    it('should have a function that check the number of selected constraints and fire a callback if present', () => {
        const cb = jasmine.createSpy('callback');
        cc.resizeCallback = cb;
        cc.checkSizeAndFireCallback();
        expect(cb).toHaveBeenCalled();
    })

});
