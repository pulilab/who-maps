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

            this.showPlaceholder = !this.big;
            this.cs = require('../../Common/CommonServices');
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
            vm.preDraw(vm.map);
        }
        else {
            // console.debug('data arrived, waiting for map', data);
        }
    }

    mapChanged() {

        this.showPlaceholder = true;
        this.EE.once('topoArrived', this.mapArrived, this);
        this.EE.once('mapdataArrived', this.dataArrived, this);
    }

    mapArrived(data) {
        const vm = this;
        vm.map = data;
        vm.mapHere = true;

        if (vm.dataHere) {
            // console.debug('map arrived, data was here, so it starts drawing', data);
            vm.preDraw(data);
        }
        else {
            // console.debug('map arrived, waiting for data');
        }
    }

    makeGeoFromTopo(topo, level) {
        return topojson.feature(topo, topo.objects[level]);
    }

    defaultLevels() {
        const defaultLib = {};
        _.forEach(this.cs.projectStructure.countries, country => {
            defaultLib[country.name] = 'admin_level_5';
        });

        const levelLib = {
            'Sierra Leone': 'admin_level_5',
            'India': 'admin_level_4', // Precise enough map-data?
            'Kenya': 'admin_level_4',
            'Philippines': 'admin_level_3', // Precise enough map-data?
            'Border India - Bangladesh': 'admin_level_4',
            'Indonesia': 'admin_level_4', // Precise enough map-data?
            'Border Malawi - Mozambique': 'admin_level_4',
            'The Gambia': 'admin_level_3',
            'Tunisia': 'admin_level_4',
            'Pakistan': 'admin_level_4'
        };

        _.merge(defaultLib, levelLib);

        return defaultLib;
    }

    formatCountryName() {
        const dictionary = {
            'Border India - Bangladesh': 'Bangladesh',
            'Border Malawi - Mozambique': 'Malawi',
            'The Gambia': 'Senegal'
        };
        this.countryName = dictionary[this.countryName]
            ? dictionary[this.countryName] : this.countryName;
    }

    getBindablesFromTopo(topoJSON) {

        this.flagUrl = topoJSON.admin_level_2.objects.admin_level_2.geometries[0].properties.flag ||
            topoJSON.admin_level_2.objects.admin_level_2.geometries[1].properties.flag ||
            topoJSON.admin_level_2.objects.admin_level_2.geometries[2].properties.flag;

        this.countryName =
            topoJSON.admin_level_2.objects.admin_level_2.geometries[0].properties['name:en'] ||
            topoJSON.admin_level_2.objects.admin_level_2.geometries[0].properties.name;
    }

    calculateScale(topoJSON) {
        return Math.max.apply(null,
        topoJSON.admin_level_2.transform.scale.map(nr => {
            return 1 / nr;
        })) * 10;
    }

    makeSvgPannableAndZoomable() {

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

        this.svgZoom = this.svgPanZoom('.countrymap', zoomOptions);
        this.svgZoom.zoomOut();
    }

    preDraw(topoJSON) {

        d3.select(this.el[0]).select('.countrymapcontainer').remove();

        this.getBindablesFromTopo(topoJSON);

        const levelLib = this.defaultLevels();
        const level = levelLib[this.countryName] ? levelLib[this.countryName] : 'admin_level_5';

        this.formatCountryName();

        const distrData = this.makeGeoFromTopo(topoJSON[level], level);

        const outer = d3.select(this.el[0])
            .append('div')
            .attr('class', 'countrymapcontainer');

        const width = outer[0][0].offsetWidth;
        const height = this.big ? d3.select('#map')[0][0].offsetHeight : 409;

        const element = outer.append('svg')
            .attr('class', 'countrymap')
            .attr('width', width)
            .attr('height', height);

        this.drawDistricts(element, distrData, topoJSON);

        this.makeSvgPannableAndZoomable();

        this.showPlaceholder = false;
        this.dataHere = false;
        this.mapHere = false;
    }

    drawDistricts(element, distrData, topoJSON) {

        const projection = d3.geo.mercator()
            .scale(this.calculateScale(topoJSON));

        for (let i = 0; i < distrData.features.length; i += 1) {

            const distrName = distrData.features[i].properties['name:en'] ||
                distrData.features[i].properties.name;

            const gotData = typeof this.data.data[distrName] === 'object';

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

                    this.activeDistrict = {
                        name: distrName,
                        data: this.data.data[distrName]
                    };
                    this.scope.$evalAsync();

                });
        }
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
