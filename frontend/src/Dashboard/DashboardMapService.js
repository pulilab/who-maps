import { AuthApi } from '../Common/';

class DashboardMapService extends AuthApi {

    constructor(_projectId) {
        super('countries');
        this.projectId = _projectId;
    }

    getCountries() {
        return this.get('')
            .then(data => data);
    }

    getCountryTopo(countryId) {
        return this.get(countryId + '/geodata/')
            .then(data => data);
    }
}

export default DashboardMapService;
