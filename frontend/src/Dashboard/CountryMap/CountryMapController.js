/* global d3, DEV */

import _ from 'lodash';
import topojson from 'topojson';
import svgPanZoom from 'svg-pan-zoom';
import d3 from 'd3';

class CountrymapController {

    constructor($element, $scope) {

        this.el = $element;
        this.scope = $scope;
        this.EE = window.EE;
        this.tooltipOver = false;
        this.preventMouseOut = false;

        this.$onInit = () => {

            this.svgPanZoom = svgPanZoom;

            this.EE.removeListener('country Changed');

            if (this.big) {
                this.EE.on('country Changed', this.mapChanged, this);
            }
            else {
                this.EE.once('country Changed', this.mapChanged, this);
            }
        };

        this.$onDestroy = () => {
            // this.svgZoom.destroy();
            this.data = false;
            this.map = false;
        };
    }

    dataArrived(data) {
        // Aggregates the values of districts to show them all

        const vm = this;
        vm.data = vm.big ? { data } : data;
        this.dataHere = true;

        vm.boundNrs = _.reduce(vm.data.data, (ret, value, key) => {

            if (key === 'date') { return ret; }

            _.forOwn(value, (val, k) => {
                ret[k] = (ret[k] || 0) + val;
            });

            return ret;
        }, {});

        if (vm.mapHere) {
            // console.debug('data arrived, map was here, starts drawing', data);
            vm.drawMap(vm.map);
        }
        else {
            // console.debug('data arrived, waiting for map', data);
        }
    }

    mapChanged() {

        this.EE.once('topoArrived', this.mapArrived, this);
        this.EE.once('mapdataArrived', this.dataArrived, this);
    }

    mapArrived(data) {

        const vm = this;
        vm.map = data;
        vm.mapHere = true;

        if (vm.dataHere) {
            // console.debug('map arrived, data was here, so it starts drawing', data);
            vm.drawMap(data);
        }
        else {
            // console.debug('map arrived, waiting for data');
        }
    }

    makeGeoFromTopo(topo, level) {

        return topojson.feature(topo, topo.objects[level]);
    }

    drawMap(topoJSON) {

        const vm = this;


        d3.select(vm.el[0]).select('.countrymapcontainer').remove();

        vm.flagUrl = topoJSON.admin_level_2.objects.admin_level_2.geometries[0].properties.flag ||
            topoJSON.admin_level_2.objects.admin_level_2.geometries[1].properties.flag;

        vm.countryName =
            topoJSON.admin_level_2.objects.admin_level_2.geometries[0].properties['name:en'] ||
            topoJSON.admin_level_2.objects.admin_level_2.geometries[0].properties.name;

        const levelLib = {
            'Sierra Leone': 'admin_level_5',
            'India': 'admin_level_4',
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

        const width = outer[0][0].offsetWidth;
        const height = this.big ? d3.select('#map')[0][0].offsetHeight : 409;

        const element = outer.append('svg')
            .attr('class', 'countrymap')
            .attr('width', width)
            .attr('height', height);

        const scale = Math.max.apply(null, topoJSON.admin_level_2.transform.scale.map(nr => {
            return 1 / nr;
        })) * 10;

        const projection = d3.geo.mercator()
            .scale(scale);

        // Appending the districts
        for (let i = 0; i < distrData.features.length; i += 1) {

            const distrName = distrData.features[i].properties['name:en'] ||
                distrData.features[i].properties.name;

            const gotData = typeof vm.data.data[distrName] === 'object';

            // Appending path
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

        this.dataHere = false;
        this.mapHere = false;
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
