/* global d3 */

import _ from 'lodash';
import topojson from 'topojson';
import svgPanZoom from 'svg-pan-zoom';

import perfMockMap from './perfMockMap';

// SIERRA LEONE
import mockGeoJsonCountry from './mock/sierra-leone/admin_level_2.geojson';
// import mockGeoJsonDistricts from './mock/sierra-leone/admin_level_5.geojson';
import topoSource from './mock/sierra-leone/topoTest.json';
const mockGeoJsonDistricts = topojson.feature(topoSource, topoSource.objects.admin_level_5);

class CountrymapController {

    constructor($element, $scope) {

        const vm = this;
        // BINDINGS
        // data / data to show, district names has to match with countryLvl4-8's
        // country / country name as string
        // countryLvl2 / .geojson level 2 with districts

        vm.el = $element;
        vm.scope = $scope;

        // now ONLY because it contains map URL, and country name...
        vm.mockGeoJsonCountry = mockGeoJsonCountry;
        vm.activeDistrict = {
            name: '',
            data: [
                { placeholder1: 0 },
                { placeholder2: 1 },
                { placeholder3: 2 }
            ]
        };

        // Aggregates the values of districts to show them all
        vm.boundNrs = _.reduce(perfMockMap.data.slice(-1)[0], (ret, value) => {

            if (typeof value !== 'object') {
                return ret;
            }

            ret.Clients += value.Clients;
            ret['Health workers'] += value['Health workers'];
            ret.Facilities += value.Facilities;

            return ret;
        }, {
            'Clients': 0,
            'Health workers': 0,
            'Facilities': 0
        });

        vm.$onInit = () => {
            vm.svgPanZoom = svgPanZoom;
            vm.drawMap();
        };
    }

    drawMap() {

        const vm = this;

        d3.select(vm.el[0]).select('.countrymapcontainer').remove();

        // If any map comes with mixed winding order, do:
        // const rewind = require('geojson-rewind');
        // const distrData = rewind(mockGeoJsonDistricts);
        const distrData = mockGeoJsonDistricts;

        const outer = d3.select(vm.el[0])
            .append('div')
            .attr('class', 'countrymapcontainer');

        const element = outer.append('svg')
            .attr('class', 'countrymap')
            .attr('width', 460)
            .attr('height', 460);

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

        const projection = d3.geo.mercator()
            .scale(scale);


        // Appending the districts
        for (let i = 0; i < distrData.features.length; i += 1) {

            const gotData = typeof perfMockMap
                .data[perfMockMap.data.length - 1][distrData.features[i].properties.name] === 'object';

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
                        data: perfMockMap.data[perfMockMap.data.length - 1][distrData.features[i].properties.name]
                    };
                })
                .on('mouseout', () => {
                    vm.scope.$evalAsync();
                    vm.activeDistrict.name = '';
                });
        }

        const zoomOptions = {
            panEnabled: true,
            controlIconsEnabled: true,
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
    }

    static countrymapFactory() {
        require('./Countrymap.scss');
        require('d3');

        function countrymap($element, $scope) {
            return new CountrymapController($element, $scope);
        }

        countrymap.$inject = ['$element', '$scope'];

        return countrymap;
    }
}

export default CountrymapController;
