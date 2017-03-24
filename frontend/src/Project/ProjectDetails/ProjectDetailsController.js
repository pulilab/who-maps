import _ from 'lodash';
import CollapsibleSet from '../CollapsibleSet';
import ProjectService from '../ProjectService';
import EditProfileService from '../../Common/EditProfile/EditProfileService';

const wholeCountryName = ' ENTIRE COUNTRY';

class ProjectDetailsController extends CollapsibleSet {

    constructor($scope, $element) {
        super($element, 'project');
        this.ccs = require('../../Common/CustomCountryService');
        this.ns = new ProjectService();
        this.es = new EditProfileService();
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
    }

    bindFunctions() {
        this.fetchDistricts = this.fetchDistricts.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.checkName = this.checkName.bind(this);
    }

    onInit() {
        this.bindFunctions();
        this.watchers();
        this.getStructureData();
        this.createBlurHandle();
        this.districtList = [];
        this.users = [];
        this.team = [];
        this.viewers = [];
        this.projectList = [];
    }

    watchers() {
        const self = this;
        self.scope.$watch(() => {
            return this.project.country;
        }, self.fetchDistricts);
    }

    getStructureData() {
        const self = this;
        this.ccs.getCountries().then(data => {
            self.scope.$evalAsync(() => {
                self.countriesList = data;
            });
        });
    }

    getUsers(criteria) {
        return this.users.filter(el => {
            if (el && el.name) {
                return _.includes(el.name.toLowerCase(), criteria.toLowerCase()) ||
                    _.includes(el.organisation__name.toLowerCase(), criteria.toLowerCase());
            }
            return false;
        });
    }


    fetchDistricts(country) {
        const self = this;
        if (country) {
            self.ccs.getCountryDistricts(country)
                .then(self.handleDistrictData.bind(self));
        }
    }

    handleDistrictData(data) {
        data.unshift(wholeCountryName);
        this.districtList = data;
        this.scope.$evalAsync();
    }

    handleCustomError(key) {
        this.form[key].$setValidity('custom', true);
        this.form[key].customError = [];
    }

    setCustomError(key, error) {
        this.form[key].$setValidity('custom', false);
        this.form[key].customError.push(error);
    }

    checkName() {
        const self = this;
        // this.handleCustomError('name');
        self.ns.autocompleteProjectName(self.project.name)
            .then(result => {
                _.forEach(result, project => {
                    project.isOwn = _.find(self.projectList, pj => {
                        return pj.id === project.id;
                    });
                });
                self.similarProject = result;
                if (result && result[0] && result[0].name.toLowerCase() === self.project.name.toLowerCase()) {
                    self.setCustomError('name', 'Project name is not unique');
                }
                self.scope.$evalAsync();
            });
    }

    createBlurHandle() {

        this.scope.$$postDigest(() => {

            // document.querySelector('#orgauto')
            //     .querySelector('input')
            //     .addEventListener('blur', () => {
            //         if (!this.latestOrgs.some(org => org.name === this.searchText)) {
            //             this.addOrganisation(this.searchText);
            //         }
            //     });
        });
    }

    openSimilarProject(project, event) {
        event.preventDefault();
        if (project.isOwn) {
            this.state.go('dashboard', { appName: project.id });
        }
        else {
            this.state.go('public-dashboard', { appName: project.id });
        }

    }

    organisationSearch(name) {
        const getOrgsPromise  = this.es.autocompleteOrganization(name);
        getOrgsPromise.then(data => {
            this.latestOrgs = data;
        });
        return getOrgsPromise;
    }

    addOrganisation(name) {
        return this.es.addOrganization(name)
            .then(response => {
                this.userProfile.organisation = response;
                this.project.organisation = response;
                this.scope.$evalAsync();
            });
    }


    static projectDetailFactory() {
        require('./ProjectDetails.scss');
        function projectDetail($scope, $element) {
            return new ProjectDetailsController($scope, $element);
        }
        projectDetail.$inject = ['$scope', '$element'];
        return projectDetail;
    }
}

export default ProjectDetailsController;
