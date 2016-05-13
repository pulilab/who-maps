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
        vm.$onInit();
    });

    it('is defined', () => {
        expect(vm).toBeDefined();
        expect(typeof vm).toBe('object');
    });

    describe('$onInit fn.', () => {

        it('binds svgPanZoom lib to the scope', () => {
            expect(vm.svgPanZoom).toBeDefined();
        });

        xit('sets Eventhandlers for data arriving', () => {});
    });

    describe('$onDestroy fn.', () => {

        it('destroys svgpanzoom instance, and empties out .data and .map bindables', () => {
            // vm.svgZoom = { destroy: a => a };
            // spyOn(vm.svgZoom, 'destroy');
            vm.$onDestroy();

            expect(vm.map).toBe(false);
            expect(vm.data).toBe(false);
            // expect(vm.svgZoom.destroy).toHaveBeenCalled();
        });
    });

    describe('dataArrived eventhandler fn.', () => {

        it('fills out vm.boundNrs', () => {
            vm.dataArrived(perfMockMap);
            console.warn(vm.boundNrs);

            expect(typeof vm.boundNrs).toBe('object');
            expect(vm.boundNrs.clients).toBe(12);
            expect(vm.boundNrs.workers).toBe(7);
            expect(vm.boundNrs.facilities).toBe(7);
        });

        it('saves data got to scope.data, notes it in vm.dataHere', () => {
            vm.dataArrived('data');
            expect(vm.data).toBe('data');
            expect(vm.dataHere).toBe(true);
        });

        it('if map has arrived, calls drawMap with it', () => {
            spyOn(vm, 'drawMap');
            vm.dataArrived('data');
            expect(vm.drawMap).not.toHaveBeenCalled();

            vm.map = 'mapData';
            vm.mapHere = true;
            vm.dataArrived('mapData');
            expect(vm.drawMap).toHaveBeenCalledWith('mapData');
        });
    });

    describe('mapArrived eventhandler fn.', () => {

        it('saves the data into vm.map, notes it in vm.mapHere', () => {
            vm.mapArrived('mapData');
            expect(vm.map).toBe('mapData');
            expect(vm.mapHere).toBe(true);
        });

        it('if data already arrived calls vm.drawMap', () => {

            spyOn(vm, 'drawMap');
            vm.mapArrived('mapData');
            expect(vm.drawMap).not.toHaveBeenCalled();

            vm.data = 'already here';
            vm.dataHere = true;
            vm.mapArrived('mapData');
            expect(vm.drawMap).toHaveBeenCalledWith('mapData');
        });
    });

    xdescribe('draw fn.', () => {

        beforeEach(() => {
            vm.data = perfMockMap;
            vm.map = mockMap;
            vm.drawMap(mockMap);
        });

        it('appends a div.countrymapcontroller to the angular $element', () => {

            expect(d3.select('.countrymapcontainer').length).toBe(1);
        });

        it('appends an svg.countrymap to the div.countrymapcontroller', () => {

            expect(d3.select('.countymap')[0].length).toBe(1);
        });

        xit('uses topoJSON\'s scale parameters as scale', () => {});

        it('appends the right number of svg paths(.d3district) to .countrymap', () => {
            // 14 is sierra leones districts count (mock data)
            expect(d3.selectAll('.d3district')[0].length).toBe(14);
        });

        it('gives .d3district-data class to the districts that has data', () => {
            // 3 is the nr of districts with data in the mockdata
            expect(d3.selectAll('.d3district-data')[0].length).toBe(3);
        });

        it('changes vm.activedistrict bindable objects content on .d3district mouseover & mouseout', () => {
            spyOn(vm.scope, '$evalAsync');
            // Triggering the event for the first found element
            d3.select('.d3district').on('mouseover')();
            expect(vm.activeDistrict.name.length).toBeGreaterThan(0);
            expect(vm.scope.$evalAsync).toHaveBeenCalled();

            d3.select('.d3district-data').on('mouseover')();
            expect(vm.activeDistrict.data).toBeDefined();
            expect(typeof vm.activeDistrict.data).toBe('object');
            expect(vm.scope.$evalAsync).toHaveBeenCalled();
        });

        it('makes the svg pannable and zoomable with svgPanZoom', () => {
            spyOn(vm, 'svgPanZoom').and.callThrough();
            vm.drawMap(mockMap);
            expect(vm.svgPanZoom).toHaveBeenCalled();
        });
    });

    it('has a method .makeGeoFromTopo(), that uses the topojson lib to make a geojson out of the data', () => {

        const ret = vm.makeGeoFromTopo(mockMap.admin_level_5, 'admin_level_5');
        expect(typeof ret).toBe('object');
    });
});
