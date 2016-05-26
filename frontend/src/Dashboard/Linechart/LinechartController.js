/* global d3 */
import _ from 'lodash';

class LinechartController {

    constructor($element, $timeout) {

        const vm = this;

        // BINDINGS
        // vm.data <= holds data
        // vm.labels <= array of labels for datasets
        // vm.showdotted <= decides to show unsaved (last) ones
        // vm.datachooser <= datastructure toggle, and allows showing ng-options on the view
        // vm.notpercentage <= signs that data isnt given in percentages

        vm.EE = window.EE;
        vm.el = $element;
        vm.timeout = $timeout;
        vm.$onInit = () => {

            if (!vm.datachooser) {

                vm.EE.once(vm.notpercentage ? 'coverage chart data' : 'axis chart data', data => {

                    if (vm.notpercentage) {
                        // console.debug('chartmock 3', JSON.stringify(data));
                        vm.maxValue = data.data.reduce((ret, version) => {
                            _.forOwn(version, (val, key) => {

                                if (key !== 'date' || key !== 'x') {
                                    ret = val > ret ? val : ret;
                                }

                            });
                            return ret;
                        }, 0);
                    }

                    vm.data = data.data;
                    vm.labels = data.labels;
                    vm.chosenLabels = vm.labels;
                    vm.draw();
                });

            }
            else {

                vm.EE.once('domain chart data', (data) => {
                    // console.debug('got data for chart DOMAINS', data);
                    vm.data = data;
                    vm.labels = vm.data.labels;
                    vm.activeAxis = vm.data.labels[0];
                    vm.chosenData = vm.data[vm.activeAxis].data;
                    vm.chosenLabels = vm.data[vm.activeAxis].labels;
                    vm.draw();
                });
            }
        };
    }

    draw() {

        const vm = this;

        d3.select(vm.el[0]).select('.linechartcontainer').remove();

        const data = vm.datachooser ? vm.chosenData : vm.data;
        const labels = vm.datachooser ? vm.chosenLabels : vm.labels;


        const outer = d3.select(vm.el[0])
            .append('div')
            .attr('class', 'linechartcontainer');

        const outerWidth = outer[0][0].offsetWidth;
        const outerHeight = outer[0][0].offsetHeight;

        // Decorate data with indices
        data.forEach((el, i) => {
            el.x = i + 1;
        });

        // Should recalculate on first open || resize
        const margin = {
            top: 0,
            right: 0,
            bottom: 40,
            left: 45
        };
        const width = outerWidth - margin.left - margin.right;
        const height = outerHeight - margin.top - margin.bottom;

        const element = outer
            .append('svg')
            .attr('class', 'visualization');

        element
            .attr('width', outerWidth)
            .attr('height', outerHeight);


        let tooltip;
        if (!d3.select('.chart-tooltip')[0][0]) {

            tooltip = d3.select('body')
                .append('div')
                .attr('class', 'chart-tooltip');
        }
        else {
            tooltip = d3.select('.chart-tooltip');
        }

        const xScale = d3.scale.linear()
            .range([margin.left, width - margin.right]) // the area
            .domain([0.8, (vm.showdotted ? data.length : data.length - 1) + 0.2]); // min and max values

        const percScale = d3.scale.linear()
            .range([height - margin.top, margin.bottom])
            .domain([0, 1]);

        const simpleScale = d3.scale.linear()
            .range([height - margin.top, margin.bottom])
            .domain([0, vm.maxValue]);

        const yScale = vm.notpercentage ? simpleScale : percScale;

        const xAxis = d3.svg.axis()
            .scale(xScale)
            .ticks(this.showdotted ? data.length : (data.length - 1))
            .tickFormat(d => {
                const canShowDate = (width - margin.left - margin.right) / ((data.length - 1) * 80) >= 1.2;
                return canShowDate ? d + '. ' + data[d - 1].date : d;
            })
            .orient('bottom');

        const yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

        if (!vm.notpercentage) {
            yAxis.tickFormat(d3.format('.0%'));
        }

        // Appending the X axis
        element.append('svg:g')
            .attr('class', 'axis x-axis')
            .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
            .call(xAxis);

        // Appending the Y axis
        element.append('svg:g')
            .attr('class', 'axis y-axis')
            .attr('transform', 'translate(' + (margin.left) + ',0)')
            .call(yAxis);

        // Appending horizontal ruler lines
        for (let i = 0; i <= 10; i += 1) {
            element.append('svg:line')
                .attr('class', 'linechart-ruler')
                .attr('x1', margin.left)
                .attr('y1', percScale(i / 10))
                .attr('x2', width - margin.right)
                .attr('y2', percScale(i / 10));
        }


        // LINES
        for (let i = 1; i <= labels.length; i += 1) {

            const line = d3.svg.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d['axis' + i] || 0));

            // Full lines
            element.append('svg:path')
                .attr('class', 'line-axis line-axis' + i)
                .attr('d', line(data.slice(0, -1)));

            // Dashed lines
            if (vm.showdotted) {
                element.append('svg:path')
                    .attr('class', 'line-axis line-axis-dashed line-axis' + i)
                    .attr('d', line(data.slice(-2)));
            }
        }

        // DOTS
        const dotData = vm.showdotted ? data : data.slice(0, -1);

        dotData.forEach(el => {
            for (let i = 1; i <= labels.length; i += 1) {

                element.append('circle')
                    .attr('class', 'dot-axis dot-axis' + i)
                    .attr('r', 5)
                    .attr('cx', xScale(el.x))
                    .attr('cy', yScale(el['axis' + i] || 0))
                    .on('mouseover', () => {

                        const divString = [
                            'Score: ' + Math.round(el['axis' + i] * 100) + '%',
                            '<br>',
                            'Date: ' + el.date
                        ];

                        tooltip.html(divString.join(''))
                            .style('top', (d3.event.pageY - 15 + 'px'))
                            .style('left', (d3.event.pageX + 15 + 'px'))
                            .style('opacity', 1);
                    })
                    .on('mouseout', () => {

                        tooltip.style('opacity', 0);
                    });
            }
        });

        // Label events to trigger classes, that opaques lines via css
        // timeout is sometimes needed, because the labels arent in the DOM yet after redraw
        if (d3.select(vm.el[0]).select('.labelhov' + labels.length).empty()) {
            vm.timeout(labelHoverFn, 250);
        }
        else {
            labelHoverFn();
        }

        function labelHoverFn() {

            for (let i = 1; i <= labels.length; i += 1) {

                d3.select(vm.el[0]).select('.labelhov' + i)
                    .on('mouseover', () => {
                        element.classed('activelabel' + i, true);
                    })
                    .on('mouseout', () => {
                        element.classed('activelabel' + i, false);
                    });
            }
        }

        // Redraw on window size change
        window.EE.once('dashResized', vm.reDraw.bind(vm));
    }

    reDraw() {
        const vm = this;
        vm.draw(true);
    }

    // Ng-options change
    axisChange(newAxis) {

        const vm = this;

        vm.chosenData = vm.data[newAxis].data;
        vm.chosenLabels = vm.data[newAxis].labels;

        vm.reDraw();
    }

    static linechartFactory() {
        require('./Linechart.scss');
        require('d3');

        function linechart($element, $timeout) {
            return new LinechartController($element, $timeout);
        }

        linechart.$inject = ['$element', '$timeout'];

        return linechart;
    }

}

export default LinechartController;
