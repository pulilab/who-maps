import CountryMapService from './CountryMapService.js';
import CountryService from './CountryService.js';
import _ from 'lodash';

class CountryViewModuleController {

    constructor() {

        this.EE = window.EE;
        this.mapService = new CountryMapService();
        this.service = new CountryService();
        this.getCountries();
    }

    getCountries() {

        this.mapService.getCountries().then(data => {

            // console.debug('COUNTRIES:', data);
            this.countries = data;
            this.countriesLib = {};
            data.forEach(country => {
                this.countriesLib[country.id] = country.name;
            });

            // console.debug('COUNTRY LIB', this.countriesLib);
            this.countries2 = _.cloneDeep(this.countries);
            this.countries2.push({ id: false, name: 'Show all countries' });
            // console.debug(this.countries2);
        });
    }

    getProjects(countryObj) {
        // console.debug('Selected:', countryObj);
        this.service.getProjects(countryObj.id).then(data => {
            // console.debug('PROJECTS in ' + countryObj.name, data);
            this.projectsData = data;
        });
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
        function countryController() {

            return new CountryViewModuleController();
        }

        countryController.$inject = [];

        return countryController;
    }

}

export default CountryViewModuleController;
