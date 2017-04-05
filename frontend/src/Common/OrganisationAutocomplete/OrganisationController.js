import _ from 'lodash';
import OrganisationService from './OrganisationService';

export default class OrganisationController {

    constructor($scope, $timeout) {
        this.scope = $scope;
        this.timeout = $timeout;
        this.os = new OrganisationService();
        this.$onInit = this.onInit.bind(this);
        this.addOrganisation = this.addOrganisation.bind(this);
        this.organisationSearch = this.organisationSearch.bind(this);
        this.handleOrganisationBlur = this.handleOrganisationBlur.bind(this);
    }

    onInit() {
        this.createBlurHandler();
    }

    createBlurHandler() {
        this.scope.$$postDigest(() => {
            document.querySelector('#organisation')
                .querySelector('input')
                .addEventListener('blur', this.handleOrganisationBlur);
        });
    }

    handleOrganisationBlur() {
        this.addOrganisation(_.first(this.latestOrgs));
    }

    organisationSearch(name) {
        const promise  = this.os.autocompleteOrganization(name);
        promise.then(data => {
            const input = { id: null, name, manual: true };
            if (!data.some(item => item.name === name)) {
                data.splice(0, 0, input);
            }
            this.latestOrgs = data;
            console.log(data);
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
        else {
            this.organisation = organisation;
        }
    }

    static organisationFactory() {
        require('./Organisation.scss');
        function organisation($scope, $timeout) {
            return new OrganisationController($scope, $timeout);
        }
        organisation.$inject = ['$scope', '$timeout'];
        return organisation;
    }
}
