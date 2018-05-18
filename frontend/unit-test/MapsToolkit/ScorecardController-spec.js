import ScorecardController from '../../src/MapsToolkit/Scorecard/ScorecardController';
import { $scope, $state, $ngRedux } from '../testUtilities';
import * as ToolkitModule from '../../src/store/modules/toolkit';

/* global define, it, describe, expect, beforeEach, afterEach, spyOn, Promise, jasmine */

let sc = {};

describe('ScorecardController', () => {
  beforeEach(() => {
    spyOn(ScorecardController.prototype, 'onInit').and.callThrough();
    sc = ScorecardController.scorecardFactory()({}, $state(), $ngRedux);
    sc.scope = $scope(sc);
    sc.state.params = {
      axisId: 0,
      domainId: 0,
      appName: 1
    };
    sc.$onInit();
  });

  it('mapData fn.', () => {
    spyOn(ToolkitModule, 'getStructure').and.returnValue(1);
    spyOn(ToolkitModule, 'getToolkitData').and.returnValue([1]);
    const result = sc.mapData({});
    expect(result.structure).toBe(1);
    expect(result.rawData[0]).toBe(1);
    expect(result.axesSize).toBe(1);
  });

  it('onInit fn. ', () => {
    spyOn(sc, 'importIconTemplates');
    spyOn(sc, 'watchers');

    sc.onInit();

    expect(sc.watchers).toHaveBeenCalled();
    expect(sc.importIconTemplates).toHaveBeenCalled();
    expect(sc.$ngRedux.connect).toHaveBeenCalled();
  });

  it('onDestroy fn.', () => {
    sc.unsubscribe = jasmine.createSpy('unsubscribe');
    spyOn(sc.EE, 'removeListener');

    sc.onDestroy();

    expect(sc.unsubscribe).toHaveBeenCalled();
    expect(sc.EE.removeListener).toHaveBeenCalledWith('mapsAxisChange', jasmine.any(Function), jasmine.any(Object));
  });
});
