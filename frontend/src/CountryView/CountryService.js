import { AuthApi } from '../Common/';
import _ from 'lodash';

class CountryService extends AuthApi {

    constructor() {
        super('projects');
    }

    getProjects(queryObj) {

        const queryArr = [];

        _.forOwn(queryObj, (val, key) => {
            queryArr.push(key + '=' + val);
        });

        const queryString = '?' + queryArr.join('&');

        return this.get(queryString)
            .then(data => {
                // console.debug('PROJECTS data:', data);
                return data;
            });
    }

    getDisctrictProjects(countryId) {
        return this.get('by-view/map/' + countryId);
    }
}

export default CountryService;
