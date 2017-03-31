import OrganisationService from './OrganisationService';

export default class OrganisationController {

    constructor($scope) {
        this.scope = $scope;
        this.os = new OrganisationService();
        this.$onInit = this.onInit.bind(this);
        this.addOrganisation = this.addOrganisation.bind(this);
        this.organisationSearch = this.organisationSearch.bind(this);
    }

    onInit() {
        this.watchers();
    }

    watchers() {
        const self = this;
        this.scope.$watch(() => {
            return this.organisation;
        }, self.addOrganisation);
    }


    organisationSearch(name) {
        const promise  = this.os.autocompleteOrganization(name);
        promise.then(data => {
            const input = { id: null, name, manual: true };
            if (!data.some(item => item.name === name)) {
                data.splice(0, 0, input);
            }
            this.latestOrgs = data;
        });
        return promise;
    }

    addOrganisation(organisation) {
        if (organisation && organisation.manual) {
            this.os.addOrganization(organisation.name)
                .then(response => {
                    this.organisation = response;
                    this.scope.$evalAsync();
                });
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
