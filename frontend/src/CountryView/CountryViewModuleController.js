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
        this.getCountries();
    }

    getCountries() {

        this.mapService.getCountries().then(data => {

            this.countries = data.sort((a, b) => a.name.localeCompare(b.name));
            this.countriesLib = {};
            data.forEach(country => {
                this.countriesLib[country.id] = country.name;
            });

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
        return this.cs.isMember(project)
    }


    getProjects(countryObj) {
        // console.debug('Selected:', countryObj);
        this.service.getProjects(countryObj.id).then(data => {
            // console.debug('all PROJECTS in country ' + countryObj.name, data);
            this.projectsData = data;
            this.EE.emit('all country projects', data);
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

        this.service.getDisctrictProjects(countryId).then(data => {
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
