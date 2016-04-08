/* global d3 */

class LinechartController {

    constructor($timeout) {
        const vm = this;
        // vm.data <= binding from outer scope, holds actual data
        // vm.showdotted <= binding, decides to show unsaved ones

        $timeout(() => {
            if (vm.data.length > 2) {
                vm.drawAxes();
            }
            else {
                console.warn('Should show something else!!!');
            }
        });

    }

    drawAxes() {

        const vm = this;

        const data = this.data;

        const outer = document.getElementById('linechartcontainer');

        const outerWidth = outer.offsetWidth;
        const outerHeight = outer.offsetHeight;

        // Decorate data with indices
        if (!data.every(el => el.hasOwnProperty('x'))) {
            data.forEach((el, i) => {
                el.x = i + 1;
            });
        }

        const color = {
            a1: '#6A1B9A',
            a2: '#D84315',
            a3: '#0097A7',
            a4: '#FBC02D',
            a5: '#558B2F',
            a6: '#5D4037'
        };

        // Should recalculate on first open || resize
        const margin = {
            top: 35,
            right: -15,
            bottom: 30,
            left: 60
        };
        const width = outerWidth - margin.left - margin.right;
        const height = outerHeight - margin.top - margin.bottom;

        const element = d3.select('#visualization');

        element
            .attr('width', outerWidth)
            .attr('height', outerHeight);

        const tooltip = element.select(function d3GetParent() { return this.parentNode; })
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
            .ticks(data.length - 1);

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
        for (let i = 1; i <= 6; i += 1) {

            const line = d3.svg.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d['axis' + i]));

            // Full lines
            element.append('svg:path')
                .attr('class', 'line-axis line-axis' + i)
                .attr('d', line(data.slice(0, -1)))
                .attr('stroke', color['a' + i])
                .attr('stroke-width', 3)
                .attr('fill', 'none');

            // Dashed lines
            if (vm.showdotted) {
                element.append('svg:path')
                    .attr('class', 'line-axis line-axis' + i)
                    .attr('d', line(data.slice(-2)))
                    .attr('stroke', color['a' + i])
                    .attr('stroke-linecap', 'round')
                    .attr('stroke-width', 3)
                    .attr('stroke-dasharray', '2, 7')
                    .attr('fill', 'none');
            }
        }

        // DOTS
        const dotData = vm.showdotted ? vm.data : vm.data.slice(0, -1);

        dotData.forEach(el => {
            for (let i = 1; i <= 6; i += 1) {

                element.append('circle')
                    .attr('class', 'dot-axis dot-axis' + i)
                    .attr('r', 5)
                    .attr('cx', xScale(el.x))
                    .attr('cy', yScale(el['axis' + i]))
                    .attr('fill', color['a' + i])
                    .on('mouseover', () => {

                        tooltip.transition()
                            .duration(200)
                            .style('opacity', 1);

                        const divString = [
                            'Score: ' + Math.round(el['axis' + i] * 100) + '%',
                            '<br>',
                            'Date: ' + el.date
                            // What about points covering each other?
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
        [1, 2, 3, 4, 5, 6].forEach(i => {
            d3.select('.labelhov' + i)
                .on('mouseover', () => {
                    element.classed('activelabel' + i, true);
                })
                .on('mouseout', () => {
                    element.classed('activelabel' + i, false);
                });
        });

        // Redraw on window resize (may be optimized to only redraw if the width changed)
        function resizedw() {
            d3.selectAll('svg > *').remove();
            d3.select('.tooltip').remove();
            vm.drawAxes();
        }

        let doit;
        window.onresize = () => {
            clearTimeout(doit);
            doit = setTimeout(resizedw, 50);
        };

    }

    static linechartFactory() {
        require('./Linechart.scss');
        require('d3');

        function linechart($timeout) {
            return new LinechartController($timeout);
        }

        linechart.$inject = ['$timeout'];

        return linechart;
    }

}

export default LinechartController;
