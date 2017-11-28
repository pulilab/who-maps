import forEach from 'lodash/forEach';
import isPlainObject from 'lodash/isPlainObject';
import * as ProjectModule from '../store/modules/projects';
import * as SystemModule from '../store/modules/system';
import * as UserModule from '../store/modules/user';
import * as CountryModule from '../store/modules/countries';

/* global DEV, DEBUG, Promise */

class ProjectController  {

    constructor($scope, $state, toast, $timeout, $mdDialog, $ngRedux) {
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.$ngRedux = $ngRedux;
        this.$mdDialog = $mdDialog;
        this.timeout = $timeout;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.postSaveActions = this.postSaveActions.bind(this);
        this.getCountryFields = this.getCountryFields.bind(this);
        this.registerEventIfNotPresent = this.registerEventIfNotPresent.bind(this);
        this.toast = toast;
        this.mapData = this.mapData.bind(this);
    }

    mapData(state) {
        const userProfile = UserModule.getProfile(state);
        const newProject = this.state.current.name === 'newProject';
        const publishMode = this.state.params.editMode === 'publish';
        const lastVersion = ProjectModule.getLastVersion(state);

        let project = null;
        let team = null;
        let viewers = null;
        let countryFields = null;

        if (this.lastVersion === lastVersion) {
            project = this.project;
            team = this.team;
            viewers = this.viewers;
            countryFields = this.countryFields;
        }
        else {
            if (newProject) {
                project = ProjectModule.getVanillaProject(state);
                team = [userProfile];
                viewers = [];
                countryFields = ProjectModule.getProjectCountryFields(state)(true, !publishMode);
            }
            else {
                project = publishMode ? ProjectModule.getCurrentPublishedProjectForEditing(state) :
                  ProjectModule.getCurrentDraftProjectForEditing(state);
                team = ProjectModule.getTeam(state);
                viewers = ProjectModule.getViewers(state);
                countryFields = ProjectModule.getProjectCountryFields(state)(false, !publishMode);
                console.log(countryFields, lastVersion);
            }
        }

        if (project === undefined) {
            project = ProjectModule.getEmptyProject();
        }

        return {
            newProject,
            publishMode,
            lastVersion,
            project,
            team,
            viewers,
            structure: ProjectModule.getProjectStructure(state),
            users: SystemModule.getUserProfiles(state),
            userProfile,
            projectId: ProjectModule.getCurrentProject(state),
            userProjects: ProjectModule.getPublishedProjects(state),
            countryFields
        };
    }

    eventListeners() {
        this.registerEventIfNotPresent('projectScrollTo', this.scrollToFieldSet);
        this.registerEventIfNotPresent('projectSaveDraft', this.saveDraft);
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
        this.activateValidation = true;
        this.$ngRedux.dispatch(ProjectModule.clearSimilarNameList());
        this.unsubscribe = this.$ngRedux.connect(this.mapData, ProjectModule)(this);
        this.watchers();
    }

    onDestroy() {
        this.unsubscribe();
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
            await this.$ngRedux.dispatch(CountryModule.setCurrentCountry(country, ['districts', 'countryFields']));
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
        forEach(this.form, formItem => {
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
                const data = await this.publish(this.project, this.team, this.viewers, this.countryFields);
                this.postSaveActions(data);
            }
            catch (e) {
                this.handleResponse(e.response);
            }
        }
        else {
            this.focusInvalidField();
        }

    }

    async saveDraft() {
        try {
            const project = await this.$ngRedux.dispatch(ProjectModule.saveDraft(this.project,
              this.team, this.viewers, this.countryFields));
            this.showToast('Draft updated');
            if (this.newProject) {
                this.state.go('editProject', { appName:  project.id }, {
                    location: 'replace',
                    reload: false
                });
            }

        }
        catch (e) {
            console.log(e);
            this.handleResponse(e.response);
        }
    }


    async focusInvalidField() {
        const alert = this.$mdDialog.alert({
            title: 'Attention',
            textContent: 'You can\'t publish until all the required fields are filled, you can however save the draft',
            ok: 'Close',
            theme: 'alert'
        });

        this.$mdDialog.show(alert);
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

    postSaveActions({ id }) {
        let toastLabel = 'Project Saved';
        let navigateTo = 'editProject';
        if (this.editMode) {
            toastLabel = 'Project Updated';
            navigateTo = 'dashboard';
        }
        this.showToast(toastLabel);
        const addAnother = this.isAddAnother;
        this.isAddAnother = false;
        const go = {
            state: addAnother ? 'newProject' : navigateTo,
            appName: id
        };
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
        console.log(response);
        forEach(response.data, (item, key) => {
            try {
                if (item && isPlainObject(item)) {
                    forEach(item, (errors, subKey) => {
                        this.addErrorArray(errors, `${key}.${subKey}`);
                    });
                }
                else if (item && item[0] && isPlainObject(item[0])) {
                    forEach(item, (obj, index) => {
                        forEach(obj, (errors, subKey) => {
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
        function newProject($scope, $state, $mdToast, $timeout, $mdDialog, $ngRedux) {
            return new ProjectController($scope, $state, $mdToast, $timeout, $mdDialog, $ngRedux);
        }
        newProject.$inject = ['$scope', '$state', '$mdToast', '$timeout', '$mdDialog', '$ngRedux'];
        return newProject;
    }
}

export default ProjectController;
