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
        this.handleData = this.handleData.bind(this);
        this.$onInit = this.onInit;
        this.$onDestroy = this.onDestroy;
    }

    onInit() {

        this.showPlaceholder = !this.big;
        this.svgPanZoom = svgPanZoom;
        this.covLib = {};
        this.watchers();

    }

    onDestroy() {
        this.data = false;
        this.countryMapData = false;
    }

    watchers() {
        this.scope.$watchCollection(s => [s.vm.districtLevelCoverage, s.vm.mapData], this.handleData);
    }

    handleData([districtCoverage, map]) {
        if (districtCoverage && map) {
            this.showPlaceholder = true;
            this.preDraw(map);
            this.boundNrs = _.reduce(districtCoverage, (ret, value, key) => {

                if (key === 'date') { return ret; }

                _.forOwn(value, (val, k) => {
                    ret[k] = (ret[k] || 0) + val;
                });

                return ret;
            }, {});
        }
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

    preDraw(countryMapData) {
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

        this.drawDistricNames(countryMapData, element);
        this.makeSvgPannableAndZoomable(element.node());

        this.showPlaceholder = false;
    }

    drawDistricNames(countryMapData, element) {
        countryMapData.districts.forEach((name, i) => {

            const districtPath = document.getElementsByClassName('d3district')[i];
            if (districtPath) {
                const box = districtPath.getBBox();
                element
                    .append('text')
                    .attr('x', box.x + box.width / 2)
                    .attr('y', box.y + box.height / 2)
                    .text(name)
                    .attr('font-family', 'Roboto, sans-serif')
                    .attr('font-size', '40px')
                    .attr('fill', 'black');
            }
        });
    }

    drawDistricts(element, geoData, countryMapData) {
        const self = this;

        const projection = d3.geo.mercator()
          .scale(this.calculateScale(countryMapData.mapData));

        const path = d3.geo.path().projection(projection);

        geoData.features.forEach((feature, i) => {

            const districtsName = countryMapData.districts[i];
            const gotData = typeof this.districtLevelCoverage[districtsName] === 'object';

            element
                .append('path')
                .datum({
                    type: geoData.type,
                    geocoding: geoData.geocoding,
                    features: [feature]
                })
                .attr('d', path)
                .classed('d3district', true)
                .classed('global', this.showNationalLevelCoverage)
                .classed('d3district-data', gotData)
                .classed(`name-${districtsName}`, true)
                .on('mouseover', () => {
                    if (!this.big) {
                        this.activeDistrict = {
                            name: districtsName,
                            data: this.districtLevelCoverage[districtsName]
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
                                    data: self.districtLevelCoverage[districtsName]
                                };
                                self.scope.$evalAsync();
                            }
                        }, 1000, this);
                    });
                    return '';
                });
        });

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
