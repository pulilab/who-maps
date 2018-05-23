import AssessmentModuleController from '../../src/Assessment/AssessmentModuleController';
import { $scope, $state, $timeout, $ngRedux, EE } from '../testUtilities';

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

  test('is defined', () => {
    expect(vm).toBeDefined();
    expect(typeof vm).toBe('object');
  });

  test('emits an event on window resize', () => {
    vm.resizeEvent();
    vm.resizedw();
    expect(vm.EE.emit).toHaveBeenCalledWith('dashResized');
  });

  test('\'s .snapShot fn. reaches out to the save snapshot via service', () => {
    vm.snapShotProject = jest.fn();
    vm.snapShot();
    expect(vm.snapShotProject).toHaveBeenCalled();
  });

  test('handleChangeDomain fn.', () => {
    vm.handleChangeDomain(1, 1);
    expect(vm.state.go).toHaveBeenCalledWith('maps', { 'axisId': 1, 'domainId': 1 });
  });

  test('handleChangeAxis fn.', () => {
    vm.handleChangeAxis(1);
    expect(vm.state.go).toHaveBeenCalledWith('maps', { 'axisId': 1, 'domainId': 0 });
  });
});
