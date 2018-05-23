import CountryMapController from '../../src/Common/CountryMap/CountryMapController';
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
    jest.clearAllMocks();
    cc.svgPanZoom = jest.fn().mockReturnValue({ zoomOut: () => {} });
  });

  afterEach(() => {
    const last = document.getElementById('map');
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

  test('has a factory function', () => {
    expect(CountryMapController.countrymapFactory).toBeDefined();
    const onSpot = CountryMapController.countrymapFactory()(el, scope);
    expect(onSpot.constructor.name).toBe(cc.constructor.name);
  });

  test('has onInit fn.', () => {
    jest.spyOn(cc, 'createInMemoryDOMElement').mockReturnValue(undefined);
    jest.spyOn(cc, 'watchers').mockReturnValue(undefined);

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

  test('has onDestroy fn.', () => {
    cc.$onDestroy();
    expect(cc.data).toBe(false);
    expect(cc.countryMapData).toBe(false);
  });

  test('has createInMemoryDOMElement fn.', () => {
    cc.big = false;
    cc.createInMemoryDOMElement();

    // appends div.countrymapcontainer
    expect(document.querySelector('div.countrymapcontainer')).not.toBe(null);

    // creates mapDOMElement svg.countrymap
    expect(cc.mapDOMElement[0][0].classList.contains('countrymap')).toBe(true);

    // height set to parents height
    cc.big = true;
    cc.createInMemoryDOMElement();
  });

  test('has watchers fn.', () => {
    jest.spyOn(cc, 'checkIfCountryChanged');
    jest.spyOn(cc, 'checkIfDistrictDataChanged');
    cc.watchers();
    expect(cc.checkIfCountryChanged).toHaveBeenCalled();
    expect(cc.checkIfDistrictDataChanged).toHaveBeenCalled();
  });

  test('has checkIfCountryChanged fn.', () => {
    jest.spyOn(cc, 'drawMapShape').mockReturnValue(undefined);
    cc.drawnMap = 'country1';
    const newMapDataMock = { mapData: '...', name: 'country2' };

    cc.checkIfCountryChanged(newMapDataMock);
    expect(cc.drawMapShape).toHaveBeenCalledWith(newMapDataMock);
    expect(cc.drawnMap).toBe('country2');
  });

  test('has checkIfDistrictDataChanged fn.', () => {
    jest.spyOn(cc, 'fillDistrictData').mockReturnValue(undefined);
    cc.drawnMap = true;
    const newDistrictData = { 'Département de l\'Ouest': { 'clients': 2, 'health_workers': 3, 'facilities': 4 } };
    cc.checkIfDistrictDataChanged(newDistrictData);
    expect(cc.boundNrs.clients).toBe(2);
    expect(cc.boundNrs.health_workers).toBe(3);
    expect(cc.boundNrs.facilities).toBe(4);
    expect(cc.fillDistrictData).toHaveBeenCalledWith(newDistrictData);
  });

  test('has makeGeoFromTopo fn.', () => {
    const res = cc.makeGeoFromTopo(topoSl);
    expect(typeof res).toBe('object');
  });

  test('has calculateScale fn.', () => {
    const scale1 = cc.calculateScale(topoSl);
    expect(scale1).toBe(13792.952002930891);
  });

  test('has makeSvgPannableAndZoomable fn.', () => {
    let didItRun = false;
    cc.svgPanZoom = jest.fn().mockReturnValue({ zoomOut: () => { didItRun = true; } });
    cc.makeSvgPannableAndZoomable('element');
    expect(cc.svgPanZoom).toHaveBeenCalledWith('element', expect.any(Object));
    expect(didItRun).toBe(true);
  });

  test('has drawMapShape fn.', () => {
    jest.spyOn(cc, 'makeGeoFromTopo');
    jest.spyOn(cc, 'createInMemoryDOMElement');
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

  test('has setTotal fn.', () => {
    cc.drawMapShape(SLCountryMapData);
    cc.setTotal();
    expect(document.querySelectorAll('.global').length).toBe(0);
    expect(cc.showNationalLevelCoverage).toBe(false);
  });

  test('has setGlobal fn.', () => {
    cc.drawMapShape(SLCountryMapData);
    cc.setGlobal();
    expect(document.querySelectorAll('.global').length).toBe(14);
    expect(cc.showNationalLevelCoverage).toBe(true);
  });

  test('has fillDistrictData fn.', () => {
    cc.drawMapShape(SLCountryMapData);
    const districtLevelCoverage = {
      'Bo District': { 'clients': 2, 'health_workers': 2, 'facilities': 2 },
      'Kono District': { 'clients': 1, 'health_workers': 2, 'facilities': 4 }
    };
    cc.fillDistrictData(districtLevelCoverage);
    expect(document.querySelectorAll('.d3district-data').length).toBe(2);
  });

  test('has goToProject fn.', () => {
    cc.goToProject({ id: 1 });
    expect(cc.state.go).toHaveBeenCalledWith('editProject', { appName: 1, editMode: 'publish' });
  });
});
