/* global d3 */

import mockGeoJsonCountry from   './mock/pakistan/admin_level_2.geojson';
import mockGeoJsonDistricts from './mock/pakistan/admin_level_4.geojson';

class CountrymapController {

    constructor() {
        const vm = this;
        vm.drawMap();
    }

    drawMap() {

        // Actual data fetch here!!
        const distrData = mockGeoJsonDistricts;
        const countryData = mockGeoJsonCountry;

        const outer = document.getElementById('countrymapcontainer');

        const outerWidth = outer.offsetWidth;
        const outerHeight = outer.offsetHeight;

        const margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
        const width = outerWidth - margin.left - margin.right;
        const height = outerHeight - margin.top - margin.bottom;

        const element = d3.select('#countrymap');

        element
            .attr('width', outerWidth)
            .attr('height', outerHeight);

        // const tooltip = element.select(function d3GetParent() { return this.parentNode; })
        //     .append('div')
        //     .attr('class', 'cmtooltip')
        //     .style('opacity', 0);


        const borders = distrData.features.reduce((ret, region) => {
            region.geometry.coordinates[0][0].forEach(points => {
                ret.xmin = Math.min(ret.xmin, points[0]);
                ret.xmax = Math.max(ret.xmax, points[0]);
                ret.ymin = Math.min(ret.ymin, points[1]);
                ret.ymax = Math.max(ret.ymax, points[1]);
            });
            return ret;
        }, {
            xmin: Infinity,
            xmax: 0,
            ymin: Infinity,
            ymax: 0
        });
        borders.xcenter = (borders.xmin + borders.xmax) / 2;
        borders.ycenter = (borders.ymin + borders.ymax) / 2;

        const scale = Math.max(
            width / (borders.xmax - borders.xmin),
            height / (borders.ymax - borders.ymin)
        );

        // Appending areas
        // const projection = d3.geo.albers()
        //     .center([borders.xcenter, borders.ycenter])
        //     .rotate([0, 0])
        //     .parallels([borders.xmin, borders.xmax])
        //     .scale(scaleX * 60)
        //     .translate([width / 2, height / 2]);

        const projection = d3.geo.mercator()
            .center([borders.xcenter, borders.ycenter])
            .scale(scale * 30)
            .translate([width / 2, height / 2]);

        // Appending the country
        element.append('path')
            .datum(countryData)
            .attr('d', d3.geo.path().projection(projection))
            .attr('class', 'd3country');

        // Appending the districts
        element.append('path')
            .datum(distrData)
            .attr('d', d3.geo.path().projection(projection))
            .attr('class', 'd3district');


        // element.selectAll('path')
        //     .data(data)
        //     .enter().append('path')
        //         .attr()

    }

    static countrymapFactory() {
        require('./Countrymap.scss');
        require('d3');

        function countrymap() {
            return new CountrymapController();
        }

        countrymap.$inject = [];

        return countrymap;
    }

}

export default CountrymapController;
