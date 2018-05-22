import AxisController from '../../src/Common/Axis/AxisController';
import { $scope, $ngRedux } from '../testUtilities';

/* global it, describe, expect, beforeEach, afterEach, spyOn, Promise */
let ac = {};

describe('axisController', () => {
  beforeEach(() => {
    ac = AxisController.axisFactory()({}, $ngRedux);
    ac.scope = $scope(ac);
    ac.axisData = require('./axisMockData');
    ac.$onInit();
  });

  it('should have a factory function', () => {
    expect(AxisController.axisFactory).toBeDefined();
    const onSpot = AxisController.axisFactory()({}, $ngRedux);
    expect(onSpot.constructor.name).toBe(ac.constructor.name);
  });

  it('has initialization == $onInit fn.', () => {
    ac.axisData = undefined;
    ac.axisId = null;
    ac.$onInit();
    expect(ac.axisId).toBe(0);
    ac.$onInit();
  });

  it('has setDomainActive fn.', () => {
    ac.domainIndex = '15';
    const res1 = ac.setDomainActive(15);
    expect(res1).toBe(true);

    ac.domainIndex = '15';
    const res2 = ac.setDomainActive(14);
    expect(res2).toBe(false);

    ac.domainIndex = undefined;
    const res3 = ac.setDomainActive(14);
    expect(res3).toBe(false);
  });

  it('has a fn, that emit a domain change event', () => {
    spyOn(window.EE, 'emit');
    ac.axisIndex = 'mock axisId';
    ac.changeDomain({ index: 12 });
    expect(window.EE.emit).toHaveBeenCalledWith('mapsDomainChange', 'mock axisId', 12);
  });

  it('has a fn, that emit an axis change event', () => {
    spyOn(window.EE, 'emit');
    ac.axisId = '2';
    ac.goToAxis();
    expect(window.EE.emit).toHaveBeenCalledWith('mapsAxisChange', 1);
  });

  it('has a class generator fn', () => {
    const res0 = ac.advanceClassGenerator(-10);
    const res1 = ac.advanceClassGenerator(20);
    const res2 = ac.advanceClassGenerator(50);
    const res3 = ac.advanceClassGenerator(60);
    const res4 = ac.advanceClassGenerator(100);
    const res5 = ac.advanceClassGenerator(110);

    expect(res0).toBe('red');
    expect(res1).toBe('red');
    expect(res2).toBe('yellow');
    expect(res3).toBe('yellow');
    expect(res4).toBe('green');
    expect(res5).toBe('green');
  });
});
