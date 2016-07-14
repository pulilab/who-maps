import { AuthApi } from '../Common/';
// import _ from 'lodash';

class CountryService extends AuthApi {

    constructor() {
        super('projects');
    }

    getAllProjects() {
        this.get('by-view/list/');
    }

    getProjects(countryId) {

        let string = 'by-view/list';
        if (countryId) {
            string += '/' + countryId + '/';
        }
        else {
            string += '/';
        }
        // console.warn(string);

        return this.get(string)
            .then(data => {
                // console.debug('ENDPOINT: ', string);
                // console.debug('PROJECTS data per country #' + countryId + ':', data);
                return data;
            });
    }


    getDistrictProjects(countryId) {
        return this.get(`by-view/map/${countryId}/`);
    }

    filterProjects(filters) {
        return this.post('/by-view/filter/', filters)
            .then(response => {
                return response.json();
            });
    }
}

export default CountryService;
