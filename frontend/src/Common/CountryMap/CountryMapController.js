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

        this.$onInit = this.onInit;
        this.$onDestroy = this.onDestroy;
    }

    onInit() {

        this.showPlaceholder = !this.big;
        this.cs = require('../../Common/CommonServices');
        this.svgPanZoom = svgPanZoom;
        this.nationalCov = {};
        this.covLib = {};
        this.allProjects = {};

        this.EE.removeListener('country Changed');
        this.EE.removeListener('all country projects');

        if (this.big) {
            this.EE.on('country Changed', this.mapChanged, this);
            this.EE.on('projectsUpdated', this.handleUpdatedProjects, this);
            this.EE.on('all country projects', (data) => {
                this.allProjects = data;
                this.scope.$evalAsync();
            });
        }
        else {
            this.EE.once('country Changed', this.mapChanged, this);
        }
    }

    onDestroy() {
        // this.svgZoom.destroy();
        this.data = false;
        this.map = false;
    }

    saveClass(key, index, boundNrs) {
        if (boundNrs) {
            index += _.keys(boundNrs).length;
        }
        if (!this.covLib.hasOwnProperty(key)) {
            this.covLib[key] = index;
        }
    }

    setGlobal() {
        const districts = document.getElementsByClassName('d3district');
        Array.prototype.forEach.call(districts, distr => {
            distr.classList.add('global');
        });
    }

    setTotal() {
        const districts = document.getElementsByClassName('d3district');
        Array.prototype.forEach.call(districts, distr => {
            distr.classList.remove('global');
        });
    }

    handleUpdatedProjects(projects) {
        const provisionalDistrictObject = {};
        _.forEach(this.initialData.data, (district, key) => {
            const newProjectArray = [];
            _.forEach(district, project => {
                const exist = _.find(projects, item => {
                    return item.id === project.id;
                });
                if (exist) {
                    newProjectArray.push(project);
                }
            });
            if (newProjectArray.length > 0) {
                provisionalDistrictObject[key] = newProjectArray;
            }
        });
        this.data.data = provisionalDistrictObject;
        this.activeDistrict = void 0;
        this.preDraw(this.map);
    }

    dataArrived(data, national) {

        this.data = this.big ? { data } : data;
        this.initialData = _.cloneDeep(this.data);
        // console.log('DATA arrived', this.data);
        this.dataHere = true;

        if (national) {
            this.nationalCov = _.clone(national[0]);
            if (this.nationalCov.hasOwnProperty('district')) {
                delete this.nationalCov.district;
            }
            if (this.nationalCov.hasOwnProperty('health_workers')) {
                this.nationalCov['Health workers'] = '' + this.nationalCov.health_workers;
                delete this.nationalCov.health_workers;
            }
        }
        this.scope.$evalAsync();

        // console.warn('National data arrived to the mapCTRL:', this.nationalCov);

        // Aggregates the values of districts to show them all
        this.boundNrs = _.reduce(this.data.data, (ret, value, key) => {

            if (key === 'date') { return ret; }

            _.forOwn(value, (val, k) => {
                ret[k] = (ret[k] || 0) + val;
            });

            return ret;
        }, {});


        if (this.mapHere) {
            // console.debug('data arrived, map was here, starts drawing', data);
            this.preDraw(this.map);
        }
        else {
            // console.debug('data arrived, waiting for map', data);
        }
    }

    mapArrived(data) {

        this.map = data;
        this.mapHere = true;

        if (this.dataHere) {
            // console.debug('map arrived, data was here, so it starts drawing', data);
            this.preDraw(data);
        }
        else {
            // console.debug('map arrived, waiting for data');
        }
    }

    isViewer(project) {
        return this.cs.isViewer(project);
    }

    isMember(project) {
        return this.cs.isMember(project);
    }

    mapChanged() {

        this.showPlaceholder = true;
        this.EE.once('topoArrived', this.mapArrived, this);
        this.EE.once('mapdataArrived', this.dataArrived, this);
    }

    makeGeoFromTopo(topo, level) {

        // console.warn('TOPO', topo);
        // console.warn('lvl', level);

        const ret = topojson.feature(topo, topo.objects[level]);

        // console.warn('GEO', ret);
        // ret.features.forEach(el => { console.debug(el.properties.name); });

        return ret;
    }

    defaultLevels() {
        const defaultLib = {};
        _.forEach(this.cs.projectStructure.countries, country => {
            // console.debug(country.name);
            defaultLib[country.name] = 'admin_level_4';
        });

        const levelLib = {
            'Afghanistan':                  'admin_level_4', // #2
            'Angola':                       'admin_level_4', // #2
            'Benin':                        'admin_level_4', // #1.5
            'Border India - Bangladesh':    'admin_level_4', // #1
            'Border Malawi - Mozambique':   'admin_level_4', // #1
            'Botswana':                     'admin_level_4', // #2
            'Brazil':                       'admin_level_4', // #2
            'Burkina Faso':                 'admin_level_5', // #2
            'Cameroon':                     'admin_level_4', // #2
            'Central Arican Republic':      'admin_level_4', // #2
            'Chad':                         'admin_level_4', // #2
            'Congo Bazzaville':             'admin_level_4', // #2
            'Congo Kinshasa':               'admin_level_4', // #2
            'Costa Rica':                   'admin_level_4', // #2
            'Ethiopia':                     'admin_level_4', // #2
            'Gabon':                        'admin_level_4', // #2
            'Ghana':                        'admin_level_4', // #1.5
            'Guinea Bissau':                'admin_level_4', // #2
            'Guinea':                       'admin_level_6', // #2
            'Haiti':                        'admin_level_4', // #2
            'Honduras':                     'admin_level_4', // #2
            'India':                        'admin_level_5', // #1
            'Indonesia':                    'admin_level_4', // #1
            'Kenya':                        'admin_level_4', // #1
            'Liberia':                      'admin_level_4', // #1.5
            'Madagascar':                   'admin_level_4', // #2
            'Malaysia':                     'admin_level_4', // #2
            'Mali':                         'admin_level_4', // #1.5
            'Mexico':                       'admin_level_4', // #2
            'Morocco':                      'admin_level_4', // #2
            'Mozambique':                   'admin_level_4', // #2
            'Myanmar':                      'admin_level_4', // #2
            'Namibia':                      'admin_level_4', // #2
            'Nepal':                        'admin_level_6', // #1.5
            'Nicaragua':                    'admin_level_4', // #2
            'Niger':                        'admin_level_4', // #2
            'Nigeria':                      'admin_level_4', // #1.5
            'Pakistan':                     'admin_level_4', // #1
            'Peru':                         'admin_level_4', // #2
            'Philippines':                  'admin_level_3', // #1
            'Rwanda':                       'admin_level_4', // #2
            // 'Senegal':                       'admin_level_3', // #1
            'Sierra Leone':                 'admin_level_5', // #1
            'South Arica':                  'admin_level_4', // #1.5
            'South Sudan':                  'admin_level_4', // #2
            'Sri Lanka':                    'admin_level_4', // #1.5
            'Sudan':                        'admin_level_4', // #2
            'Swaziland':                    'admin_level_4', // #2
            'Tanzania':                     'admin_level_4', // #1.5
            'The Gambia':                   'admin_level_5', // #1
            'Togo':                         'admin_level_4', // #2
            'Tunisia':                      'admin_level_4', // #1
            'Uganda':                       'admin_level_6', // #1.5
            'Vietnam':                      'admin_level_4', // #1.5
            'Zambia':                       'admin_level_4', // #1.5
            'Zimbabwe':                     'admin_level_4'  // #2
        };

        _.merge(defaultLib, levelLib);

        return defaultLib;
    }

    formatCountryName() {
        const dictionary = {
            'Border India - Bangladesh': 'Bangladesh',
            'Border Malawi - Mozambique': 'Malawi'
        };
        this.countryName = dictionary[this.countryName]
            ? dictionary[this.countryName] : this.countryName;
    }

    getBindablesFromTopo(topoJSON) {

        try {
            this.flagUrl = topoJSON.admin_level_2.objects.admin_level_2.geometries[0].properties.flag ||
                topoJSON.admin_level_2.objects.admin_level_2.geometries[1].properties.flag ||
                topoJSON.admin_level_2.objects.admin_level_2.geometries[2].properties.flag;

            this.countryName =
                topoJSON.admin_level_2.objects.admin_level_2.geometries[0].properties['name:en'] ||
                topoJSON.admin_level_2.objects.admin_level_2.geometries[0].properties.name;
        }
        catch (err) {
            this.flagUrl = 'https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_The_Gambia.svg';
            this.countryName = 'Gambia';
        }

    }

    calculateScale(topoJSON) {
        let ret = Math.max.apply(null,
                topoJSON.admin_level_2.transform.scale.map(nr => {
                    return 1 / nr;
                })) * 10;

        // console.log(ret);

        if (this.countryName === 'Gambia') {
            ret = 30000;
        }

        return ret;
    }

    makeSvgPannableAndZoomable(element) {

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

        this.svgZoom = this.svgPanZoom(element, zoomOptions);
        this.svgZoom.zoomOut();
    }

    preDraw(topoJSON) {

        // console.log(JSON.stringify(topoJSON));

        d3.select(this.el[0]).select('.countrymapcontainer').remove();

        this.getBindablesFromTopo(topoJSON);

        const levelLib = this.defaultLevels();
        const level = levelLib[this.countryName] ? levelLib[this.countryName] : 'admin_level_4';

        // console.warn('Country name:', this.countryName);
        // console.warn('LVL', level);

        this.formatCountryName();

        const distrData = this.makeGeoFromTopo(topoJSON[level], level);

        const outer = d3.select(this.el[0])
            .append('div')
            .attr('class', 'countrymapcontainer');

        const width = outer[0][0].offsetWidth;
        const height = this.big ? d3.select('#map')[0][0].offsetHeight : 409;


        const inMemoryElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        inMemoryElement.createSVGMatrix();
        const element = d3.select(inMemoryElement);

        element.attr('class', 'countrymap')
            .attr('width', width)
            .attr('height', height);

        this.drawDistricts(element, distrData, topoJSON);

        outer.append(() => {
            return element.node();
        });

        this.makeSvgPannableAndZoomable(element.node());

        this.showPlaceholder = false;
        this.dataHere = false;
        this.mapHere = false;
    }

    drawDistricts(element, distrData, topoJSON) {

        // console.debug('element', element);
        // console.debug('distrData', distrData);
        // console.debug('topoJSON', topoJSON);

        const self = this;

        const projection = d3.geo.mercator()
            .scale(this.calculateScale(topoJSON));

        // console.debug('Is .features an array?', Array.isArray(distrData.features));

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
                .classed('d3district', true)
                .classed('d3district-data', gotData)
                .on('mouseover', () => {
                    if (!this.big) {
                        this.activeDistrict = {
                            name: distrName,
                            data: this.data.data[distrName]
                        };
                        this.scope.$evalAsync();
                    }
                })
                .attr('data-justtocatchdomelement', function setDictrictActiveIfHoveredLonger() {
                    // this bound as DOM iteratee (current district)
                    if (!self.big) {
                        return '';
                    }
                    d3.select(this).on('mouseover', () => {

                        window.setTimeout((e) => {

                            const stillHovered = (e.parentElement.querySelector(':hover') === e);

                            if (stillHovered) {
                                self.activeDistrict = {
                                    name: distrName,
                                    data: self.data.data[distrName]
                                };
                                self.scope.$evalAsync();
                            }
                        }, 1000, this);
                    });
                    return '';
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
