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
        this.postPublishAction = this.postPublishAction.bind(this);
        this.getCountryFields = this.getCountryFields.bind(this);
        this.eventListeners = this.eventListeners.bind(this);
        this.toast = toast;
        this.mapData = this.mapData.bind(this);
        this.createDialogs = this.createDialogs.bind(this);
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
                project = publishMode ? ProjectModule.getCurrentPublished(state) :
                  ProjectModule.getCurrentDraftProjectForEditing(state);
                team = ProjectModule.getTeam(state);
                viewers = ProjectModule.getViewers(state);
                countryFields = ProjectModule.getProjectCountryFields(state)(false, !publishMode);
            }
        }

        if (project === undefined) {
            project = ProjectModule.getEmptyProject();
        }
        const readOnlyMode = publishMode ||
          (team.every(t => t.id !== userProfile.id) && viewers.some(v => v.id === userProfile.id));
        project = readOnlyMode && !publishMode ? ProjectModule.getCurrentDraftInViewMode(state) : project;
        return {
            newProject,
            publishMode,
            readOnlyMode,
            lastVersion,
            project,
            team,
            viewers,
            structure: ProjectModule.getProjectStructure(state),
            users: SystemModule.getUserProfiles(state),
            userProfile,
            userProjects: ProjectModule.getPublishedProjects(state),
            countryFields
        };
    }

    eventListeners() {
        this.EE.on('projectScrollTo', this.scrollToFieldSet, this);
        this.EE.on('projectSaveDraft', this.saveDraft, this);
        this.EE.on('projectDiscardDraft', this.discardDraft, this);
    }

    onInit() {
        this.eventListeners();
        this.districtList = [];
        this.isAddAnother = false;
        this.activateValidation = true;
        this.$ngRedux.dispatch(ProjectModule.clearSimilarNameList());
        this.unsubscribe = this.$ngRedux.connect(this.mapData, ProjectModule)(this);
        this.watchers();
        this.createDialogs();
    }

    createDialogs() {
        this.confirmDraftDiscard = this.$mdDialog.confirm({
            title: 'Attention',
            textContent: 'The current draft will be overwritten by the published version',
            ok: 'Ok',
            cancel: 'Cancel',
            theme: 'alert'
        });
    }

    onDestroy() {
        this.unsubscribe();
        this.EE.removeAllListeners('projectScrollTo', this.scrollToFieldSet);
        this.EE.removeAllListeners('projectSaveDraft', this.saveDraft);
        this.EE.removeAllListeners('projectDiscardDraft', this.saveDraft);
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
                this.postPublishAction(data);
            }
            catch (e) {
                this.handleResponse(e.response);
                const alert = this.$mdDialog.alert({
                    title: 'Attention',
                    textContent: 'You can\'t publish until all the required' +
                    ' fields are filled, you can however save the draft',
                    ok: 'Close',
                    theme: 'alert'
                });
                this.$mdDialog.show(alert);
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

    async discardDraft() {
        try {
            await this.$mdDialog.show(this.confirmDraftDiscard);
            await this.$ngRedux.dispatch(ProjectModule.discardDraft());
            this.showToast('Draft discarded');
        }
        catch (e) {
            console.log(e);
            this.showToast('Discard draft process canceled');
        }
    }

    async focusInvalidField() {
        this.timeout(()=>{
            const firstInvalid = document.getElementById('npf').querySelector('.ng-invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }, 100);
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

    postPublishAction({ id }) {
        this.showToast('Project Published');
        this.state.go('editProject', { appName: id, editMode: 'publish' }, {
            location: 'replace',
            reload: true
        });
    }

    addErrorArray(errors, key) {
        try {
            this.form[key].customError = errors;
            this.form[key].$setValidity('custom', false);
        }
        catch (e) {
            console.warn('failed to set the error for key: ', key);
        }
    }

    handleResponse(response) {
        if (response && response.status === 500) {
            console.error('500 from the API', response);
            return;
        }
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
