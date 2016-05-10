import CountryMapService from './CountryMapService.js';
import CountryService from './CountryService.js';

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
        });
    }

    getProjects(countryObj) {
        // console.debug('Selected:', countryObj);
        this.service.getProjects({ country: countryObj.id }).then(data => {
            // console.debug('PROJECTS in ' + countryObj.name, data);
            this.projectsData = data;
        });
    }

    changeMapTo(countryObj) {
        // console.log('chosen country:', countryObj);
        this.fetchCountryMap(countryObj.id);
        this.fetchDistrictProjects(countryObj.id);
    }

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
