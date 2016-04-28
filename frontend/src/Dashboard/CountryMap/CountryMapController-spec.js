import CountryMapController from './CountryMapController';
import d3 from 'd3';
import angular from 'angular';
import perfMockMap from './mock/perfMockMap.js';
import { default as mockMap } from './mock/sierra-leone/topoTest.json';

/* global define, it, describe, expect, spyOn, beforeEach, afterEach, angular, xit, xdescribe */

const el = angular.element(document.body);
const scopeMock = {
    $evalAsync: a => a
};
let vm = {};


describe('CountryMapController', () => {

    beforeEach(() => {
        vm = CountryMapController.countrymapFactory()(el, scopeMock);
        vm.data = perfMockMap;
    });

    it('is defined', () => {
        expect(vm).toBeDefined();
        expect(typeof vm).toBe('object');
    });

    describe('$onInit fn', () => {

        it('calculates aggregated client, worker, and facility nr\'s', () => {
            vm.$onInit();
            expect(vm.boundNrs.Clients + vm.boundNrs['Health workers'] + vm.boundNrs.Facilities).toBeGreaterThan(0);
        });

        it('binds svgPanZoom lib to the scope', () => {
            vm.$onInit();
            expect(vm.svgPanZoom).toBeDefined();
        });

        it('calls map drawing fn.', () => {
            spyOn(vm, 'drawMap');
            vm.$onInit();
            expect(vm.drawMap).toHaveBeenCalled();
        });
    });

    describe('draw fn.', () => {

        it('appends a div.countrymapcontroller to the angular $element', () => {
            vm.$onInit();
            expect(d3.select('.countrymapcontainer').length).toBe(1);
        });

        it('appends an svg.countrymap to the div.countrymapcontroller', () => {
            vm.$onInit();
            expect(d3.select('.countymap')[0].length).toBe(1);
        });

        it('calls the vm.calculateScale() method', () => {
            spyOn(vm, 'calculateScale');
            vm.$onInit();
            expect(vm.calculateScale).toHaveBeenCalled();
        });

        it('appends the right number of svg paths(.d3district) to .countrymap', () => {
            vm.$onInit();
            // 14 is sierra leones districts count
            expect(d3.selectAll('.d3district')[0].length).toBe(14);
        });

        it('gives .d3district-data class to the districts that has data', () => {
            vm.$onInit();
            // 4 is the nr of districts with data in the mockdata
            expect(d3.selectAll('.d3district-data')[0].length).toBe(4);
        });

        it('changes vm.activedistrict bindable objects content on .d3district mouseover & mouseout', () => {
            vm.$onInit();
            spyOn(vm.scope, '$evalAsync');
            // Triggering the event for the first found element
            d3.select('.d3district').on('mouseover')();
            expect(vm.activeDistrict.name.length).toBeGreaterThan(0);
            expect(vm.scope.$evalAsync).toHaveBeenCalled();

            d3.select('.d3district-data').on('mouseover')();
            expect(vm.activeDistrict.data).toBeDefined();
            expect(typeof vm.activeDistrict.data).toBe('object');
            expect(vm.scope.$evalAsync).toHaveBeenCalled();

            d3.select('.d3district-data').on('mouseout')();
            expect(vm.activeDistrict.name).toBe('');
            expect(vm.scope.$evalAsync).toHaveBeenCalled();
        });

        it('makes the svg pannable and zoomable with svgPanZoom', () => {
            vm.$onInit();
            spyOn(vm, 'svgPanZoom').and.callThrough();
            vm.drawMap();
            expect(vm.svgPanZoom).toHaveBeenCalled();
        });
    });

    it('has a method .makeGeoFromTopo(), that uses the topojson lib to make a geojson out of the data', () => {
        vm.$onInit();
        const ret = vm.makeGeoFromTopo(mockMap);
        expect(typeof ret).toBe('object');
    });

    it('has .calculateScale() method, that calcs & returns the boundaries & a scale from the data', () => {
        const mockMap2 = vm.makeGeoFromTopo(mockMap);
        const ret = vm.calculateScale(mockMap2);
        expect(typeof ret).toBe('number');
        expect(ret).toBeGreaterThan(0);
    });
});
