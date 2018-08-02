import LinechartController from '../../src/Assessment/Linechart/LinechartController';
import { default as axisdata } from './Mocks/chartmock.js';
import { default as axisdata2 } from './Mocks/chartmock2.js';
import { $scope, $timeout, $ngRedux, EE } from '../testUtilities';
require('d3');
const angular = require('angular');

const el = angular.element(document.body);
let vm = {};

describe('LinechartController', () => {
  beforeEach(() => {
    vm = LinechartController.linechartFactory()({}, el, $timeout, $ngRedux);
    vm.scope = $scope(vm);
    vm.EE = EE;
    vm.data = axisdata2;
    vm.labels = axisdata2.labels;
    vm.showdotted = true;
  });

  test('is defined', () => {
    expect(vm).toBeDefined();
    expect(typeof vm).toBe('object');
  });

  test('onInit fn.', () => {
    jest.spyOn(vm, 'watchers').mockReturnValue(undefined);
    vm.onInit();
    expect(vm.watchers).toHaveBeenCalled();
    expect(vm.$ngRedux.connect).toHaveBeenCalled();
    expect(vm.EE.on).toHaveBeenCalledWith('dashResized', expect.any(Function), expect.any(Object));
    expect(vm.dataBit).toBe(0);
    expect(vm.resizeCount).toBe(0);
  });
});
