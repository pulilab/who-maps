import keys from 'lodash/keys';
import reduce from 'lodash/reduce';
import forOwn from 'lodash/forOwn';

import * as topojson from 'topojson';
import svgPanZoom from 'svg-pan-zoom';
import d3 from 'd3';

/* global d3, DEV */

class CountryMapController {

    constructor($element, $scope, $state) {
        this.el = $element;
        this.scope = $scope;
        this.state = $state;
        this.EE = window.EE;
        this.tooltipOver = false;
        this.preventMouseOut = false;
        this.checkIfCountryChanged = this.checkIfCountryChanged.bind(this);
        this.checkIfDistrictDataChanged = this.checkIfDistrictDataChanged.bind(this);
        this.createInMemoryDOMElement = this.createInMemoryDOMElement.bind(this);
        this.drawMapShape = this.drawMapShape.bind(this);
        this.$onInit = this.onInit;
        this.$onDestroy = this.onDestroy;
    }

    onInit() {
        this.showPlaceholder = !this.big;
        this.svgPanZoom = svgPanZoom;
        this.covLib = {};
        this.svgLib = {};
        this.drawnMap = null;
        this.createInMemoryDOMElement();
        this.watchers();
    }

    createInMemoryDOMElement() {
        this.elementContainer = d3.select(this.el[0])
          .append('div')
          .attr('class', 'countrymapcontainer');

        const width = this.elementContainer[0][0].offsetWidth;
        const height = this.big ? d3.select('#map')[0][0].offsetHeight : 409;

        const inMemoryElement = document.createElement('div');
        this.mapDOMElement = d3.select(inMemoryElement).append('svg');

        this.mapDOMElement.attr('class', 'countrymap')
          .attr('width', width)
          .attr('height', height);
    }

    onDestroy() {
        this.data = false;
        this.countryMapData = false;
    }

    watchers() {
        this.scope.$watch(s => s.vm.mapData, this.checkIfCountryChanged);
        this.scope.$watch(s => s.vm.districtLevelCoverage, this.checkIfDistrictDataChanged, true);
    }

    checkIfCountryChanged(newMapData) {
        if (newMapData && newMapData.mapData && newMapData.name !== this.drawnMap) {
            this.drawMapShape(newMapData);
            this.drawnMap = newMapData.name;
        }
    }

    checkIfDistrictDataChanged(newDistrictData) {
        if (newDistrictData && this.drawnMap) {
            this.boundNrs = reduce(newDistrictData, (ret, value, key) => {
                if (key === 'date') {
                    return ret;
                }
                forOwn(value, (val, k) => {
                    ret[k] = (ret[k] || 0) + val;
                });
                return ret;
            }, {});
            this.fillDistrictData(newDistrictData);
        }
    }

    setGlobal() {
        this.showNationalLevelCoverage = true;
        const districts = document.getElementsByClassName('d3district');
        Array.prototype.forEach.call(districts, distr => {
            distr.classList.add('global');
        });
    }

    setTotal() {
        this.showNationalLevelCoverage = false;
        const districts = document.getElementsByClassName('d3district');
        Array.prototype.forEach.call(districts, distr => {
            distr.classList.remove('global');
        });
    }

    makeGeoFromTopo(topo) {
        const subKey = keys(topo.objects)[0];
        const ret = topojson.feature(topo, topo.objects[subKey]);
        return ret;
    }

    calculateScale(topoJSON) {
        return Math.max.apply(null,
          topoJSON.transform.scale.map(nr => {
              return 1 / nr;
          })
        ) * 10;
    }

    makeSvgPannableAndZoomable(element) {
        const zoomOptions = {
            panEnabled: true,
            controlIconsEnabled: false,
            zoomEnabled: true,
            mouseWheelZoomEnabled: false,
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

    drawMapShape(countryMapData) {
        this.showPlaceholder = true;
        const self = this;
        if (this.drawnMap) {
            d3.select(this.el[0]).select('.countrymapcontainer').remove();
            this.createInMemoryDOMElement();
        }
        this.countryName = countryMapData.name;
        this.flagUrl = countryMapData.flag;

        const geoData = this.makeGeoFromTopo(countryMapData.mapData);
        const projection = d3.geo.mercator()
          .scale(this.calculateScale(countryMapData.mapData));

        const path = d3.geo.path().projection(projection);

        geoData.features.forEach((feature) => {
            const mapName = feature.properties['wof:name'] || feature.properties.name;
            const districtsName = countryMapData.districts.find(dn => dn.id === mapName);
            this.svgLib[districtsName.id] = this.mapDOMElement
              .append('path')
              .datum({
                  type: geoData.type,
                  geocoding: geoData.geocoding,
                  features: [feature],
                  name: districtsName.name
              })
              .attr('d', path)
              .classed('d3district', true)
              .classed('global', this.showNationalLevelCoverage)
              .classed(`name-${districtsName.id}`, true).on('click', () => {
                  this.scope.$evalAsync(() => {
                      this.activeDistrict = {
                          name: districtsName.name,
                          data: self.svgLib[districtsName.id] ? self.svgLib[districtsName.id].districtData : null
                      };
                  });
              });
        });

        this.elementContainer.append(() => {
            return this.mapDOMElement.node();
        });

        // this.drawDistricNames(countryMapData, this.mapDOMElement);
        this.makeSvgPannableAndZoomable(this.mapDOMElement.node());

        this.showPlaceholder = false;
    }

    // Currently unused, because of font scaling and district name length inconsistencies
    // drawDistricNames(countryMapData, element) {
    //     countryMapData.districts.forEach((name, i) => {

    //         const districtPath = document.getElementsByClassName('d3district')[i];
    //         if (districtPath) {
    //             const box = districtPath.getBBox();
    //             element
    //                 .append('text')
    //                 .attr('x', box.x + box.width / 2)
    //                 .attr('y', box.y + box.height / 2)
    //                 .text(name)
    //                 .attr('font-family', 'Roboto, sans-serif')
    //                 .attr('font-size', '40px')
    //                 .attr('fill', 'black');
    //         }
    //     });
    // }


    fillDistrictData(districtLevelCoverage) {
        for (const district in this.svgLib) {
            const node = this.svgLib[district];
            if (districtLevelCoverage[district]) {
                node.classed('d3district-data', true);
                node.districtData = districtLevelCoverage[district];
            }
            else {
                node.classed('d3district-data', false);
                node.districtData = null;
            }
        }
    }

    goToProject(project) {
        if (project.isMember) {
            this.state.go('dashboard', { appName: project.id });
        }
        else {
            this.state.go('public-dashboard', { appName: project.id });
        }
    }

    static countrymapFactory() {
        require('./Countrymap.scss');

        function countrymap($element, $scope, $state) {
            return new CountryMapController($element, $scope, $state);
        }

        countrymap.$inject = ['$element', '$scope', '$state'];

        return countrymap;
    }
}

export default CountryMapController;
