import CountryMapController from './CountryMapController';
import d3 from 'd3';
import angular from 'angular';
import perfMockMap from './mock/perfMockMap.js';
import { $scope } from '../../testUtilities';
import { default as countryMapData } from './mock/sierra-leone/topoTest.json';

/* global define, it, describe, expect, spyOn, beforeEach, afterEach, angular, xit, xdescribe */

const el = angular.element(document.body);

let vm;

describe('CountryMapController', () => {

    beforeEach(() => {
        const scope = $scope(vm);
        vm = CountryMapController.countrymapFactory()(el, scope);
    });

    it('is defined', () => {

        expect(vm).toBeDefined();
    });

    describe('constructor fn.', () => {

        it('catches $element into vm.el', () => {
            expect(vm.el).toBe(el);
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

    });

    it('$onDestroy resets self.data & self.map', () => {
        vm.data = true;
        vm.countryMapData = true;
        vm.onDestroy();
        expect(vm.data || vm.countryMapData).toBe(false);
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

    describe('drawMapShape', () => {

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


        it('formats country name', () => {
            vm.drawMapShape(countryMapData);
            expect(vm.formatCountryName).toHaveBeenCalled();
        });

        it('calls makeGeoFromTopo() with the topoJSON', () => {
            vm.drawMapShape(countryMapData);
            expect(vm.makeGeoFromTopo).toHaveBeenCalled();
        });

        it('makes DIV element & SVG element', () => {
            vm.drawMapShape(countryMapData);
            expect(d3.select('.countrymapcontainer').length).toBe(1);
            expect(d3.select('.countrymap').length).toBe(1);
        });

        it('calls drawDistricts()', () => {
            vm.drawMapShape(countryMapData);
            expect(vm.drawDistricts).toHaveBeenCalled();
        });

        it('resets back .showPlaceholder to false', () => {
            vm.showPlaceholder = true;
            vm.drawMapShape(countryMapData);
            expect(vm.showPlaceholder).toBe(false);
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
            vm.districtLevelCoverage = perfMockMap;
            spyOn(vm, 'svgPanZoom').and.returnValue({ zoomOut: a => a });
            vm.drawMapShape(countryMapData);
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
