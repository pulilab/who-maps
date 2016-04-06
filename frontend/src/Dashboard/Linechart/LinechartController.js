/* global d3 */

class LinechartController {

    constructor() {
        require('./Linechart.scss');
        require('d3');
        const vm = this;
        // vm.data <= binding from outer scope, holds the data
        if (vm.data.length > 2) {
            vm.drawAxes();
        }
        else {
            console.warn('Should show a barchart');
        }
    }

    drawAxes() {

        const data = this.data;

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

        const axes = [
            'Groundwork',
            'Partnerships',
            'Financial health',
            'Technology & architecture',
            'Operations',
            'Monitoring & evaluation'
        ];

        // Should recalculate on first open || resize
        const margin = {
            top: 30,
            right: 30,
            bottom: 30,
            left: 30
        };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const element = d3.select('#visualization');

        const tooltip = element.select(function d3GetParent() { return this.parentNode; })
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);


        const xScale = d3.scale.linear()
            .range([margin.left, width - margin.right]) // the area
            .domain([1, data.length]); // min and max values

        const yScale = d3.scale.linear()
            .range([height - margin.top, margin.bottom])
            .domain([
                0,
                this.data.reduce((ret, el) => {
                    for (let j = 1; j <= 6; j += 1) {
                        ret = Math.max(ret, el['axis' + j]);
                    }
                    return ret;
                }, 0) // this is the highest score
            ]);

        const xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(data.length - 1);

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

        // LINES
        for (let i = 1; i <= 6; i += 1) {

            const line = d3.svg.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d['axis' + i]));

            // Full lines
            element.append('svg:path')
                .attr('class', 'line-axis' + i)
                .attr('d', line(data.slice(0, -1)))
                .attr('stroke', color['a' + i])
                .attr('stroke-width', 4)
                .attr('fill', 'none');

            // Dashed lines
            element.append('svg:path')
                .attr('class', 'line-axis' + i)
                .attr('d', line(data.slice(-2)))
                .attr('stroke', color['a' + i])
                .attr('stroke-width', 4)
                .attr('stroke-dasharray', '12, 12')
                .attr('fill', 'none');
        }

        // DOTS
        data.forEach(el => {
            for (let i = 1; i <= 6; i += 1) {

                element.append('circle')
                    .attr('class', 'dot-axis' + i)
                    .attr('r', 5)
                    .attr('cx', xScale(el.x))
                    .attr('cy', yScale(el['axis' + i]))
                    .attr('fill', color['a' + i])
                    .on('mouseover', () => {

                        tooltip.transition()
                            .duration(200)
                            .style('opacity', 0.9);

                        const divString = [
                            axes[i - 1], // Axis name
                            '<br>',
                            el['axis' + i] + ' points',
                            '<br>',
                            el.name, // 'Version x'
                            '<br>',
                            el.date.split('-').join('. ') + '.'
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
