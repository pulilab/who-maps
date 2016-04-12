/* global d3 */

class LinechartController {

    constructor($element, $timeout) {
        const vm = this;
        vm.el = $element;
        vm.timeout = $timeout;
        // vm.data <= binding from outer scope, holds actual data
        // vm.labels <= binding, array of labels for datasets
        // vm.showdotted <= binding, decides to show unsaved ones
        this.$onInit = () => {
            // console.log('datachooser', vm.datachooser);
            // console.log('data', vm.data);
            if (vm.datachooser) {
                vm.activeAxis = vm.data.labels[0];
                vm.chosenData = vm.data[vm.activeAxis].data;
                // console.log('chosendata', vm.chosenData);
                vm.chosenLabels = vm.data[vm.activeAxis].labels;
                // console.log('chosenlabels', vm.chosenLabels);
            }
            else {
                vm.chosenLabels = vm.labels;
            }
            vm.start();
        };

    }

    start() {

        if (this.datachooser || this.data.length > 2) {
            this.draw();
        }
        else {
            console.warn('Should show something else!!!');
        }
    }

    draw(reDraw) {

        const vm = this;

        if (reDraw) {
            d3.select(vm.el[0]).select('.linechartcontainer').remove();
        }

        const data = vm.datachooser ? vm.chosenData : vm.data;
        const labels = vm.datachooser ? vm.chosenLabels : vm.labels;

        const outer = d3.select(vm.el[0])
            .append('div')
            .attr('class', 'linechartcontainer');

        const outerWidth = outer[0][0].offsetWidth;
        const outerHeight = outer[0][0].offsetHeight;

        // Decorate data with indices
        if (!data.every(el => el.hasOwnProperty('x'))) {
            data.forEach((el, i) => {
                el.x = i + 1;
            });
        }

        const color = [
            '#6A1B9A', '#D84315', '#0097A7',
            '#FBC02D', '#558B2F', '#5D4037'
        ];

        // Should recalculate on first open || resize
        const margin = {
            top: 35,
            right: -15,
            bottom: 30,
            left: 60
        };
        const width = outerWidth - margin.left - margin.right;
        const height = outerHeight - margin.top - margin.bottom;

        // const element = d3.select('#visualization');
        const element = outer
            .append('svg')
            .attr('class', 'visualization');

        element
            .attr('width', outerWidth)
            .attr('height', outerHeight);

        const tooltip = outer
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        const xScale = d3.scale.linear()
            .range([margin.left, width - margin.right]) // the area
            .domain([0.8, (vm.showdotted ? data.length : data.length - 1) + 0.2]); // min and max values

        const yScale = d3.scale.linear()
            .range([height - margin.top, margin.bottom])
            .domain([0, 1]);

        const xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(data.length - 1)
            .tickFormat(d => {
                const canShowDate = (width - margin.left - margin.right) / ((data.length - 1) * 80) >= 1.2;
                return canShowDate ? d + '. ' + data[d - 1].date : d;
            });

        const yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .tickFormat(d3.format('.0%'));

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
                .attr('y1', yScale(i / 10))
                .attr('x2', width - margin.right)
                .attr('y2', yScale(i / 10))
                .attr('stroke', '#9D9D9D')
                .attr('stroke-width', '0.4')
                .attr('fill', 'none');
        }


        // LINES
        for (let i = 1; i <= labels.length; i += 1) {

            const line = d3.svg.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d['axis' + i]));

            // Full lines
            element.append('svg:path')
                .attr('class', 'line-axis line-axis' + i)
                .attr('d', line(data.slice(0, -1)))
                .attr('stroke', color[i - 1])
                .attr('stroke-width', 3)
                .attr('fill', 'none');

            // Dashed lines
            if (vm.showdotted) {
                element.append('svg:path')
                    .attr('class', 'line-axis line-axis' + i)
                    .attr('d', line(data.slice(-2)))
                    .attr('stroke', color[i - 1])
                    .attr('stroke-linecap', 'round')
                    .attr('stroke-width', 3)
                    .attr('stroke-dasharray', '2, 7')
                    .attr('fill', 'none');
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
                    .attr('cy', yScale(el['axis' + i]))
                    .attr('fill', color[i - 1])
                    .on('mouseover', () => {

                        tooltip.transition()
                            .duration(200)
                            .style('opacity', 1);

                        const divString = [
                            'Score: ' + Math.round(el['axis' + i] * 100) + '%',
                            '<br>',
                            'Date: ' + el.date
                        ];

                        tooltip.html(divString.join(''))
                            .style('left', (d3.event.pageX) + 'px')
                            .style('top', (d3.event.pageY - 28) + 'px');
                    })
                    .on('mouseout', () => {

                        tooltip.transition()
                            .duration(500)
                            .style('opacity', 0);

                    });
            }
        });

        // Label events to trigger classes, that opaques lines via css
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
        window.EE.once('dashResized', () => {
            vm.draw(true);
        });
    }

    // Ng-options change
    axisChange(newAxis) {
        this.chosenData = this.data[newAxis].data;
        this.chosenLabels = this.data[newAxis].labels;
        this.draw(true);
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
