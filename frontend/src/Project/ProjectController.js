import _ from 'lodash';
import NewProjectService from './ProjectService';
import * as ProjectModule from '../store/modules/projects';
import * as SystemModule from '../store/modules/system';
import * as UserModule from '../store/modules/user';
import * as CountryModule from '../store/modules/countries';

/* global DEV, DEBUG, Promise */

class ProjectController  {

    constructor($scope, $state, Upload, toast, $timeout, $ngRedux, $location) {
        this.ns = new NewProjectService(Upload);
        this.ccs = require('../Common/CustomCountryService');
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.location = $location;
        this.timeout = $timeout;
        this.$onInit = this.onInit.bind(this);
        this.postSaveActions = this.postSaveActions.bind(this);
        this.getCountryFields = this.getCountryFields.bind(this);
        this.registerEventIfNotPresent = this.registerEventIfNotPresent.bind(this);
        this.toast = toast;
        this.mapData = this.mapData.bind(this);
        this.unsubscribeProjects = $ngRedux.connect(this.mapData, ProjectModule)(this);
        this.$ngRedux = $ngRedux;
    }

    mapData(state) {
        const userProfile = UserModule.getProfile(state);
        const newProject = this.state.current.name === 'newProject';
        const project = this.project ? this.project : newProject ?
            ProjectModule.getVanillaProject(state) : ProjectModule.getCurrentProjectForEditing(state);

        const team = newProject && this.team ?
          this.team : newProject && !this.team ? [userProfile] : ProjectModule.getTeam(state);
        const viewers = newProject && this.viewers ?
          this.viewers : newProject && !this.viewers ? [] : ProjectModule.getViewers(state);

        const users = SystemModule.getUserProfiles(state);

        const countryFields = ProjectModule.getProjectCountryFields(state)(newProject);
        return {
            project,
            team,
            viewers,
            structure: ProjectModule.getProjectStructure(state),
            users,
            userProfile,
            projectId: ProjectModule.getCurrentProject(state),
            userProjects: ProjectModule.getPublishedProjects(state),
            countryFields
        };
    }

    eventListeners() {
        this.registerEventIfNotPresent('projectScrollTo', this.scrollToFieldSet);
    }

    registerEventIfNotPresent(eventName, handler) {
        if (!this.EE.listeners(eventName, true)) {
            this.EE.on(eventName, handler, this);
        }
    }

    onInit() {
        this.eventListeners();
        this.districtList = [];
        this.isAddAnother = false;
        if (DEV) {
            this.fillTestForm();
        }
        this.watchers();
    }

    watchers() {
        this.scope.$watch(s => s.vm.project.country, this.getCountryFields);
    }

    async getCountryFields(country, oldValue) {
        // this is ugly like this otherwise the coverage reporter fails
        if (!country) {
            return;
        }
        if ((oldValue && country !== oldValue) || this.editMode === undefined) {
            await this.$ngRedux.dispatch(CountryModule.setCurrentCountry(country));
        }
    }

    scrollToFieldSet(hash) {
        const element = window.document.getElementById(hash);
        const toScroll = window.document.getElementsByClassName('main-content')[0];
        if (element) {
            this.EE.emit('activateFieldSet', hash);
            toScroll.scrollTop = element.offsetTop - 60;
        }
    }

    clearCustomErrors() {
        _.forEach(this.form, formItem => {
            if (formItem && formItem.customError && formItem.customError.length > 0) {
                formItem.$setValidity('custom', true);
                formItem.customError = [];
            }
        });
    }

    async save() {
        this.clearCustomErrors();
        if (this.form.$valid) {
            try {
                const data = await this.saveProject(this.project, this.team, this.viewers, this.countryFields);
                if (this.editMode) {
                    this.postUpdateActions(data);
                }
                else {
                    this.postSaveActions(data);
                }
            }
            catch (e) {
                this.handleResponse(e);
            }
        }
        else {
            this.focusInvalidField();
        }

    }


    focusInvalidField() {
        this.showToast('Validation error');
        this.timeout(()=>{
            const firstInvalid = document.getElementById('npf').querySelector('.ng-invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }, 100);
    }

    fillTestForm() {
        const data = {
            'name': Math.random().toString(36).substr(2, 20),
            'organisation': {
                'id': 1,
                'name': 'Pulilab'
            },
            'country': 33,
            'countryName': null,
            'coverage': [
                {
                }
            ],
            'coverageType': 2,
            'platforms': [
                {
                    'name': 'Bamboo',
                    'strategies': [
                        'Point of care and diagnostics'
                    ]
                }
            ],
            'licenses': {
                'standard': []
            },
            'donors': [
                {
                    'value': 'dsfdsfdsf'
                }
            ],
            'application': [],
            'reports': [
                {}
            ],
            'publications': [
                {}
            ],
            'links': [
                {}
            ],
            'contact_name': 'dfadsfdsfsdfas',
            'contact_email': 'dsf@dsaf.coim',
            'implementation_overview': 'dsfdsfdsf',
            'implementation_dates': new Date(),
            'geographic_scope': 'dsfds',
            'interoperability_links': [],
            'interoperability_standards': {
                'standard': []
            },
            'wiki': '',
            'repository': '',
            'mobile_application': '',
            'implementing_partners': [
            ],
            'his_bucket': [
                'Client applications'
            ],
            'hsc_challenges': [
                'Delayed reporting of events',
                'Lack of population denominator'
            ],
            'health_focus_areas': [],
            'government_approved': false,
            'government_investor': 0,
            'national_level_deployment': {
                'health_workers': 2,
                'facilities': 2,
                'clients': 2
            }
        };
        if (window.location.search.indexOf('test') > -1) {
            this.scope.$evalAsync(() => {
                this.project = data;

            });
        }
    }

    showToast(text) {
        const toast = {
            template:
              `<md-toast id="custom-toast">
                <div class="md-toast-content">
                  <span>${text}</span>
                </div>
              </md-toast>`,
            autoWrap: false,
            hideDelay: 3000
        };

        this.toast.show(toast);
    }

    postUpdateActions({ id }) {
        this.showToast('Project Updated');
        // this.EE.emit('projectListUpdated');
        const addAnother = this.isAddAnother;
        this.isAddAnother = false;
        const go = {
            state: addAnother ? 'newProject' : 'dashboard',
            appName: id
        };
        this.navigate(go);
    }

    postSaveActions({ id }) {
        this.showToast('Project Saved');
        const addAnother = this.isAddAnother;
        this.isAddAnother = false;
        const go = {
            state: addAnother ? 'newProject' : 'editProject',
            appName: id
        };
        this.navigate(go);
    }

    navigate(go) {
        this.state.go(go.state, { appName: go.appName }, {
            location: 'replace',
            reload: true
        });
    }

    addErrorArray(errors, key) {
        this.form[key].customError = errors;
        this.form[key].$setValidity('custom', false);
    }

    handleResponse(response) {
        _.forEach(response.data, (item, key) => {
            try {
                if (item && _.isPlainObject(item)) {
                    _.forEach(item, (errors, subKey) => {
                        this.addErrorArray(errors, `${key}.${subKey}`);
                    });
                }
                else if (item && item[0] && _.isPlainObject(item[0])) {
                    _.forEach(item, (obj, index) => {
                        _.forEach(obj, (errors, subKey) => {
                            const fieldName = `${key}_${index}.${subKey}`;
                            this.addErrorArray(errors, fieldName);
                        });

                    });
                }
                else {
                    this.addErrorArray(item, key);
                }
            }
            catch (e) {
                console.error(e);
            }
        });

        this.scope.$evalAsync(()=>{
            this.focusInvalidField();
        });

    }

    static newProjectFactory() {
        require('./Project.scss');
        function newProject($scope, $state, Upload, $mdToast, $timeout, $ngRedux, $location) {
            return new ProjectController($scope, $state, Upload, $mdToast, $timeout, $ngRedux, $location);
        }
        newProject.$inject = ['$scope', '$state', 'Upload', '$mdToast', '$timeout', '$ngRedux', '$location'];
        return newProject;
    }
}

export default ProjectController;
