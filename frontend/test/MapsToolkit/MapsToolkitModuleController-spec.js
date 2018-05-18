import _ from 'lodash';
import MapsToolkitController from '../../src/MapsToolkit/MapsToolkitController';
import { $scope, $state, $ngRedux } from '../testUtilities';

/* global define, it, describe, expect, beforeEach, spyOn, Promise */
let mc = {};

const mockData = require('./mockData.json');

const mockInvariantData = () => {
  return _.cloneDeep(mockData);
};

describe('MapsToolkitController', () => {
  beforeEach(() => {
    mc = new MapsToolkitController.mapsControllerFactory()({}, $state(), $ngRedux);
    mc.scope = $scope(mc);
    mc.state.params.axisId = 0;
    mc.state.params.domainId = 0;

    mc.$onInit();
    mc.processAxesData(mockInvariantData());
  });

  it('handleChangeAxis', () => {
    mc.state.current = {
      name: 1
    };
    mc.handleChangeAxis(1);
    expect(mc.state.go).toHaveBeenCalledWith(1, {axisId: 1, domainId: 0});
  });

  it('should have a function that import all the html templates in a dictionary', () => {
    const t = mc.importHtmlTemplates();
    expect(t).toBeDefined();
    expect(t['1-1-3']).toBeDefined();
  });

  it('processAxesData', () => {
    mc.processAxesData(mockInvariantData(), 1, 1);
    expect(mc.dataLoaded).toBe(true);
  });

  it('should have a function that return an integer flex size based on the number of questions', () => {
    const q = {
      choices: [1, 2, 3]
    };
    let size = mc.calculateMainBoxSize(q);
    expect(size).toBe(60);
    size = mc.calculateMainBoxSize();
    expect(size).toBe(40);
  });

  it('checkChecked fn.', () => {
    mc.data = mockInvariantData()[0].domains[0];
    let result = mc.checkChecked(0, 0, 2);
    expect(result).toBe(true);
    result = mc.checkChecked(0, 0, 1);
    expect(result).toBe(false);
  });

  it('setAnswer fn.', () => {
    mc.saveAnswer = jasmine.createSpy('saveAnswer');

    mc.viewMode = true;
    mc.setAnswer(0, 0, 0);
    expect(mc.saveAnswer).not.toHaveBeenCalled();

    mc.viewMode = false;
    mc.setAnswer(0, 0, 0);
    expect(mc.saveAnswer).toHaveBeenCalledWith({
      axis: 0,
      domain: 0,
      question: 0,
      answer: 0,
      value: 0
    });
  });

  it('should have a function that  disable the backbutton', () => {
    mc.domainId = 0;
    let res = mc.backButtonDisabled();
    expect(res).toBe(true);
    mc.domainId = 1;
    res = mc.backButtonDisabled();
    expect(res).toBe(false);
  });

  it('should have a function that move to the next domain', () => {
    spyOn(mc, 'handleChangeDomain');
    mc.domainId = 0;
    mc.axisId = 5;
    mc.rawData = mockInvariantData();
    mc.goToNextDomain();
    expect(mc.handleChangeDomain).toHaveBeenCalled();
  });

  it('should have a function that move to the prev domain', () => {
    spyOn(mc, 'handleChangeDomain');
    mc.rawData = mockInvariantData();
    mc.domainId = 1;
    mc.axisId = 1;
    mc.goToPrevDomain();
    expect(mc.handleChangeDomain).toHaveBeenCalled();
    mc.domainId = 0;
  });
});
