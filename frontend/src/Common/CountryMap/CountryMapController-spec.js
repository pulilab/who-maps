import CountryMapController from './CountryMapController';
import d3 from 'd3';
import angular from 'angular';
import EE from '../EE';
import perfMockMap from './mock/perfMockMap.js';
import { default as countryMapData } from './mock/sierra-leone/topoTest.json';

/* global define, it, describe, expect, spyOn, beforeEach, afterEach, angular, xit, xdescribe */

const el = angular.element(document.body);
const scopeMock = {
    $evalAsync: a => a
};
const EEMock = {
    removeListener: a => a,
    on: a => a,
    once: a => a
};
let vm;

describe('CountryMapController', () => {

    beforeEach(() => {
        vm = CountryMapController.countrymapFactory()(el, scopeMock);
    });

    afterEach(()=> {
        EE.initialize();
        vm.EE = window.EE;
    });

    it('is defined', () => {

        expect(vm).toBeDefined();
    });

    describe('constructor fn.', () => {

        it('catches $element into vm.el', () => {
            expect(vm.el).toBe(el);
        });

        it('catches $scope onto vm.scope', () => {
            expect(vm.scope).toBe(scopeMock);
        });

        it('assigns $onInit & $onDestroy', () => {
            expect(typeof vm.$onInit).toBe('function');
            expect(typeof vm.$onDestroy).toBe('function');
        });

        it('defines self.tooltipOver and self.preventMouseOut as false', () => {
            expect(vm.tooltipOver).toBeFalsy();
            expect(vm.preventMouseOut).toBeFalsy();
        });
    });

    describe('$onInit', () => {

        it('defines self.showPlaceholder bindable from self.big binding', () => {

            vm.big = true;
            vm.onInit();
            expect(vm.showPlaceholder).toBe(false);

            vm.big = false;
            vm.onInit();
            expect(vm.showPlaceholder).toBe(true);
        });

        it('binds svgPanZoom library', () => {
            vm.onInit();
            expect(vm.svgPanZoom).toBeDefined();
        });

        it('removes EE listener `country Changed`', () => {
            vm.EE = EEMock;
            spyOn(vm.EE, 'removeListener');
            vm.onInit();
            expect(vm.EE.removeListener).toHaveBeenCalledWith('country Changed');
        });

        it('add .on || .once EE listener upon self.big', () => {
            vm.EE = EEMock;
            spyOn(vm.EE, 'on');
            spyOn(vm.EE, 'once');

            vm.big = true;
            vm.onInit();
            expect(vm.EE.on).toHaveBeenCalledWith('country Changed', vm.mapChanged, vm);

            vm.big = false;
            vm.onInit();
            expect(vm.EE.once).toHaveBeenCalledWith('country Changed', vm.mapChanged, vm);
        });
    });

    it('$onDestroy resets self.data & self.map', () => {
        vm.data = true;
        vm.countryMapData = true;
        vm.onDestroy();
        expect(vm.data || vm.countryMapData).toBe(false);
    });

    describe('on data arrival', () => {

        const nationalMock = { a: 1, b: 2 };
        const mockLibAfter = { a: 1, b: 2 };

        it('stores data & notes that data have arrived', () => {


            vm.big = true;
            vm.dataArrived(perfMockMap, nationalMock);
            expect(vm.data.data).toBe(perfMockMap);
            expect(vm.dataHere).toBe(true);
            expect(JSON.stringify(vm.nationalCov)).toBe(JSON.stringify(mockLibAfter));
            vm.dataHere = false;

            vm.big = false;
            vm.dataArrived(perfMockMap, nationalMock);
            expect(vm.data).toBe(perfMockMap);
            expect(vm.dataHere).toBe(true);
        });

        it('aggregates the values of districts to show them all', () => {

            vm.dataArrived(perfMockMap, nationalMock);

            expect(typeof vm.boundNrs).toBe('object');
            expect(vm.boundNrs.clients).toBe(12);
            expect(vm.boundNrs.workers).toBe(7);
            expect(vm.boundNrs.facilities).toBe(7);
        });

        it('if map is aleady here, calls preDraw() with it', () => {
            spyOn(vm, 'preDraw');
            vm.mapHere = true;
            vm.countryMapData = 'mapdata';
            vm.dataArrived(perfMockMap, nationalMock);
            expect(vm.preDraw).toHaveBeenCalledWith('mapdata');
        });
    });

    describe('on map arrived', () => {

        it('saves the data into vm.countryMapData, notes it in vm.mapHere', () => {
            vm.mapArrived('mapData');
            expect(vm.countryMapData).toBe('mapData');
            expect(vm.mapHere).toBe(true);
        });

        it('calls preDraw(), if data already arrived', () => {
            spyOn(vm, 'preDraw');
            vm.dataHere = true;
            vm.mapArrived('mapdata');
            expect(vm.preDraw).toHaveBeenCalledWith('mapdata');
        });
    });

    describe('on map changed', () => {

        it('sets placeholder to true', () => {

            vm.showPlaceholder = false;
            vm.mapChanged();
            expect(vm.showPlaceholder).toBe(true);
        });

        it('listens to `topoArrived` & `mapdataArrived`', () => {
            vm.EE = EEMock;
            spyOn(vm.EE, 'once');
            vm.mapChanged();
            expect(vm.EE.once).toHaveBeenCalledWith('topoArrived', vm.mapArrived, vm);
            expect(vm.EE.once).toHaveBeenCalledWith('mapdataArrived', vm.dataArrived, vm);
        });
    });

    it('has a method .makeGeoFromTopo(), that uses the topojson lib to make a geojson out of the data', () => {
        const ret = vm.makeGeoFromTopo(countryMapData.mapData);
        expect(typeof ret).toBe('object');
    });


    it('formatCountryName() formats the self.country bindable upon a library', () => {

        vm.countryName = 'Border India - Bangladesh';
        vm.formatCountryName();
        expect(vm.countryName).toBe('Bangladesh');

        vm.countryName = 'Border Malawi - Mozambique';
        vm.formatCountryName();
        expect(vm.countryName).toBe('Malawi');

        vm.countryName = 'Something not in the lib';
        vm.formatCountryName();
        expect(vm.countryName).toBe('Something not in the lib');
    });


    it('calculateScale() should return a number from the topoJson', () => {
        const ret = vm.calculateScale(countryMapData.mapData);
        expect(typeof ret).toBe('number');
    });

    it('makeSvgPannableAndZoomable() makes .svgZoom bindable instance out of lib & zooms out once', () => {

        vm.onInit();
        let b;
        spyOn(vm, 'svgPanZoom').and.returnValue({ zoomOut: () => { b = 'called'; } });
        vm.makeSvgPannableAndZoomable();
        expect(vm.svgPanZoom).toHaveBeenCalled();
        expect(vm.svgZoom).toBeDefined();
        expect(b).toBe('called');
    });

    describe('preDraw', () => {

        beforeEach(() => {

            const countriesMock = [
                {
                    'name': 'Bangladesh',
                    'id': 1
                }, {
                    'name': 'India',
                    'id': 2
                }, {
                    'name': 'Indonesia',
                    'id': 6
                }, {
                    'name': 'Kenya',
                    'id': 3
                }, {
                    'name': 'Malawi',
                    'id': 7
                }, {
                    'name': 'Pakistan',
                    'id': 8
                }, {
                    'name': 'Philippines',
                    'id': 4
                }, {
                    'name': 'Senegal',
                    'id': 9
                }, {
                    'name': 'Sierra Leone',
                    'id': 5
                }, {
                    'name': 'Tunisia',
                    'id': 10
                }
            ];
            vm.cs = { projectStructure: { countries: countriesMock } };

            spyOn(vm, 'formatCountryName');
            spyOn(vm, 'makeGeoFromTopo');
            spyOn(vm, 'drawDistricts');
            spyOn(vm, 'makeSvgPannableAndZoomable');
        });

        it('REGRESSION: should not execute if no valid map data arrived', () => {
            const cName = vm.countryName;
            vm.preDraw(false);
            expect(vm.countryName).toBe(cName);
        });

        it('removes older .countrymapcontainer', () => {
            d3.select(vm.el[0]).append('svg')
                .classed('countrymapcontainer', true)
                .classed('lastone', true);

            vm.preDraw(countryMapData);
            expect(d3.select('.lastone')[0][0]).toBe(null);
        });

        it('formats country name', () => {
            vm.preDraw(countryMapData);
            expect(vm.formatCountryName).toHaveBeenCalled();
        });

        it('calls makeGeoFromTopo() with the topoJSON', () => {
            vm.preDraw(countryMapData);
            expect(vm.makeGeoFromTopo).toHaveBeenCalled();
        });

        it('makes DIV element & SVG element', () => {
            vm.preDraw(countryMapData);
            expect(d3.select('.countrymapcontainer').length).toBe(1);
            expect(d3.select('.countrymap').length).toBe(1);
        });

        it('calls drawDistricts()', () => {
            vm.preDraw(countryMapData);
            expect(vm.drawDistricts).toHaveBeenCalled();
        });

        it('resets back .showPlaceholder, .dataHere & .mapHere to false', () => {
            vm.showPlaceholder = true;
            vm.dataHere = true;
            vm.mapHere = true;
            vm.preDraw(countryMapData);
            expect(vm.showPlaceholder).toBe(false);
            expect(vm.dataHere).toBe(false);
            expect(vm.mapHere).toBe(false);
        });
    });

    describe('drawDistricts', () => {

        beforeEach(() => {
            const countriesMock = [
                {
                    'name': 'Bangladesh',
                    'id': 1
                }, {
                    'name': 'India',
                    'id': 2
                }, {
                    'name': 'Indonesia',
                    'id': 6
                }, {
                    'name': 'Kenya',
                    'id': 3
                }, {
                    'name': 'Malawi',
                    'id': 7
                }, {
                    'name': 'Pakistan',
                    'id': 8
                }, {
                    'name': 'Philippines',
                    'id': 4
                }, {
                    'name': 'Senegal',
                    'id': 9
                }, {
                    'name': 'Sierra Leone',
                    'id': 5
                }, {
                    'name': 'Tunisia',
                    'id': 10
                }
            ];
            vm.onInit();
            vm.cs = { projectStructure: { countries: countriesMock } };
            vm.data = perfMockMap;
            spyOn(vm, 'svgPanZoom').and.returnValue({ zoomOut: a => a });
            vm.preDraw(countryMapData);
        });

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
    });
});
