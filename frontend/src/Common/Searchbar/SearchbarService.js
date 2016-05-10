import _ from 'lodash';
import SimpleApi from '../SimpleApi';

/* global Promise */

class SearchbarService extends SimpleApi {
    constructor() {
        super();
    }

    searchProject(searchStr, filters) {
        const data = {
            query: searchStr
        };
        _.reduce(filters, (acc, filter) => {
            acc[filter.name] = filter.value;
            return acc;
        }, data);

        return this.post('search/projects/', data)
            .then(results => {
                return results.json();
            });
    }
}

export default SearchbarService;
