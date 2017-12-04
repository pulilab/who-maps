import LinechartController from '../../src/Dashboard/Linechart/LinechartController';
import { default as axisdata } from '../../src/Dashboard/Mocks/chartmock.js';
import { default as axisdata2 } from '../../src/Dashboard/Mocks/chartmock2.js';
import { default as axisdata3 } from '../../src/Dashboard/Mocks/chartmock3.js';
require('d3');
require('angular');

/* global define, it, describe, expect, spyOn, beforeEach, afterEach, d3, angular, xit, xdescribe */

const el = angular.element(document.body);
const timeout = (fn) => { fn(); };
let vm = {};


describe('LinechartController', () => {

    beforeEach(() => {
        vm = LinechartController.linechartFactory()(el, timeout);
        vm.data = axisdata2;
        vm.labels = axisdata2.labels;
        vm.showdotted = true;
    });

    it('is defined', () => {
        expect(vm).toBeDefined();
        expect(typeof vm).toBe('object');
    });

    describe('.$onInit() fn.', () => {

        it('if !datachooser && notpercentage sets values, calls .draw', () => {
            vm.EE = {
                once: (str, fn) => {
                    fn(axisdata3);
                }
            };
            spyOn(vm, 'draw');
            vm.datachooser = false;
            vm.notpercentage = true;
            vm.$onInit();

            expect(vm.maxValue).toBe(200);
            expect(vm.data).toBe(axisdata3.data);
            expect(vm.labels).toBe(axisdata3.labels);
            expect(vm.chosenLabels).toBe(axisdata3.labels);
            expect(vm.draw).toHaveBeenCalled();
        });

        it('if !datachooser && !notpercentage', () => {
            vm.EE = {
                once: (str, fn) => {
                    fn(axisdata);
                }
            };
            spyOn(vm, 'draw');
            vm.datachooser = false;
            vm.notpercentage = false;
            vm.$onInit();

            expect(vm.data).toBe(axisdata.data);
            expect(vm.labels).toBe(axisdata.labels);
            expect(vm.chosenLabels).toBe(axisdata.labels);
            expect(vm.draw).toHaveBeenCalled();
        });

        it('if datachooser', () => {
            vm.EE = {
                once: (str, fn) => {
                    fn(axisdata2);
                }
            };
            spyOn(vm, 'draw');
            vm.datachooser = true;
            vm.$onInit();

            expect(vm.data).toBe(axisdata2);
            expect(vm.labels).toBe(axisdata2.labels);
            expect(vm.activeAxis).toBe(axisdata2.labels[0]);
            expect(vm.chosenData).toBe(axisdata2[vm.activeAxis].data);
            expect(vm.chosenLabels).toBe(axisdata2[vm.activeAxis].labels);

            expect(vm.draw).toHaveBeenCalled();
        });
    });

    describe('drawing function', () => {

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

    it('if the axischange (binded fn.) changes the data to show, recalculates, and redraws chart', () => {

        spyOn(vm, 'draw');

        const newAxis = vm.data.labels[1];

        vm.axisChange(newAxis);

        expect(vm.chosenData).toBe(vm.data[newAxis].data);
        expect(vm.chosenLabels).toBe(vm.data[newAxis].labels);
        expect(vm.draw).toHaveBeenCalledWith(true);
    });

    it('if you hover over a label element(from HTML), adds a class to the mother element', () => {

        d3.select(el[0]).append('div')
            .attr('class', 'labelhov1');

        d3.select(el[0]).append('div')
            .attr('class', 'labelhov2');

        vm.datachooser = false;
        vm.showdotted = false;

        vm.data = axisdata.data;
        vm.labels = axisdata.labels;
        vm.chosenLabels = axisdata.labels;
        vm.draw();

        d3.select('.labelhov1').on('mouseover')();
        expect(d3.select('.activelabel1').empty()).toBe(false);

        d3.select('.labelhov1').on('mouseout')();
        expect(d3.select('.activelabel1').empty()).toBe(true);


        d3.select('.labelhov2').on('mouseover')();
        expect(d3.select('.activelabel2').empty()).toBe(false);

        d3.select('.labelhov2').on('mouseout')();
        expect(d3.select('.activelabel2').empty()).toBe(true);
    });

    it('redraws chart on EE.emit(\'dashResized\') event', () => {

        vm.datachooser = true;
        spyOn(window.EE, 'once');

        vm.$onInit();
        expect(window.EE.once).toHaveBeenCalled();

        spyOn(vm, 'draw');

        vm.reDraw();

        expect(vm.draw).toHaveBeenCalledWith(true);
    });
});
