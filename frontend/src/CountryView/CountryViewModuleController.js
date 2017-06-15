import _ from 'lodash';
import moment from 'moment';
import CountryService from './CountryService.js';
import PDFExportStorage from './PDFExport/PDFExportStorage';

class CountryViewModuleController {

    constructor($scope, $filter, $state,  CommonService) {

        this.EE = window.EE;
        this.cs = CommonService;
        this.scope = $scope;
        this.filter = $filter;
        this.state = $state;
        this.mapService = require('../Common/CustomCountryService');
        this.service = new CountryService();
        this.pdfStorage = PDFExportStorage.factory();
        this.$onInit = this.onInit.bind(this);
    }


    onInit() {
        this.header = {
            name: { up: false, down: false },
            country: { up: false, down: false },
            organisation_name: { up: false, down: false },
            donors: { up: false, down: false },
            contact_name: { up: false, down: false },
            implementation_overview: { up: false, down: false },
            implementing_partners: { up: false, down: false },
            geographic_scope: { up: false, down: false },
            health_focus_area: { up: false, down: false }
        };
        this.getCountries();
        this.lastFilter = null;
        this.filterArray = [
            this.createFilterCategory('software',
              this.cs.projectStructure.technology_platforms)
        ];
    }

    extractConstraints(collection) {
        const result = [];
        _.forEach(collection, (tax, key) => {
            result.push(key);
        });
        return result;
    }

    concatenateApplications(collection) {
        let result = [];
        _.forEach(collection, application => {
            result = _.concat(result, _.toArray(application.subApplications));
        });
        return result;
    }

    createFilterCategory(name, collection, unique, subItem, preParse) {
        const base = { name, items: [], open: false };

        if (preParse) {
            collection = preParse(collection);
        }

        if (collection) {
            _.forEach(collection, item => {
                base.items.push({
                    name: subItem ? item[subItem] : item,
                    value: false
                });
            });
            if (unique) {
                base.items = _.uniqBy(base.items, unique);
            }
        }
        console.log(base);
        return base;
    }

    replaceLodash(item) {
        return item ? item.replace('_', ' ') : '';

    }

    filterClv() {
        const filters = {};
        _.forEach(this.filterArray, category => {
            filters[category.name] = _.chain(category.items)
              .map(value => {
                  return value.value ? value.name : false;
              })
              .filter()
              .value();
        });
        if (_.flattenDeep(_.toArray(filters)).length > 0 && this.countryProjects && this.countryProjects.length > 0) {
            let provisionalArray = this.countryProjects.slice();
            provisionalArray = this.filterByPlatforms(provisionalArray, filters);
            this.projectsData = _.uniqBy(provisionalArray, 'id');
        }
        else {
            this.projectsData = this.countryProjects;
        }

        this.EE.emit('projectFiltered', this.projectsData);
    }

    filterByPlatforms(projects, filters) {
        if (filters.platforms && filters.platforms.length > 0) {
            return projects.filter(p => {
                if (p.platforms && p.platforms.length > 0) {
                    return p.platforms.some(plat => filters.platforms.indexOf(plat.name) > -1);
                }
                return false;
            });
        }
        return projects;
    }

    getCountries() {

        this.mapService.getCountries().then(data => {
            this.countries = data.slice();
            this.countriesLib = {};
            this.countries.forEach(country => {
                this.countriesLib[country.id] = country.name;
            });

            // console.debug('COUNTRY LIB', this.countriesLib);
            this.countries.unshift({ id: false, name: 'Show all countries' });

            if (this.cs.userProfile && this.cs.userProfile.country) {
                const name = this.cs.userProfile.country;
                this.selectedCountry = _.find(this.countries, { name });
                this.updateCountry(this.selectedCountry);
                this.scope.$evalAsync();
            }
        });
    }

    isViewer(project) {
        return this.cs.isViewer(project);
    }

    isMember(project) {
        return this.cs.isMember(project);
    }


    getProjects(countryObj) {
        // console.debug('Selected:', countryObj);
        this.service.getProjects(countryObj.id).then(data => {
            // console.debug('PROJECTS in ' + countryObj.name, data);
            this.projectsData = data;
            this.countryProjects = _.cloneDeep(data);
            this.EE.emit('all country projects', data);
        });
    }

    updateCountry(countryObj) {
        if (countryObj.name !== 'Show all countries') {
            this.changeMapTo(countryObj);
        }
        this.getProjects(countryObj);
    }

    changeMapTo(countryObj) {
        // console.log('chosen country:', countryObj);
        this.EE.emit('country Changed');
        this.fetchCountryMap(countryObj.id);
        this.fetchDistrictProjects(countryObj.id);
    }

    // For map TAB
    fetchDistrictProjects(countryId) {
        this.service.getDistrictProjects(countryId).then(data => {
            // console.debug('getDistrictProjects:', data);
            this.EE.emit('mapdataArrived', data);
        });
    }

    fetchCountryMap(id) {
        this.mapService.getCountryMapData(id).then(data => {
            this.EE.emit('topoArrived', data);
        });
    }

    exportPDF() {
        this.pdfStorage.setData(this.projectsData, this.selectedCountry);
        const href = this.state.href('pdf-export');
        window.open(href);
    }

    exportCSV() {
        const ids = _.map(this.projectsData, p => {
            return p.id;
        });
        this.service.exportCSV(ids).then(response => {
            const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${response}`);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `clv-export-${moment().format('MMMM-Do-YYYY-h-mm-ss ')}.csv`);
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);

            link.click();
        });
    }

    orderTable(name) {
        _.forEach(this.header, h => {
            h.up = false;
            h.down = false;
        });
        this.header[name].down = true;
        let lastFilter = null;
        let orderKey = `-${name}`;
        if (name !== this.lastFilter) {
            lastFilter = name;
            orderKey = name;
            this.header[name].down = false;
            this.header[name].up = true;
        }
        this.lastFilter = lastFilter;
        this.projectsData = this.filter('orderBy')(this.projectsData, orderKey);
    }

    printImplementingPartners({ implementing_partners }) {
        if (implementing_partners.length > 0) {
            return implementing_partners.join(', ').trim();
        }
        return '';
    }

    static countryControllerFactory() {
        function countryController($scope, $filter, $state) {
            const CommonService = require('../Common/CommonServices');
            return new CountryViewModuleController($scope, $filter, $state, CommonService);
        }

        countryController.$inject = ['$scope', '$filter', '$state'];

        return countryController;
    }

}

export default CountryViewModuleController;
