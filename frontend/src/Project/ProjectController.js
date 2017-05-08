import _ from 'lodash';
import moment from 'moment';
import NewProjectService from './ProjectService';
import ProjectDefinition from './ProjectDefinition';
import EditProfileService from '../Common/EditProfile/EditProfileService';

/* global DEV, DEBUG, Promise */

class ProjectController extends ProjectDefinition {

    constructor($scope, $state, Upload, CommonService, toast, $timeout) {
        super(CommonService);
        this.ns = new NewProjectService(Upload);
        this.es = new EditProfileService();
        this.ccs = require('../Common/CustomCountryService');
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.timeout = $timeout;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.postSaveActions = this.postSaveActions.bind(this);
        this.getCountryFields = this.getCountryFields.bind(this);
        this.toast = toast;
    }

    eventListeners() {
        this.EE.on('projectScrollTo', this.scrollToFieldSet, this);
        this.EE.on('componentLoaded', this.automaticScroll, this);
        this.EE.on('activateFieldSet', this.changeHash, this);
    }

    onInit() {
        const self = this;
        this.eventListeners();
        this.districtList = [];
        this.dataLoaded = false;
        this.isAddAnother = false;
        this.handleStructureLoad();
        this.users = this.cs.usersProfiles;

        this.team = [];
        this.viewers = [];
        try {
            this.team.push(_.find(this.users, { id: this.userProfile.id }));
        }
        catch (e) {
            console.error('Auth token expired');
        }

        if (this.editMode) {
            this.projectId = this.state.params.appName;
            this.cs.getProjectData(this.projectId)
              .then(this.handleDataLoad.bind(this));
            this.ns.getGroups(this.state.params.appName)
              .then(groups => {
                  this.team = groups.data.team;
                  this.viewers = groups.data.viewers;
              });
        }
        else {
            this.ccs.findCountryId(this.cs.userProfile.country).then(countryId => {
                this.scope.$evalAsync(() => {
                    self.project.country = countryId;
                });
            });
        }

        if (DEV) {
            this.fillTestForm();
        }

        this.watchers();
    }

    watchers() {
        this.scope.$watch(s => s.vm.project.country, this.getCountryFields);
    }

    getCountryFields(country, oldValue) {
        // this is ugly like this otherwise the coverage reporter fails
        if (!country) {
            return;
        }
        if ((oldValue && country !== oldValue) || this.editMode === undefined) {
            this.ccs.getCountryFields(country).then(res => {
                this.scope.$evalAsync(() => {
                    this.countryFields = res;
                    this.showCountryFields = res && res.length > 0;
                });
            });
        }
    }

    onDestroy() {
        this.EE.removeListener('projectScrollTo', this.scrollToFieldSet);
        this.EE.removeListener('componentLoaded', this.automaticScroll);
        this.EE.removeListener('activateFieldSet', this.changeHash);
    }

    automaticScroll(fieldSet) {
        const hash = window.location.hash.replace('#', '');
        if (hash === fieldSet) {
            this.EE.emit('projectScrollTo', hash);
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

    changeHash(hash) {
        const l = window.location;
        const url = `${l.protocol}//${l.host}${l.pathname}#${hash}`;
        history.replaceState({}, '', url);
    }

    isViewer(project) {
        return this.cs.isViewer(project);
    }

    isMember(project) {
        return this.cs.isMember(project);
    }

    handleStructureLoad() {
        this.dataLoaded = true;
        this.structure = this.cs.projectStructure;
        this.scope.$evalAsync();
    }
    convertCountryFieldsAnswer({ fields }) {
        return fields.map(f => {
            switch (f.type) {
            case 2:
                f.answer = parseInt(f.answer, 10);
                break;
            case 3:
                f.answer = f.answer === 'true';
                break;
            }
            return f;
        });
    }

    handleDataLoad(data) {
        data = _.cloneDeep(data);
        this.convertArrayToStandardCustomObj(data);
        this.userProjects = this.cs.projectList;
        data.start_date = this.convertDate(data.start_date);
        data.implementation_dates = this.convertDate(data.implementation_dates);
        data.end_date = this.convertDate(data.end_date);
        data = this.convertStringArrayToObjectArray(data);
        data = this.fillEmptyCollectionsWithDefault(data);
        if (!data.fields || data.fields.length === 0) {
            this.getCountryFields(data.country, -1);
        }
        this.scope.$evalAsync(() => {
            this.project = data;
            if (data.fields && data.fields.length > 0) {
                this.countryFields = this.convertCountryFieldsAnswer(data);
                window.TE = this.countryFields;
                this.showCountryFields = true;
            }
        });

    }

    fillEmptyCollectionsWithDefault(data) {
        data.coverage = _.isEmpty(data.coverage) ? [{}] : data.coverage;
        data.platforms = _.isEmpty(data.platforms) ? [{}] : data.platforms;
        return Object.assign({}, data);
    }

    convertDate(date) {
        const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
        if (date) {
            return moment(date, dateFormat).toDate();
        }
        return undefined;
    }

    convertStringArrayToObjectArray(data) {
        const keyArray = ['donors', 'implementing_partners'];
        keyArray.forEach(key => {
            if (!data[key]) {
                return;
            }
            data[key] = data[key].map(value => {
                return { value };
            });
            if (data[key].length === 0) {
                data[key].push({});
            }
        });
        return Object.assign({}, data);
    }

    convertObjectArrayToStringArray(data) {
        const keyArray = ['donors', 'implementing_partners'];
        keyArray.forEach(key => {
            if (!data[key]) {
                return;
            }
            data[key] = data[key].map(value => value.value);
            data[key] = data[key].filter(item => item);
        });
        return Object.assign({}, data);
    }

    convertArrayToStandardCustomObj(data) {
        const keyArray = ['interoperability_standards', 'health_focus_areas', 'licenses'];

        keyArray.forEach(key=> {
            const scaffold = {
                standard: [],
                custom: void 0
            };
            this.structure[key] = _.union(this.structure[key], data[key]);
            scaffold.standard = data[key];
            data[key] = scaffold;
        });
    }

    createDateFields(processedForm) {
        processedForm.start_date = moment(this.project.start_date).toJSON();
        processedForm.end_date = moment(this.project.end_date).toJSON();
        processedForm.implementation_dates = moment(this.project.implementation_dates).toJSON();
        return Object.assign({}, processedForm);
    }

    deleteUndefinedAndDoubleDollarKeys(item) {
        const output = {};
        Object.keys(item).forEach(key => {
            if (item[key] !== undefined && key !== '$$hashKey') {
                output[key] = item[key];
            }
        });
        return output;
    }

    removeEmptyChildObjects(processedForm) {
        const keyArray = ['coverage', 'platforms'];
        keyArray.forEach(key => {
            processedForm[key] = processedForm[key].filter(itm => {
                itm = this.deleteUndefinedAndDoubleDollarKeys(itm);
                if (itm.hasOwnProperty('available')) {
                    delete itm.available;
                }
                return Object.keys(itm).length > 0;
            });
        });

        return Object.assign({}, processedForm);
    }

    removeKeysWithoutValues(processedForm) {
        return _.reduce(processedForm, (result, value, key) => {
            if (value === null || value === '' || _.isPlainObject(value) && _.every(_.values(value), _.isNull)) {
                result[key] = void 0;
            }
            else {
                result[key] = value;
            }
            return result;
        }, {});
    }

    clearCustomErrors() {
        _.forEach(this.form, formItem => {
            if (formItem && formItem.customError && formItem.customError.length > 0) {
                formItem.$setValidity('custom', true);
                formItem.customError = [];
            }
        });
    }


    save() {
        this.clearCustomErrors();
        if (this.form.$valid) {
            let processedForm = Object.assign({}, this.project);
            processedForm.organisation = processedForm.organisation.id;
            processedForm = this.createDateFields(processedForm);
            processedForm = this.mergeCustomAndDefault(processedForm);
            processedForm = this.convertObjectArrayToStringArray(processedForm);
            processedForm = this.removeEmptyChildObjects(processedForm);
            processedForm = this.removeKeysWithoutValues(processedForm);
            if (!this.editMode) {
                this.saveForm(processedForm);
            }
            else {
                this.updateForm(processedForm);
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

    putGroups() {
        return this.ns.putGroups(this.projectId, this.team, this.viewers);
    }

    async saveCountryFields({ country, id }) {
        const toSave = this.countryFields.map(f => {
            f = Object.assign({}, f);
            f.answer = f.type === 3 ? JSON.stringify(f.answer) : f.answer;
            f.project = id;
            return f;
        });
        this.ns.saveCountryFields(toSave, country, id);
    }

    async updateForm(processedForm) {
        const response = await this.ns.updateProject(processedForm, this.projectId);
        if (response && response.success) {
            // generate a single promise from multiple promise and wait for them to be done.
            await Promise.all([this.putGroups(), this.saveCountryFields(response.data)]);
            // update cached project data with the one from the backend
            this.cs.updateProject(response.data, this.projectId);
            this.showToast('Project Updated!');
            this.postUpdateActions();
        }
        else {
            this.handleResponse(response);
        }

    }

    async saveForm(processedForm) {
        const response = await this.ns.newProject(processedForm);
        if (response && response.success) {
            await Promise.all([this.putGroups(), this.saveCountryFields(response.data)]);

            this.ownershipCheck(response.data);
            this.cs.addProjectToCache(response.data);
            this.postSaveActions();
            this.showToast('Project Saved!');

        }
        else {
            this.handleResponse(response);
        }

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
            'health_focus_areas': {
                'standard': []
            },
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
            'data_exchanges': [],
            'his_bucket': [
                'a'
            ],
            'hsc_challenges': [
                'b'
            ],
            'interventions': [],
            'government_investor': false,
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
        this.toast.show(
          this.toast.simple()
            .textContent(text)
            .position('bottom right')
            .hideDelay(3000)
        );
    }

    ownershipCheck(project) {
        const id = this.userProfile.id;
        const rights = _.concat(this.team, this.viewers);
        if (rights.length > 0 && _.find(rights, { id })) {
            this.projectId = project.id;
        }
        else {
            const last  = _.last(this.cs.projectList);
            this.projectId = last && last.id ? last.id : null;
        }
    }

    postUpdateActions() {
        this.EE.emit('projectListUpdated');
        const addAnother = this.isAddAnother;
        this.isAddAnother = false;
        if (addAnother) {
            const go = {
                state: 'newProject',
                appName: this.projectId
            };
            this.navigate(go);
        }
    }

    postSaveActions() {
        const addAnother = this.isAddAnother;
        this.isAddAnother = false;
        const go = {
            state: addAnother ? 'newProject' : 'editProject',
            appName: this.projectId
        };
        this.navigate(go);
    }

    navigate(go) {
        this.state.go(go.state, { appName: go.appName }, {
            location: 'replace',
            reload: true
        });
    }

    handleResponse(response) {
        const self = this;
        _.forEach(response.data, (item, key) => {
            if (this.form[key]) {
                this.form[key].customError = item;
                this.form[key].$setValidity('custom', false);
            }
            else {
                console.error('missing name in the form: ', key);
            }
        });
        this.scope.$evalAsync(()=>{
            self.focusInvalidField();
        });

    }

    concatCustom(obj) {
        const cat = _.concat(obj.custom, obj.standard);
        return _.filter(cat, item => {
            return !_.isNil(item) && !_.isEmpty(item);
        });
    }

    mergeCustomAndDefault(collection) {
        const self = this;
        const keyArray = ['interoperability_standards', 'licenses', 'health_focus_areas'];
        keyArray.forEach(key => {
            collection[key] = self.concatCustom(collection[key]);
        });
        return Object.assign({}, collection);
    }

    static newProjectFactory() {
        require('./Project.scss');
        const CommonService =  require('../Common/CommonServices');
        function newProject($scope, $state, Upload, $mdToast, $timeout) {
            return new ProjectController($scope, $state, Upload, CommonService, $mdToast, $timeout);
        }
        newProject.$inject = ['$scope', '$state', 'Upload', '$mdToast', '$timeout'];
        return newProject;
    }
}

export default ProjectController;
