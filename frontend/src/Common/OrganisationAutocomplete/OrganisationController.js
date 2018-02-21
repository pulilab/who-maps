import { searchOrganisation, addOrganisation } from '../../store/modules/system';

export default class OrganisationController {

    constructor($scope) {
        this.scope = $scope;
        this.addOrganisationName = this.addOrganisationName.bind(this);
        this.organisationSearch = this.organisationSearch.bind(this);
    }

    async organisationSearch(name) {
        const data = await searchOrganisation(name);
        const input = { id: null, name, manual: true };
        if (!data.some(item => item.name === name)) {
            data.splice(0, 0, input);
        }
        this.latestOrgs = data;
        return Promise.resolve(data);
    }

    async addOrganisationName(organisation) {
        if (organisation && organisation.manual && organisation.name.length < 101) {
            const response = await addOrganisation(organisation.name);
            this.scope.$evalAsync(() => {
                this.organisation = response;
                Object.assign(this.latestOrgs[0], response);
            });
        }
        else {
            this.organisation = organisation;
        }
    }

    static organisationFactory() {
        require('./Organisation.scss');
        function organisation($scope) {
            return new OrganisationController($scope);
        }
        organisation.$inject = ['$scope'];
        return organisation;
    }
}
