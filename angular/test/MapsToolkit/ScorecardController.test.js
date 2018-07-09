import ScorecardController from '../../src/MapsToolkit/Scorecard/ScorecardController';
import { $scope, $state, $ngRedux, EE } from '../testUtilities';
import * as ToolkitModule from '../../src/store/modules/toolkit';
import * as webpackRequires from '../../src/webpackRequires';
let sc = {};

describe('ScorecardController', () => {
  beforeEach(() => {
    const webpackFn = () => (1);
    webpackFn.keys = () => ['something.icon'];
    jest.spyOn(webpackRequires, 'loadScorecardImages').mockReturnValue(webpackFn);

    jest.spyOn(ScorecardController.prototype, 'onInit');
    sc = ScorecardController.scorecardFactory()({}, $state(), $ngRedux);
    sc.scope = $scope(sc);
    sc.state.params = {
      axisId: 0,
      domainId: 0,
      appName: 1
    };
    sc.EE = EE;
    sc.$onInit();
  });

  it('mapData fn.', () => {
    jest.spyOn(ToolkitModule, 'getStructure').mockReturnValue(1);
    jest.spyOn(ToolkitModule, 'getToolkitData').mockReturnValue([1]);
    const result = sc.mapData({});
    expect(result.structure).toBe(1);
    expect(result.rawData[0]).toBe(1);
    expect(result.axesSize).toBe(1);
  });

  it('onInit fn. ', () => {
    jest.spyOn(sc, 'importIconTemplates');
    jest.spyOn(sc, 'watchers');

    sc.onInit();

    expect(sc.watchers).toHaveBeenCalled();
    expect(sc.importIconTemplates).toHaveBeenCalled();
    expect(sc.$ngRedux.connect).toHaveBeenCalled();
  });

  it('onDestroy fn.', () => {
    sc.unsubscribe = jest.fn();
    sc.onDestroy();
    expect(sc.unsubscribe).toHaveBeenCalled();
    expect(sc.EE.removeListener).toHaveBeenCalledWith('mapsAxisChange', expect.any(Function), expect.any(Object));
  });
});
