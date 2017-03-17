import _ from 'lodash';
import NewProjectService from '../ProjectService';
import ProjectDefinition from '../../Common/ProjectDefinition';
import EditProfileService from '../../Common/EditProfile/EditProfileService';

/* global DEV, DEBUG, Promise */


class ProjectDetailsController extends ProjectDefinition {

    constructor($scope, $state, $anchorScroll, $location, CommonService, toast) {
        super(CommonService);
        this.ns = new NewProjectService();
        this.es = new EditProfileService();
        this.ccs = require('../../Common/CustomCountryService');
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.location = $location;
        this.scroll = $anchorScroll;
        this.scroll.yOffset = 140;
        this.$onInit = this.onInit.bind(this);
        this.toast = toast;
    }

    bindFunctions() {
        this.countryCloseCallback = this.countryCloseCallback.bind(this);
        this.districtCloseCallback = this.districtCloseCallback.bind(this);
        this.setStrategy = this.setStrategy.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.handleDistrictRequest = this.handleDistrictRequest.bind(this);
    }

    onInit() {
        this.bindFunctions();
        this.createBlurHandle();
        this.districtList = [];
        this.allUsers = this.cs.usersProfiles;

        this.team = [];
        this.viewers = [];
        this.team.push(_.find(this.allUsers, { id: this.userProfile.id }));
    }

    putGroups() {
        return this.ns.putGroups(this.projectId, this.team, this.viewers);
    }

    countryCloseCallback(name) {
        console.log(name);
        // const countries = _.filter(this.structure.countries, { name });
        // if (countries.length === 1) {
        //     this.project.countryName = name;
        //     this.project.country = _.cloneDeep(countries[0]).id;
        //     this.ccs.getCountryDistricts(this.project.country)
        //     .then(this.handleDistrictData.bind(this));
        //
        // }
        this.handleCustomError('country');
    }

    handleDistrictData(data) {
        this.districtList = data;
        this.mergeNationalLevelWithDistrictCoverage();
        this.scope.$evalAsync();
    }

    repeatBind(item) {
        item.districtCallback = this.districtCloseCallback.bind(this, item);
        item.typeCallback = this.typeCloseCallback.bind(this, item);
    }

    typeCloseCallback(coverage, type) {
        coverage.typeChosen = type;
    }

    districtCloseCallback(coverage, district) {
        coverage.district = district;
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

            document.querySelector('#orgauto')
                .querySelector('input')
                .addEventListener('blur', () => {
                    if (!this.latestOrgs.some(org => org.name === this.searchText)) {
                        this.addOrganisation(this.searchText);
                    }
                });
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
        const CommonService =  require('../../Common/CommonServices');
        function projectDetail($scope, $state, $anchorScroll, $location, $mdToast) {
            return new ProjectDetailsController($scope, $state, $anchorScroll,
                $location, CommonService, $mdToast);
        }
        projectDetail.$inject = ['$scope', '$state', '$anchorScroll', '$location', '$mdToast'];
        return projectDetail;
    }
}

export default ProjectDetailsController;
