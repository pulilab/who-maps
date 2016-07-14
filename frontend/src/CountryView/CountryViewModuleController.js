import CountryMapService from './CountryMapService.js';
import CountryService from './CountryService.js';
import _ from 'lodash';

class CountryViewModuleController {

    constructor($scope, CommonService) {

        this.EE = window.EE;
        this.cs = CommonService;
        this.scope = $scope;
        this.mapService = new CountryMapService();
        this.service = new CountryService();
        this.$onInit = this.onInit.bind(this);
    }


    onInit() {
        this.getCountries();
        this.filterArray = [
            this.createFilterCategory('continuum', this.cs.hssStructure.continuum, null, 'title'),
            this.createFilterCategory('interventions',
                this.cs.hssStructure.interventions, 'name'),
            this.createFilterCategory('technology_platforms',
                this.cs.projectStructure.technology_platforms),
            this.createFilterCategory('applications', this.cs.hssStructure.applications),
            this.createFilterCategory('constraints', this.cs.hssStructure.taxonomies)
        ];    }

    createFilterCategory(name, collection, unique, subItem) {
        const base = { name, items: [], open: false };
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
        return base;
    }

    replaceLodash(item) {
        if (item) {
            return item.replace('_', ' ');
        }
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
        if (_.flattenDeep(_.toArray(filters)).length > 0) {
            filters.provisonalArray = _.cloneDeep(this.countryProjects);
            this.generalFilter(filters, 'continuum');
            this.generalFilter(filters, 'interventions');
            this.generalFilter(filters, 'applications');
            this.generalFilter(filters, 'constraints');
            this.generalFilter(filters, 'technology_platforms');
            this.projectsData = _.uniqBy(filters.provisonalArray, 'id');
        }
        else {
            this.projectsData = this.countryProjects;
        }
    }

    generalFilter(filters, name) {
        const localArray = [];
        _.forEach(filters.provisonalArray, project => {
            const inter = _.intersection(project[name], filters[name]);
            if (inter.length === filters[name].length) {
                localArray.push(project);
            }
        });
        filters.provisonalArray = localArray;
    }

    getCountries() {

        this.mapService.getCountries().then(data => {

            this.countries = data.sort((a, b) => a.name.localeCompare(b.name));
            this.countriesLib = {};
            data.forEach(country => {
                this.countriesLib[country.id] = country.name;
            });

            // console.debug('COUNTRY LIB', this.countriesLib);
            this.countries2 = _.cloneDeep(this.countries);
            this.countries2.unshift({ id: false, name: 'Show all countries' });
            if (this.cs.userProfile && this.cs.userProfile.country) {
                const name = this.cs.userProfile.country.toLowerCase();
                this.selectedCountry = _.find(this.countries2, { name });
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
        });
    }

    updateCountry(countryObj) {
        // console.debug('To countryObj: ', countryObj);
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

        // console.debug('TRYING TO FETCH COUNTRYMAP for ID:', id);
        this.mapService.getCountryTopo(id).then(data => {

            // console.debug('RAW topo arrived from API, will send over EE', data);
            this.EE.emit('topoArrived', data);
        });
    }

    static countryControllerFactory() {
        function countryController($scope) {
            const CommonService = require('../Common/CommonServices');
            return new CountryViewModuleController($scope, CommonService);
        }

        countryController.$inject = ['$scope'];

        return countryController;
    }

}

export default CountryViewModuleController;
