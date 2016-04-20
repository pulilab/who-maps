import CountryMapController from './CountryMapController';
import d3 from 'd3';
import angular from 'angular';

/* global define, it, describe, expect, spyOn, beforeEach, afterEach, d3, angular, xit, xdescribe */

const el = angular.element(document.body);
const scopeMock = {
    $evalAsync: () => {
        console.log('$scope.$evalAsync() called!');
    }
}
let vm = {};


describe('CountryMapController', () => {

    it('basic expect', () => {
        expect(true).toBe(true);
    });

    beforeEach(() => {
        vm = CountryMapController.countrymapFactory()(el, scopeMock);
        vm.data = axisdata2;
    });

    it('is defined', () => {
        expect(vm).toBeDefined();
        expect(typeof vm).toBe('object');
    });
});
