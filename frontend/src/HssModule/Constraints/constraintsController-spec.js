import ConstraintsController from './ConstraintsController';
import { taxonomyLib, constraintsData, taxonomiesData } from '../hssMockData';
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
        cc.structure = {
            taxonomies: taxonomyLib
        };
        cc.data = {
            constraints: constraintsData,
            taxonomies: taxonomiesData
        };
        cc.service = {
            postConstraints: () => {}
        };
        cc.$onInit();
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

    it('should have a function that check the number of selected constraints and fire a callback if present', () => {
        const cb = jasmine.createSpy('callback');
        cc.resizeCallback = cb;
        cc.checkSizeAndFireCallback();
        expect(cb).toHaveBeenCalled();
    });

    it('should have a function that can get a constraint category from a taxonomy', () => {
        expect(cc.getConstraintCategoryFromTaxonomy('Lack of population enumeration')).toEqual('Information');
    });

    it('should have a function that determines active constraints from current taxonomies', () => {
        expect(cc.getActiveConstraints()).toEqual(['Availability', 'Quality']);
    });

});
