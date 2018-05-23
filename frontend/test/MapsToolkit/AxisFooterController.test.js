import AxisFooterController from '../../src/MapsToolkit/AxisFooter/AxisFooterController';
import EventEmitter from 'eventemitter3';
import { $scope, $state } from '../testUtilities';

let afc = {};

describe('AxisFooterController', () => {
  beforeEach(() => {
    window.EE = new EventEmitter();
    jest.spyOn(AxisFooterController.prototype, 'onInit');
    afc = AxisFooterController.axisFooterFactory()({}, $state());
    afc.scope = $scope(afc);
    afc.state.params = {
      axisId: 0,
      domainId: 0
    };
    afc.axes = require('./mockData.json');
  });

  test('should have an initialization function that get fired through $onInit', () => {
    afc.$onInit();
    expect(afc.onInit).toHaveBeenCalled();
    expect(afc.activeAxis).toBe(0);
    const p = afc.processedAxis[0];
    expect(p.axisId).toBeDefined();
    expect(p.id).toBe(0);
    expect(p.isActive).toBe(false);
    expect(p.axisName).toBeDefined();
  });

  test('should have a function that generates an array of classes', () => {
    afc.$onInit();
    const c = afc.classGenerator(afc.processedAxis[0]);
    expect(c).toBe('axis_1 notActive');
  });

  test('should have a function that emit a mapsAxisChange event', () => {
    jest.spyOn(window.EE, 'emit');
    afc.changeAxis({ isActive: false, id: 0 });
    expect(window.EE.emit).toHaveBeenCalledWith('mapsAxisChange', 0);
    afc.changeAxis({ isActive: true, id: 0 });
    expect(window.EE.emit).toHaveBeenCalledTimes(1);
  });
});
