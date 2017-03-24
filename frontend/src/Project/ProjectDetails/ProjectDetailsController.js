import _ from 'lodash';
import CollapsibleSet from '../CollapsibleSet';
import ProjectService from '../ProjectService';
import EditProfileService from '../../Common/EditProfile/EditProfileService';

const wholeCountryName = ' ENTIRE COUNTRY';

class ProjectDetailsController extends CollapsibleSet {

    constructor($scope, $element) {
        super($element);
        this.ccs = require('../../Common/CustomCountryService');
        this.ns = new ProjectService();
        this.es = new EditProfileService();
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
    }

    bindFunctions() {
        this.fetchDistricts = this.fetchDistricts.bind(this);
        this.getUsers = this.getUsers.bind(this);
    }

    onInit() {
        window.TEST = this.project;
        console.log(this);
        this.bindFunctions();
        this.watchers();
        this.getStructureData();
        this.createBlurHandle();
        this.districtList = [];
        this.users = [];
        this.team = [];
        this.viewers = [];
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

    addChild(childName) {
        this.project[childName].push({});
    }

    showAddMore(index, collection) {
        return index === (collection.length - 1);
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
        this.handleCustomError('name');
        this.ns.autocompleteProjectName(this.project.name)
            .then(result => {
                _.forEach(result, project => {
                    project.isOwn = _.find(this.cs.projectList, pj => {
                        return pj.id === project.id;
                    });
                });
                this.similarProject = result;
                if (result && result[0] && result[0].name.toLowerCase() === this.project.name.toLowerCase()) {
                    this.setCustomError('name', 'Project name is not unique');
                }
                this.scope.$evalAsync();
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
