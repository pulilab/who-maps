// import _ from 'lodash';
/* global d3 */


class LinechartController {

    constructor() {
        require('./Linechart.scss');
        require('d3');
        const vm = this;
        // vm.data <= binding from outer scope, holds the data
        vm.drawAxes();
    }

    drawAxes() {

        const data = this.data;

        // Axis colors
        const color = {
            a1: '#6A1B9A',
            a2: '#D84315',
            a3: '#0097A7',
            a4: '#FBC02D',
            a5: '#558B2F',
            a6: '#5D4037'
        };

        // Margin, width, height
        const margin = {
            top: 20,
            right: 80,
            bottom: 30,
            left: 50
        };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const element = d3.select('#visualization');

        const xScale = d3.scale.linear()
            .range([margin.left, width - margin.right]) // the area
            .domain([0, data.length - 1]); // min and max values

        const yScale = d3.scale.linear()
            .range([height - margin.top, margin.bottom])
            .domain([0, 50]);

        const xAxis = d3.svg.axis()
            .scale(xScale);

        const yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

        // Appending the X axis
        element.append('svg:g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
            .call(xAxis);

        // Appending the Y axis
        element.append('svg:g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + (margin.left) + ',0)')
            .call(yAxis);


        // Appending the axis's data
        for (let i = 1; i <= 6; i += 1) {

            const line = d3.svg.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d['axis' + i]));

            element.append('svg:path')
                .attr('d', line(data))
                .attr('stroke', color['a' + i])
                .attr('stroke-width', 3)
                .attr('fill', 'none');

        }

    }

    static linechartFactory() {
        function linechart() {
            return new LinechartController();
        }
        linechart.$inject = [];
        return linechart;
    }

}

export default LinechartController;
