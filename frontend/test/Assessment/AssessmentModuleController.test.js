import AssessmentModuleController from '../../src/Assessment/AssessmentModuleController';
import { $scope, $state, $timeout, $ngRedux, EE } from '../testUtilities';

/* global , it, describe, expect, , beforeEach, jasmine, Promise */
let vm = {};

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
