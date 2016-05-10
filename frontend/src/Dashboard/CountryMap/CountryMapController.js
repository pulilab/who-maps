/* global d3, DEV */

import _ from 'lodash';
import topojson from 'topojson';
import svgPanZoom from 'svg-pan-zoom';
import d3 from 'd3';

// import topoSource from './mock/sierra-leone/topoTest.json';
// const mockGeoJsonDistricts = topojson.feature(topoSource, topoSource.objects.admin_level_5);

class CountrymapController {

    constructor($element, $scope) {

        this.el = $element;
        this.scope = $scope;
        this.EE = window.EE;
        this.tooltipOver = false;
        this.preventMouseOut = false;
        // this.activeDistrict, contains data for the maps toolkits lower half (ng-if -ed)


        this.$onInit = () => {

            this.svgPanZoom = svgPanZoom;
            this.EE.once('topoArrived', this.mapArrived.bind(this));
            this.EE.once('mapdataArrived', this.dataArrived.bind(this));
        };

        this.$onDestroy = () => {

            this.svgZoom.destroy();
            this.data = false;
            this.map = false;
        };
    }

    dataArrived(data) {
        // Aggregates the values of districts to show them all

        const vm = this;
        vm.data = data;
        // console.debug('DATA to populate map with:', vm.data);

        vm.boundNrs = _.reduce(vm.data.data, (ret, value, key) => {

            if (key === 'date') { return ret; }

            _.forOwn(value, (val, k) => {
                ret[k] = (ret[k] || 0) + val;
            });

            return ret;
        }, {});

        // console.debug('BOUNDNRS', vm.boundNrs);

        if (vm.map) {
            // console.debug('data arrived, map was here, starts drawing', data);
            vm.drawMap(vm.map);
        }
        else {
            // console.debug('data arrived, waiting for map', data);
        }
    }

    mapArrived(data) {

        const vm = this;
        vm.map = data;
        if (vm.data) {
            // console.debug('map arrived, data was here, so it starts drawing');
            vm.drawMap(data);
        }
        else {
            // console.debug('map arrived, waiting for data');
        }
    }

    makeGeoFromTopo(topo, level) {
        // return topojson.feature(topo, topoSource.objects.admin_level_5);
        return topojson.feature(topo, topo.objects[level]);
    }

    drawMap(topoJSON) {

        const vm = this;
        // console.warn('Draw FN run!');

        d3.select(vm.el[0]).select('.countrymapcontainer').remove();

        vm.flagUrl = topoJSON.admin_level_2.objects.admin_level_2.geometries[0].properties.flag;

        vm.countryName =
            topoJSON.admin_level_2.objects.admin_level_2.geometries[0].properties['name:en'] ||
            topoJSON.admin_level_2.objects.admin_level_2.geometries[0].properties.name;

        const levelLib = {
            'Sierra Leone': 'admin_level_5',
            'India': 'admin_level_5',
            'Kenya': 'admin_level_4',
            'Philippines': 'admin_level_3',
            'Border India - Bangladesh': 'admin_level_4'
        };

        const level = levelLib[vm.countryName];

        if (vm.countryName === 'Border India - Bangladesh') { vm.countryName = 'Bangladesh'; }

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

        // console.debug('FROM TOPO:', topoJSON.admin_level_2.transform.scale);

        const scale = Math.max.apply(null, topoJSON.admin_level_2.transform.scale.map(nr => {
            return 1 / nr;
        })) * 10;

        // console.log('SCALE', scale);

        const projection = d3.geo.mercator()
            .scale(scale);


        // Appending the districts
        for (let i = 0; i < distrData.features.length; i += 1) {

            const distrName = distrData.features[i].properties['name:en'] ||
                distrData.features[i].properties.name;

            const gotData = typeof vm.data.data[distrName] === 'object';

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

                    vm.activeDistrict = {
                        name: distrName,
                        data: vm.data.data[distrName]
                    };
                    vm.scope.$evalAsync();

                });
        }

        const zoomOptions = {
            panEnabled: true,
            controlIconsEnabled: false,
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
