/* global d3 */
import _ from 'lodash';
import * as ProjectModule from '../../store/modules/projects';

class LinechartController {
    constructor($scope, $element, $timeout, $ngRedux) {
        this.scope = $scope;
        this.EE = window.EE;
        this.el = $element;
        this.timeout = $timeout;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.draw = this.draw.bind(this);
        this.unsubscribe = $ngRedux.connect(this.mapData.bind(this), ProjectModule)(this);
    }

    mapData(state) {
        let data = ProjectModule.getMapsDomainData(state);
        const result = {};

        if (!this.datachooser) {
            if (this.notpercentage) {
                data = ProjectModule.getCoverageData(state);
                result.data = data.data;
                result.maxValue = this.calculateMaxData(data);
                result.labels = data.labels;
                result.chosenLabels = data.labels;
            }
            else {
                data = ProjectModule.getMapsAxisData(state);
                result.data = data.data;
                result.labels = data.labels;
                result.chosenLabels = data.labels;
            }
        }
        else {
            const activeAxis = data.labels[0];
            result.data = data;
            result.labels = data.labels;
            result.activeAxis = activeAxis;
            result.chosenData = data[activeAxis].data;
            result.chosenLabels = data[activeAxis].labels;
        }
        return result;
    }

    calculateMaxData(data) {
        return data.data.reduce((ret, version) => {
            _.forOwn(version, (val, key) => {
                if (key !== 'date' || key !== 'x') {
                    ret = val > ret ? val : ret;
                }
            });
            return ret;
        }, 0);
    }

    resizeTick() {
        this.resizeCount += 1;
    }

    onInit() {
        this.resizeCount = 0;
        this.scope.$watchGroup([s => s.vm.data, s => s.vm.chosenData, s=> s.vm.chosenLabels, s=> s.vm.resizeCount],
          ([data, chosenData, chosenLabels]) => {
              if (data) {
                  this.draw(data, chosenData, chosenLabels);
              }
          });
        this.EE.on('dashResized', this.resizeTick, this);
    }
    onDestroy() {
        this.EE.removeListener('dashResized', this.resizeTick);
        this.unsubscribe();
    }

    draw(data, chosenData, chosenLabels) {
        d3.select(this.el[0]).select('.linechartcontainer').remove();
        data = this.datachooser && chosenData ? chosenData : data;
        const labels = this.datachooser && chosenLabels ? chosenLabels : this.labels;


        const outer = d3.select(this.el[0])
          .append('div')
          .attr('class', 'linechartcontainer')
          .classed('secondary-colors', this.notpercentage);

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
          .domain([0.8, (this.showdotted ? data.length : data.length - 1) + 0.2]); // min and max values

        const percScale = d3.scale.linear()
          .range([height - margin.top, margin.bottom])
          .domain([0, 1]);

        const simpleScale = d3.scale.linear()
          .range([height - margin.top, margin.bottom])
          .domain([0, this.maxValue]);

        const yScale = this.notpercentage ? simpleScale : percScale;

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
          .orient('left')
          .tickFormat(this.notpercentage ? d3.format('d') : d3.format('.0%'));

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
            if (this.showdotted) {
                element.append('svg:path')
                  .attr('class', 'line-axis line-axis-dashed line-axis' + i)
                  .attr('d', line(data.slice(-2)));
            }
        }

        // DOTS
        const dotData = this.showdotted ? data : data.slice(0, -1);

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
                      divString[0] = this.notpercentage ? el['axis' + i] : divString[0];

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
        function labelHoverFn() {

            for (let i = 1; i <= labels.length; i += 1) {

                d3.select(this.el[0]).select('.labelhov' + i)
                  .on('mouseover', () => {
                      element.classed('activelabel' + i, true);
                  })
                  .on('mouseout', () => {
                      element.classed('activelabel' + i, false);
                  });
            }
        }

        // Label events to trigger classes, that opaques lines via css
        // timeout is sometimes needed, because the labels arent in the DOM yet after redraw
        if (d3.select(this.el[0]).select('.labelhov' + labels.length).empty()) {
            this.timeout(labelHoverFn.bind(this), 250);
        }
        else {
            labelHoverFn.bind(this)();
        }

        // Redraw on window size change
    }


    // Ng-options change
    axisChange(newAxis) {
        this.chosenData = this.data[newAxis].data;
        this.chosenLabels = this.data[newAxis].labels;
        this.draw();
    }

    static linechartFactory() {
        require('./Linechart.scss');
        require('d3');

        function linechart($scope, $element, $timeout, $ngRedux) {
            return new LinechartController($scope, $element, $timeout, $ngRedux);
        }

        linechart.$inject = ['$scope', '$element', '$timeout', '$ngRedux'];

        return linechart;
    }

}

export default LinechartController;
