import { AuthApi } from '../Common/';
// import _ from 'lodash';

class CountryService extends AuthApi {

    constructor() {
        super('projects');
    }

    getAllProjects() {
        this.get('by-view/list/');
    }


    // Older
    // getProjects(countryId) {

    //     const queryString = '?country=' + countryId;

    //     return this.get(queryString)
    //         .then(data => {
    //             // console.debug('ENDPOINT:', queryString);
    //             // console.debug('PROJECTS data:', data);
    //             return data;
    //         });
    // }

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


    getDisctrictProjects(countryId) {
        return this.get('by-view/map/' + countryId);
    }
}

export default CountryService;
