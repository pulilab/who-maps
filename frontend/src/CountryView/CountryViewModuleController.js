import CountryMapService from './CountryMapService.js';
import CountryService from './CountryService.js';

class CountryViewModuleController {

    constructor() {

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

    static countryControllerFactory() {
        function countryController() {

            return new CountryViewModuleController();
        }

        countryController.$inject = [];

        return countryController;
    }

}

export default CountryViewModuleController;
