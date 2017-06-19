import _ from 'lodash';
import * as topojson from 'topojson';
import svgPanZoom from 'svg-pan-zoom';
import d3 from 'd3';

/* global d3, DEV */

class CountryMapController {

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
            this.EE.on('projectFiltered', this.handleFilteredProject, this);
        }
        else {
            this.EE.once('country Changed', this.mapChanged, this);
        }
    }

    onDestroy() {
        // this.svgZoom.destroy();
        this.data = false;
        this.countryMapData = false;
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
        this.isGlobalOrNational = true;
        if (this.allProjects.length === 0) {
            return;
        }
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

    handleFilteredProject(projects) {
        this.handleUpdatedProjects(projects);
        this.allProjects = projects;
        if (this.isGlobalOrNational) {
            if (this.allProjects.length > 0) {
                this.setGlobal();
            }
            else {
                this.setTotal();
            }
        }
    }

    handleUpdatedProjects(projects) {
        if (!this.data) {
            return;
        }
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
        this.preDraw(this.countryMapData);
    }

    dataArrived(data, national) {

        this.data = this.big ? { data } : data;
        this.initialData = _.cloneDeep(this.data);
        // console.log('DATA arrived', this.data);
        this.dataHere = true;
        if (national) {
            this.nationalCov = Object.assign({}, national);
            if (!_.isNil(this.nationalCov.health_workers)) {
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
            this.preDraw(this.countryMapData);
        }
        else {
            // console.debug('data arrived, waiting for map', data);
        }
    }

    mapArrived(data) {

        this.countryMapData = data;
        this.mapHere = true;

        if (this.dataHere) {
            // console.debug('map arrived, data was here, so it starts drawing', data);
            this.preDraw(this.countryMapData);
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

    makeGeoFromTopo(topo) {
        // console.warn('TOPO', topo);
        const subKey = _.keys(topo.objects)[0];
        const ret = topojson.feature(topo, topo.objects[subKey]);
        return ret;
    }

    formatCountryName() {
        const dictionary = {
            'Border India - Bangladesh': 'Bangladesh',
            'Border Malawi - Mozambique': 'Malawi'
        };
        this.countryName = dictionary[this.countryName]
          ? dictionary[this.countryName] : this.countryName;
    }

    calculateScale(topoJSON) {
        let ret = Math.max.apply(null,
            topoJSON.transform.scale.map(nr => {
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

    preDraw(countryMapData) {
        if (!countryMapData) {
            return;
        }
        // console.log(JSON.stringify(topoJSON));
        d3.select(this.el[0]).select('.countrymapcontainer').remove();

        const topoJSON = countryMapData.mapData;
        this.countryName = countryMapData.name;
        this.flagUrl = countryMapData.flag;
        this.formatCountryName();

        const geoData = this.makeGeoFromTopo(topoJSON);
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

        this.drawDistricts(element, geoData, countryMapData);

        outer.append(() => {
            return element.node();
        });

        this.makeSvgPannableAndZoomable(element.node());

        this.showPlaceholder = false;
        this.dataHere = false;
        this.mapHere = false;
    }

    drawDistricts(element, geoData, countryMapData) {
        const self = this;
        const projection = d3.geo.mercator()
          .scale(this.calculateScale(countryMapData.mapData));

        const path = d3.geo.path().projection(projection);

        for (let i = 0; i < geoData.features.length; i += 1) {

            const districtsName = countryMapData.districts[i];
            const gotData = typeof this.data.data[districtsName] === 'object';

            element
              .append('path')
              .datum({
                  type: geoData.type,
                  geocoding: geoData.geocoding,
                  features: [geoData.features[i]]
              })
              .attr('d', path)
              .classed('d3district', true)
              .classed('d3district-data', gotData)
              .classed(`name-${districtsName}`, true)
              .on('mouseover', () => {
                  if (!this.big) {
                      this.activeDistrict = {
                          name: districtsName,
                          data: this.data.data[districtsName]
                      };
                      this.scope.$evalAsync();
                  }
              })
              .attr('data-justtocatchdomelement', function setDistrictActiveIfHoveredLonger() {
                  // this bound as DOM iteratee (current district)
                  if (!self.big) {
                      return '';
                  }
                  d3.select(this).on('mouseover', () => {

                      window.setTimeout((e) => {

                          const stillHovered = (e.parentElement.querySelector(':hover') === e);

                          if (stillHovered) {
                              self.activeDistrict = {
                                  name: districtsName,
                                  data: self.data.data[districtsName]
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
            return new CountryMapController($element, $scope);
        }

        countrymap.$inject = ['$element', '$scope'];

        return countrymap;
    }
}

export default CountryMapController;
