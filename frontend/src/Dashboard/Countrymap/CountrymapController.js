/* global d3 */

// import mockGeoJsonCountry from   './mock/pakistan/admin_level_2.geojson';
// import mockGeoJsonDistricts from './mock/pakistan/admin_level_4.geojson';

// import mockGeoJsonCountry from   './mock/sierra-leone/admin_level_2.geojson';
import mockGeoJsonDistricts from './mock/sierra-leone/admin_level_5.geojson';

class CountrymapController {

    constructor($element) {
        const vm = this;
        vm.el = $element;

        vm.$onInit = () => {
            console.log('BINDINGS: \nvm.data: ' + vm.data + '\nvm.country: ' + vm.country);
            vm.drawMap();
        };
    }

    drawMap() {

        // Actual data fetch here!!
        const rewind = require('geojson-rewind');
        // const distrData = mockGeoJsonDistricts;
        const distrData = rewind(mockGeoJsonDistricts);

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


        // This is a bit heavy to do on the frontend
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
        console.log(scale);

        // Repair scale here!!
        const projection = d3.geo.mercator()
            .center([borders.xcenter, borders.ycenter])
            // .scale(scale * 30)
            .scale(5000);

        // Repair x&y here!!
        const transform = 'translate(' + (width / 2) + ',' + (-borders.ycenter) + ')';

        // Appending the districts
        const districts = element.selectAll('g')
            .data(distrData.features)
            .enter()
            .append('g');

        districts.append('path')
            .attr('fill', 'white')
            .attr('fill-rule', 'nonzero')
            .attr('d', d3.geo.path().projection(projection))
            .attr('transform', transform)
            .attr('class', 'd3district');
    }

    static countrymapFactory() {
        require('./Countrymap.scss');
        require('d3');

        function countrymap($element) {
            return new CountrymapController($element);
        }

        countrymap.$inject = ['$element'];

        return countrymap;
    }
}

export default CountrymapController;
