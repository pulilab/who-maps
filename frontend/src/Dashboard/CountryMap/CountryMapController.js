/* global d3 */

import _ from 'lodash';
import topojson from 'topojson';
import svgPanZoom from 'svg-pan-zoom';
import d3 from 'd3';

// import topoSource from './mock/sierra-leone/topoTest.json';
// const mockGeoJsonDistricts = topojson.feature(topoSource, topoSource.objects.admin_level_5);

class CountrymapController {

    constructor($element, $scope) {

        const vm = this;

        // BINDING
        // vm.data / data to show, district names has to match with countryLvl4-8's
        // vm.json // {lvl2: xx, lvlx: xxx} format

        vm.el = $element;
        vm.scope = $scope;
        vm.EE = window.EE;
        // vm.activeDistrict, contains data for the maps toolkits lower half (ng-if -ed)


        vm.$onInit = () => {

            // Aggregates the values of districts to show them all
            vm.boundNrs = _.reduce(vm.data.data.slice(-1)[0], (ret, value) => {

                if (typeof value !== 'object') {
                    return ret;
                }
                ret.Clients += value.clients;
                ret['Health workers'] += value.workers;
                ret.Facilities += value.facilities;

                return ret;
            }, {
                'Clients': 0,
                'Health workers': 0,
                'Facilities': 0
            });

            vm.svgPanZoom = svgPanZoom;
            // vm.drawMap();
            vm.EE.once('topoArrived', vm.drawMap.bind(vm));
        };
    }

    makeGeoFromTopo(topo, level) {

        // return topojson.feature(topo, topoSource.objects.admin_level_5);
        return topojson.feature(topo, topo.objects[level]);

    }

    drawMap(topoJSON) {

        const vm = this;

        d3.select(vm.el[0]).select('.countrymapcontainer').remove();

        vm.flagUrl = topoJSON.admin_level_2.objects.admin_level_2.geometries[0].properties.flag;

        vm.countryName = topoJSON.admin_level_2.objects.admin_level_2.geometries[0].properties['name:en'] ||
            topoJSON.admin_level_2.objects.admin_level_2.geometries[0].properties.name;

        console.log(topoJSON.admin_level_2.objects.admin_level_2.geometries[0].properties);

        // If any map comes with mixed winding order, do:
        // const rewind = require('geojson-rewind');
        // const distrData = rewind(mockGeoJsonDistricts);

        // const distrData = mockGeoJsonDistricts;
        let level = _.keys(topoJSON);
        level = level.length === 1 ? 'admin_level_2' : level.filter(a => a !== 'admin_level_2')[0];
        const distrData = vm.makeGeoFromTopo(topoJSON[level], level);


        const outer = d3.select(vm.el[0])
            .append('div')
            .attr('class', 'countrymapcontainer');

        const outerWidth = outer[0][0].offsetWidth;
        // const outerHeight = outer[0][0].offsetHeight;

        const element = outer.append('svg')
            .attr('class', 'countrymap')
            .attr('width', outerWidth)
            .attr('height', 409);


        const scale = vm.calculateScale(distrData);

        const projection = d3.geo.mercator()
            .scale(scale);


        // Appending the districts
        for (let i = 0; i < distrData.features.length; i += 1) {

            const gotData = typeof vm.data
                .data[vm.data.data.length - 1][distrData.features[i].properties.name] === 'object';

            element
                .append('path')
                .datum({
                    type: distrData.type,
                    geocoding: distrData.geocoding,
                    features: [distrData.features[i]]
                })
                .attr('d', d3.geo.path().projection(projection))
                .attr('class', 'd3district')
                .classed('d3district-data', gotData)
                .on('mouseover', () => {
                    vm.scope.$evalAsync();
                    vm.activeDistrict = {
                        name: distrData.features[i].properties.name,
                        data: vm.data.data[vm.data.data.length - 1][distrData.features[i].properties.name]
                    };
                })
                .on('mouseout', () => {
                    vm.scope.$evalAsync();
                    vm.activeDistrict.name = '';
                });
        }

        const zoomOptions = {
            panEnabled: true,
            controlIconsEnabled: false, // <= change this to toggle controls
            zoomEnabled: true,
            mouseWheelZoomEnabled: true,
            preventMouseEventsDefault: true,
            zoomScaleSensitivity: 0.2,
            minZoom: 0.5,
            maxZoom: 10,
            contain: false,
            center: true,
            refreshRate: 'auto'
        };

        vm.svgZoom = vm.svgPanZoom('.countrymap', zoomOptions);

        vm.svgZoom.zoomOut();
    }

    calculateScale(distrData) {

        const bounds = {
            xmin: 180,
            xmax: -180,
            ymin: 180,
            ymax: -180
        };

        for (let i = 0; i < distrData.features.length; i += 1) {

            const points = distrData.features[i].geometry.coordinates[0][0];
            const l = points.length;

            for (let j = 0; j < l; j += 1) {
                bounds.xmin = bounds.xmin > points[j][1] ? points[j][1] : bounds.xmin;
                bounds.xmax = bounds.xmax < points[j][1] ? points[j][1] : bounds.xmax;
                bounds.ymin = bounds.ymin > points[j][0] ? points[j][0] : bounds.ymin;
                bounds.ymax = bounds.ymax < points[j][0] ? points[j][0] : bounds.ymax;
            }
        }

        bounds.xdiff = bounds.xmax - bounds.xmin;
        bounds.ydiff = bounds.ymax - bounds.ymin;

        const scale = 20000 / Math.max(bounds.xdiff, bounds.ydiff);

        return scale;
    }

    static countrymapFactory() {
        require('./Countrymap.scss');

        function countrymap($element, $scope) {
            return new CountrymapController($element, $scope);
        }

        countrymap.$inject = ['$element', '$scope'];

        return countrymap;
    }
}

export default CountrymapController;
