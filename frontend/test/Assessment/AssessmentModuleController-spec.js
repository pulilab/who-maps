import AssessmentModuleController from '../../src/Assessment/AssessmentModuleController';
import { $scope, $state, $timeout, $ngRedux, EE } from '../testUtilities';

/* global define, it, describe, expect, spyOn, beforeEach, jasmine, Promise */
let vm = {};

const projectData = {
  'name': 'Some test project',
  'id': 7,
  'detailPromise': {},
  'filePromise': {},
  'anticipated_time': 'I have all the time on the Earth, but still, it would be good to win ASAP.',
  'application': [],
  'licenses': [],
  'goals_to_scale': 'Winning the freakin lottery',
  'country': 3,
  'coverage': [
    { 'Boss': 1, 'district': 'Narok' }
  ],
  'organisation': 'test_org',
  'pre_assessment': [1, 1, 1, 1, 1, 1],
  'started': '2016-05-15T22:00:00.000Z',
  'reports': ['www.paragonhex.hu'],
  'technology_platforms': [],
  'date': '2016-05-23T14:53:24.943Z',
  'publications': ['www.google.com'],
  'donors': ['Donor 1', 'Donor 2', 'Donor 3', 'Donor 4'],
  'strategy': ['Service Delivery'],
  'files': [
    { 'filename': '7e4cae13d23.jpg', 'id': 2, 'type': 'report' },
    { 'filename': '1bb3923a6f4.jpg', 'id': 1, 'type': 'report' }
  ],
  'countryName': 'Kenya'
};

describe('AssessmentModuleController', () => {
  beforeEach(() => {
    vm = AssessmentModuleController.factory()({}, $state(), $timeout, $ngRedux);
    vm.scope = $scope(vm);
    vm.EE = EE;
    vm.state.params = {
      appName: '1'
    };
  });

  it('is defined', () => {
    expect(vm).toBeDefined();
    expect(typeof vm).toBe('object');
  });

  it('emits an event on window resize', () => {
    vm.resizeEvent();
    vm.resizedw();
    expect(vm.EE.emit).toHaveBeenCalledWith('dashResized');
  });

  it('\'s .snapShot fn. reaches out to the save snapshot via service', () => {
    vm.snapShotProject = jasmine.createSpy('snapShotProject');
    vm.snapShot();
    expect(vm.snapShotProject).toHaveBeenCalled();
  });

  it('handleChangeDomain fn.', () => {
    vm.handleChangeDomain(1, 1);
    expect(vm.state.go).toHaveBeenCalledWith('maps', { 'axisId': 1, 'domainId': 1 });
  });

  it('handleChangeAxis fn.', () => {
    vm.handleChangeAxis(1);
    expect(vm.state.go).toHaveBeenCalledWith('maps', { 'axisId': 1, 'domainId': 0 });
  });
});
