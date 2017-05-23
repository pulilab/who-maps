import SkeletonController from './SkeletonController.js';
import { $scope, $interpolate, $anchorScroll } from '../../testUtilities';
import mock from './mockStructure.js';
import _ from 'lodash';

/* global define, it, describe, expect, beforeEach, spyOn, Promise, jasmine */
let vm;
const scope = $scope(vm);

describe('SkeletonController', () => {

    beforeEach(() => {
        vm = new SkeletonController.skeletonFactory(mock, 0, 0)(scope, $interpolate, $anchorScroll);
    });

    it('is defined', () => {
        expect(vm).toBeDefined();
    });

    it('has a fn. which returns the raw HTML content from the static "help" files', () => {
        expect(vm.importHtmlTemplates).toBeDefined();
        const test = vm.importHtmlTemplates();

        // Actual nr. can change, if static site counts change
        expect(_.keys(test).length).toBe(32);

    });

    it('has a fn. which changes Id\'s, and calls domain activator toggler', () => {
        expect(vm.changeSpot).toBeDefined();
        spyOn(vm, 'domainActivationSetter');

        vm.changeSpot(0, 0);
        expect(vm.axis).toBe(0);
        expect(vm.domain).toBe(0);
        expect(vm.domainActivationSetter).toHaveBeenCalled();

        vm.changeSpot(2, 2);
        expect(vm.axis).toBe(2);
        expect(vm.domain).toBe(2);
        expect(vm.domainActivationSetter).toHaveBeenCalled();
    });

    it('has a fn. which toggles domains bindable attribute', () => {
        expect(vm.data[3].domains[1].active).toBeFalsy();
        vm.domainActivationSetter(1, 1, true);
        expect(vm.data[3].domains[1].active).toBeTruthy();
        vm.domainActivationSetter(1, 1, false);
        expect(vm.data[3].domains[1].active).toBeFalsy();
    });

});
