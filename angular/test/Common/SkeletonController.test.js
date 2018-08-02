
import SkeletonController from '../../src/Common/Thematic/SkeletonController.js';
import { $scope, $interpolate, $anchorScroll } from '../testUtilities';
import mock from './mockStructure.js';
import * as webpackRequires from '../../src/webpackRequires';
import _ from 'lodash';

let vm = {};
const scope = $scope(vm);

describe('SkeletonController', () => {
  beforeEach(() => {
    const webpackFn = () => (1);
    webpackFn.keys = () => ['something.icon'];
    jest.spyOn(webpackRequires, 'loadSkeletonImages').mockReturnValue(webpackFn);
    jest.spyOn(webpackRequires, 'loadSkeletonStatic').mockReturnValue(webpackFn);
    vm = SkeletonController.factory(mock, 0, 0)(scope, $interpolate, $anchorScroll);
  });

  test('is defined', () => {
    expect(vm).toBeDefined();
  });

  test('has a fn. which returns the raw HTML content from the static "help" files', () => {
    expect(vm.importHtmlTemplates).toBeDefined();
    const test = vm.importHtmlTemplates();
    expect(_.keys(test).length).toBe(1);
  });

  test('has a fn. which changes Id\'s, and calls domain activator toggler', () => {
    expect(vm.changeSpot).toBeDefined();
    jest.spyOn(vm, 'domainActivationSetter').mockReturnValue(undefined);

    vm.changeSpot(0, 0);
    expect(vm.axis).toBe(0);
    expect(vm.domain).toBe(0);
    expect(vm.domainActivationSetter).toHaveBeenCalled();

    vm.changeSpot(2, 2);
    expect(vm.axis).toBe(2);
    expect(vm.domain).toBe(2);
    expect(vm.domainActivationSetter).toHaveBeenCalled();
  });

  test('has a fn. which toggles domains bindable attribute', () => {
    expect(vm.data[3].domains[1].active).toBeFalsy();
    vm.domainActivationSetter(1, 1, true);
    expect(vm.data[3].domains[1].active).toBeTruthy();
    vm.domainActivationSetter(1, 1, false);
    expect(vm.data[3].domains[1].active).toBeFalsy();
  });
});
