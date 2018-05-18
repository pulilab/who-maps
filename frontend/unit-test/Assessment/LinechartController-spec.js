import LinechartController from '../../src/Assessment/Linechart/LinechartController';
import { default as axisdata } from './Mocks/chartmock.js';
import { default as axisdata2 } from './Mocks/chartmock2.js';
import { default as axisdata3 } from './Mocks/chartmock3.js';
import { $scope, $timeout, $ngRedux, EE } from '../testUtilities';
require('d3');
require('angular');

/* global define, it, describe, expect, spyOn, beforeEach, afterEach, d3, angular, xit, xdescribe */

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

  it('is defined', () => {
    expect(vm).toBeDefined();
    expect(typeof vm).toBe('object');
  });

  it('onInit fn.', () => {
    spyOn(vm, 'watchers');
    vm.onInit();
    expect(vm.watchers).toHaveBeenCalled();
    expect(vm.$ngRedux.connect).toHaveBeenCalled();
    expect(vm.EE.on).toHaveBeenCalledWith('dashResized', jasmine.any(Function), jasmine.any(Object));
    expect(vm.dataBit).toBe(0);
    expect(vm.resizeCount).toBe(0);
  });

  xdescribe('drawing function', () => {
    beforeEach(() => {
      window.EE = {};
      window.EE.once = eventName => eventName;
      spyOn(window.EE, 'once');
    });

    describe('with (vm.showdotted && vm.datachooser)', () => {
      beforeEach(() => {
        vm.datachooser = true;
        vm.showdotted = true;

        vm.data = axisdata2;
        vm.labels = axisdata2.labels;
        vm.activeAxis = axisdata2.labels[0];
        vm.chosenData = axisdata2[vm.activeAxis].data;
        vm.chosenLabels = axisdata2[vm.activeAxis].labels;

        vm.draw();
      });

      it('appends an svg to the angular.element', () => {
        const svg = d3.select('.visualization');
        expect(svg[0].length).toBe(1);
      });

      it('draws the axes X & Y', () => {
        const axesDrawn = d3.selectAll('.axis');
        expect(axesDrawn.empty()).toBe(false);
      });

      it('appends a DIV.tooltip', () => {
        expect(d3.select('.tooltip')[0].length).toBe(1);
      });

      it('draws 11 horizontal lines(/10%), as rulers on the background', () => {
        expect(d3.selectAll('.linechart-ruler')[0].length).toBe(11);
      });

      it('draws ticks per every 10% on y, and every tick on x axes', () => {
        const ticks = d3.selectAll('.tick')[0];
        expect(ticks.length).toBe(11 + vm.chosenData.length);
      });

      it('draws the correct number of paths', () => {
        const lines = d3.selectAll('.line-axis');
        expect(lines[0].length).toBe((vm.chosenData.length - 1) * 2);
      });

      it('gives separate classes for separate datasets to paths', () => {
        for (let i = 1; i < vm.chosenLabels.length; i += 1) {
          const lines = d3.selectAll('.line-axis' + i);
          expect(lines[0].length).toBe(2);
        }
      });

      it('draws dashed lines correct times', () => {
        const dashedLines = d3.selectAll('.line-axis-dashed');
        expect(dashedLines[0].length).toBe(vm.chosenData.length - 1);
      });

      it('draws dots correct times', () => {
        const dots = d3.selectAll('.dot-axis');
        expect(dots[0].length).toBe(vm.chosenData.length * vm.chosenLabels.length);
      });

      it('gives separate classes for separate dataset to dots', () => {
        for (let i = 1; i < vm.chosenData.length; i += 1) {
          const dots = d3.selectAll('.dot-axis' + i);
          expect(dots[0].length).toBe(vm.chosenData.length);
        }
      });

      it('draws dashed lines correct times', () => {
        const dashedLines = d3.selectAll('.line-axis-dashed');
        expect(dashedLines[0].length).toBe(vm.chosenData.length - 1);
      });
    });

    describe('with (!vm.showdotted && !vm.datachooser)', () => {
      beforeEach(() => {
        vm.datachooser = false;
        vm.showdotted = false;

        vm.data = axisdata.data;
        vm.labels = axisdata.labels;
        vm.chosenLabels = axisdata.labels;
        vm.draw();
      });

      it('appends an svg to the angular.element', () => {
        const svg = d3.select('.visualization');
        expect(svg[0].length).toBe(1);
      });

      it('draws the axes X & Y', () => {
        const axesDrawn = d3.selectAll('.axis');
        expect(axesDrawn.empty()).toBe(false);
      });

      it('appends a DIV.tooltip', () => {
        expect(d3.select('.tooltip')[0].length).toBe(1);
      });

      it('draws 11 horizontal lines(/10%), as rulers on the background', () => {
        expect(d3.selectAll('.linechart-ruler')[0].length).toBe(11);
      });

      it('draws ticks per every 10% on y, and every tick on x axes', () => {
        const ticks = d3.selectAll('.tick')[0];
        expect(ticks.length).toBe(11 + vm.data.length - 1);
      });

      it('draws the correct number of paths', () => {
        const lines = d3.selectAll('.line-axis');
        expect(lines[0].length).toBe((vm.data.length - 1) * 2);
      });

      it('gives separate classes for separate datasets to paths', () => {
        for (let i = 1; i <= vm.labels.length; i += 1) {
          const lines = d3.selectAll('.line-axis' + i.toString());
          expect(lines[0].length).toBe(1);
        }
      });

      it('doesnt draw dashed lines at all', () => {
        const dashedLines = d3.selectAll('.line-axis-dashed');
        expect(dashedLines.empty()).toBe(true);
      });

      it('draws dots correct times', () => {
        const dots = d3.selectAll('.dot-axis');
        expect(dots[0].length).toBe((vm.data.length - 1) * vm.chosenLabels.length);
      });

      it('gives separate classes for separate dataset to dots', () => {
        for (let i = 1; i < vm.data.length; i += 1) {
          const dots = d3.selectAll('.dot-axis' + i);
          expect(dots[0].length).toBe(vm.data.length - 1);
        }
      });
    });
  });
});
