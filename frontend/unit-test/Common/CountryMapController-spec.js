import CountryMapController from '../../src/Common/CountryMap/CountryMapController';
import d3 from 'd3';
import angular from 'angular';
import { $scope, $state } from '../testUtilities';
import { default as topoSl } from './sl-topo.json';
import { default as SLCountryMapData } from './sl-countrymapdata.json';

const mapNode = document.createElement('div');
mapNode.id = 'map';
document.body.appendChild(mapNode);
const el = angular.element(document.body);

let cc = {};
const scope = $scope(cc);

describe('CountryMapController', () => {

    beforeEach(() => {
        cc = CountryMapController.countrymapFactory()(el, scope, $state());
        cc.$onInit();
    });

    afterEach(() => {
        const last = document.getElementById('map')
        if (last) {
            last.innerHTML = '';
        }
        document.querySelectorAll('.countrymapcontainer').forEach(cont => {
            cont.remove();
        });
        document.querySelectorAll('.countrymap').forEach(cont => {
            cont.remove();
        });
    });

    it('has a factory function', () => {
        expect(CountryMapController.countrymapFactory).toBeDefined();
        const onSpot = CountryMapController.countrymapFactory()(el, scope);
        expect(onSpot.constructor.name).toBe(cc.constructor.name);
    });

    it('has onInit fn.', () => {
        spyOn(cc, 'createInMemoryDOMElement');
        spyOn(cc, 'watchers');

        expect(cc.showPlaceholder).toBe(true);
        cc.big = true;
        cc.$onInit();
        expect(cc.showPlaceholder).toBe(false);

        expect(cc.svgPanZoom).toBeDefined();
        expect(Object.keys(cc.covLib)).toEqual([]);
        expect(Object.keys(cc.svgLib)).toEqual([]);
        expect(cc.drawnMap).toBe(null);

        expect(cc.createInMemoryDOMElement).toHaveBeenCalled();
        expect(cc.watchers).toHaveBeenCalled();
    });

    it('has onDestroy fn.', () => {
        cc.$onDestroy();
        expect(cc.data).toBe(false);
        expect(cc.countryMapData).toBe(false);
    });

    it('has createInMemoryDOMElement fn.', () => {
        cc.big = false;
        cc.createInMemoryDOMElement();

        // appends div.countrymapcontainer
        expect(document.querySelector('div.countrymapcontainer')).not.toBe(null);

        // creates mapDOMElement svg.countrymap
        expect(cc.mapDOMElement[0][0].classList.contains('countrymap')).toBe(true);

        // height set to '409px' for dashboard (!big) maps
        expect(cc.mapDOMElement[0][0].height.baseVal.valueAsString).toBe('409');

        // height set to parents height
        cc.big = true;
        cc.createInMemoryDOMElement();
        const parentsHeight = d3.select('#map')[0][0].offsetHeight.toString()
        expect(cc.mapDOMElement[0][0].height.baseVal.valueAsString).toBe(parentsHeight);

    });

    it('has watchers fn.', () => {
        spyOn(cc, 'checkIfCountryChanged');
        spyOn(cc, 'checkIfDistrictDataChanged');
        cc.watchers();
        expect(cc.checkIfCountryChanged).toHaveBeenCalled();
        expect(cc.checkIfDistrictDataChanged).toHaveBeenCalled();
    });

    it('has checkIfCountryChanged fn.', () => {
        spyOn(cc, 'drawMapShape');
        cc.drawnMap = 'country1';
        const newMapDataMock = { mapData: '...', name: 'country2' };

        cc.checkIfCountryChanged(newMapDataMock);
        expect(cc.drawMapShape).toHaveBeenCalledWith(newMapDataMock);
        expect(cc.drawnMap).toBe('country2');
    });

    it('has checkIfDistrictDataChanged fn.', () => {
        spyOn(cc, 'fillDistrictData');
        const newDistrictData = { 'Département de l\'Ouest': { 'clients': 2, 'health_workers': 3, 'facilities': 4 } };
        cc.checkIfDistrictDataChanged([newDistrictData, 'Haiti']);
        expect(cc.boundNrs.clients).toBe(2);
        expect(cc.boundNrs.health_workers).toBe(3);
        expect(cc.boundNrs.facilities).toBe(4);
        expect(cc.fillDistrictData).toHaveBeenCalledWith(newDistrictData);
    });

    it('has saveClass fn.', () => {
        cc.saveClass('clients', 0, undefined);
        expect(cc.covLib.clients).toBe(0);
        expect(cc.covLib.health_workers).toBe(undefined);
        expect(cc.covLib.facilities).toBe(undefined);

        cc.saveClass('health_workers', 1, undefined);
        expect(cc.covLib.clients).toBe(0);
        expect(cc.covLib.health_workers).toBe(1);
        expect(cc.covLib.facilities).toBe(undefined);

        cc.saveClass('facilities', 2, [1, 2]);
        expect(cc.covLib.clients).toBe(0);
        expect(cc.covLib.health_workers).toBe(1);
        expect(cc.covLib.facilities).toBe(4);

        // no rewrite
        cc.saveClass('clients', 3, [1, 2]);
        expect(cc.covLib.clients).toBe(0);
        expect(cc.covLib.health_workers).toBe(1);
        expect(cc.covLib.facilities).toBe(4);

    });

    it('has makeGeoFromTopo fn.', () => {
        const res = cc.makeGeoFromTopo(topoSl);
        expect(typeof res).toBe('object');
    });

    it('has calculateScale fn.', () => {
        const scale1 = cc.calculateScale(topoSl);
        expect(scale1).toBe(13792.952002930891);
    });

    it('has makeSvgPannableAndZoomable fn.', () => {
        let didItRun = false;
        spyOn(cc, 'svgPanZoom').and.returnValue({ zoomOut: () => { didItRun = true; } });
        cc.makeSvgPannableAndZoomable('element');
        expect(cc.svgPanZoom).toHaveBeenCalledWith('element', jasmine.any(Object));
        expect(didItRun).toBe(true);
    });

    it('has drawMapShape fn.', () => {
        spyOn(cc, 'makeGeoFromTopo').and.callThrough();
        spyOn(cc, 'createInMemoryDOMElement').and.callThrough();
        cc.drawMapShape(SLCountryMapData);

        expect(cc.showPlaceholder).toBe(false);
        expect(cc.countryName).toBe(SLCountryMapData.name);
        expect(cc.flagUrl).toBe(SLCountryMapData.flag);
        expect(document.querySelectorAll('.countrymapcontainer').length).toBe(1);
        expect(document.querySelectorAll('.countrymap').length).toBe(1);
        expect(cc.makeGeoFromTopo).toHaveBeenCalledWith(SLCountryMapData.mapData);
        expect(document.querySelectorAll('.d3district').length).toBe(SLCountryMapData.districts.length);
        // mouseover funtionality not triggerable

        // drawnmap if
        cc.drawnMap = 'Country Draw first!';
        cc.drawMapShape(SLCountryMapData);
        expect(cc.createInMemoryDOMElement).toHaveBeenCalledTimes(1);
    });

    it('has setTotal fn.', () => {
        cc.drawMapShape(SLCountryMapData);
        cc.setTotal();
        expect(document.querySelectorAll('.global').length).toBe(0);
        expect(cc.showNationalLevelCoverage).toBe(false);
    });

    it('has setGlobal fn.', () => {
        cc.drawMapShape(SLCountryMapData);
        cc.setGlobal();
        expect(document.querySelectorAll('.global').length).toBe(14);
        expect(cc.showNationalLevelCoverage).toBe(true);
    });

    it('has fillDistrictData fn.', () => {
        cc.drawMapShape(SLCountryMapData);
        const districtLevelCoverage = {
            'Kambia District': { 'clients': 2, 'health_workers': 2, 'facilities': 2 },
            'Bombali District': { 'clients': 1, 'health_workers': 2, 'facilities': 4 }
        };
        cc.fillDistrictData(districtLevelCoverage);
        expect(document.querySelectorAll('.d3district-data').length).toBe(2);
    });

    it('has goToProject fn.', () => {
        cc.goToProject({ isMember: true, id: 1 });
        expect(cc.state.go).toHaveBeenCalledWith('dashboard', { appName: 1 });

        cc.goToProject({ isMember: false, id: 2 });
        expect(cc.state.go).toHaveBeenCalledWith('public-dashboard', { appName: 2 });
    });
});
