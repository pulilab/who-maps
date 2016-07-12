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
        this.createFiltersObject();
    }

    createBaseObj(name) {
        return { name, items: [], open: false };
    }

    createFiltersObject() {
        const continuumObj = this.createBaseObj('continuum');
        const ageRangeObj = this.createBaseObj('age range');
        const interventionsObj = this.createBaseObj('interventions');
        const technologyPlatformsObj = this.createBaseObj('technology platforms');
        const applicationObj = this.createBaseObj('applications');
        const constraintsObj = this.createBaseObj('constraints');

        _.forEach(this.cs.hssStructure.continuum, continuum => {
            continuumObj.items.push({
                name: continuum.title,
                value: false
            });

        });

        _.forEach(this.cs.hssStructure.age_ranges, age_range => {
            ageRangeObj.items.push({
                name: age_range,
                value: false
            });
        });

        _.forEach(this.cs.hssStructure.interventions, interventions => {
            _.forEach(interventions, intervention => {
                interventionsObj.items.push({
                    name: intervention,
                    value: false
                });
            });

        });
        interventionsObj.items = _.uniqBy(interventionsObj.items, 'name');

        _.forEach(this.cs.projectStructure.technology_platforms, tp => {
            technologyPlatformsObj.items.push({
                name: tp,
                value: false
            });
        });

        _.forEach(this.cs.hssStructure.applications, application => {
            _.forEach(application.subApplications, subApp => {
                applicationObj.items.push({
                    name: subApp,
                    value: false
                });
            });
        });

        _.forEach(this.cs.hssStructure.taxonomies, taxonomy => {
            _.forEach(taxonomy.values, constraint => {
                constraintsObj.items.push({
                    name: constraint,
                    value: false
                });
            });
        });

        this.filterCategory = [continuumObj, interventionsObj, technologyPlatformsObj, applicationObj, constraintsObj];

    }

    filterClv() {
        const filters = {};
        _.forEach(this.filterCategory, category => {
            filters[category.name] = _.chain(category.items)
                .map(value => {
                    return value.value ? value.name : false;
                })
                .filter()
                .value();
        });

        this.service.filterProjects(filters).then(data => {
            this.projectsData = data;
            this.scope.$evalAsync();
        });
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
