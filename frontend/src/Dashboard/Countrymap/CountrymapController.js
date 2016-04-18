/* global d3 */

import _ from 'lodash';

import perfMockMap from './perfMockMap';

// SIERRA LEONE
import mockGeoJsonCountry from './mock/sierra-leone/admin_level_2.geojson';
import mockGeoJsonDistricts from './mock/sierra-leone/admin_level_5.geojson';

// PAKISTAN
// import mockGeoJsonCountry from './mock/pakistan/admin_level_2.geojson';
// import mockGeoJsonDistricts from './mock/pakistan/admin_level_4.geojson';

// SYRIA
// import mockGeoJsonCountry from './mock/syria/admin_level_2.geojson';
// import mockGeoJsonDistricts from './mock/syria/admin_level_4.geojson';

// HUNGARY
// import mockGeoJsonCountry from './mock/hungary/admin_level_2.geojson';
// import mockGeoJsonDistricts from './mock/hungary/admin_level_5.geojson';

class CountrymapController {

    constructor($element, $scope) {

        const vm = this;
        // BINDINGS
        // data / data to show, district names has to match with countryLvl2's
        // country / country name as string
        // countryLvl2 / .geojson level 2 with districts

        vm.el = $element;
        vm.scope = $scope;

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
            vm.drawMap();
            // window.EE.on('dashResized', vm.drawMap.bind(vm));
        };
    }

    drawMap() {

        const vm = this;

        d3.select(vm.el[0]).select('.countrymapcontainer').remove();

        // Will fetch already rewinded data from the backend
        const rewind = require('geojson-rewind');
        const distrData = rewind(mockGeoJsonDistricts);

        const outer = d3.select(vm.el[0])
            .append('div')
            .attr('class', 'countrymapcontainer');

        // const outerWidth = outer[0][0].offsetWidth;
        // const outerHeight = outer[0][0].offsetHeight;

        // const margin = {
        //     top: 0,
        //     right: 0,
        //     bottom: 0,
        //     left: 0
        // };
        // const width = outerWidth - margin.left - margin.right;
        // const height = outerHeight - margin.top - margin.bottom;

        const element = outer.append('svg')
            .attr('class', 'countrymap')
            .attr('width', 460)
            .attr('height', 460);

        // This may be a bit heavy to do on the frontend...
        // TODO: Perf: for cycles instead
        const bounds = distrData.features.reduce((ret, region) => {
            region.geometry.coordinates[0][0].forEach(points => {
                ret.xmin = ret.xmin > points[1] ? points[1] : ret.xmin;
                ret.xmax = ret.xmax < points[1] ? points[1] : ret.xmax;
                ret.ymin = ret.ymin > points[0] ? points[0] : ret.ymin;
                ret.ymax = ret.ymax < points[0] ? points[0] : ret.ymax;
            });
            return ret;
        }, {
            xmin: 180,
            xmax: -180,
            ymin: 180,
            ymax: -180
        });
        bounds.xcenter = (bounds.xmin + bounds.xmax) / 2;
        bounds.ycenter = (bounds.ymin + bounds.ymax) / 2;
        bounds.xdiff = bounds.xmax - bounds.xmin;
        bounds.ydiff = bounds.ymax - bounds.ymin;

        const scale = 22000 / Math.max(bounds.xdiff, bounds.ydiff);

        // Projection function
        const projection = d3.geo.mercator()
            .center([bounds.ycenter, bounds.xcenter])
            .scale(scale)
            .translate([230, 230]);


        // Appending the districts
        for (let i = 0; i < distrData.features.length; i += 1) {

            const gotData = typeof perfMockMap
                .data[perfMockMap.data.length - 1][distrData.features[i].name] === 'object';

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
                        name: distrData.features[i].name,
                        data: perfMockMap.data[perfMockMap.data.length - 1][distrData.features[i].name]
                    };
                })
                .on('mouseout', () => {
                    vm.scope.$evalAsync();
                    vm.activeDistrict.name = '';
                });
        }

        // window.EE.on('dashResized', () => {
        //     element
        //         .attr('width', outer[0][0].offsetWidth - margin.left - margin.right)
        //         .attr('height', outer[0][0].offsetHeight - margin.top - margin.bottom);
        // });
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
