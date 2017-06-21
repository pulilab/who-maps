import _ from 'lodash';
import Protected from './Protected';

/* global define, Promise, DEV, Symbol, DEBUG */

const singleton = Symbol();
const singletonEnforcer = Symbol();


class CommonServices extends Protected {

    constructor(enforcer) {
        super('');
        if (enforcer !== singletonEnforcer) {
            const error = { error: 'Cannot construct singleton' };
            throw error;
        }
        this.initialize();
    }

    initialize() {
        this.user = this.retrieveLoginStatus();
        this.userProfileId = this.retrieveProfileId();
        this.projectList = [];
        this.publicProject = [];
        this.hash = Math.random().toString(36);
        this.projectStructure = [];
        this.retrieveUserProfile = this.retrieveUserProfile.bind(this);
        this.loadingCheck = [];
        this.userProfile = null;
        this.usersProfiles = null;
        this.hssStructure = null;
        this.promiseResolve = void 0;
        this.promiseReject = void 0;
        this.loadedPromise = new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
            this.promiseReject = reject;
        });
        if (this.user) {
            this.loadData();
        }
        else {
            this.checkLoadPresence('structure');
            this.populateProjectStructure();
        }
    }


    reset() {
        this.initialize();
        return this;
    }


    loadData() {
        if (this.userProfileId) {
            this.createLoadingOrder();
            this.retrieveUserProfile();
            this.populateProjectList();
            this.getUsersProfiles();
        }
        this.checkLoadPresence('structure');
        this.populateProjectStructure();
    }

    checkLoadPresence(name) {
        if (this.loadingCheck.indexOf(name) === -1) {
            this.loadingCheck.push(name);
        }
    }

    createLoadingOrder() {
        this.checkLoadPresence('user-profile');
        this.checkLoadPresence('list');
        this.checkLoadPresence('users-profiles');
    }

    loadingProgress(name) {
        _.remove(this.loadingCheck, item => {
            return item === name;
        });
        if (this.loadingCheck.length === 0) {
            this.mergeOperations();
            this.promiseResolve();
        }
    }

    findCountryName(project) {
        const country = _.find(this.projectStructure.countries, { id: project.country });
        if (country) {
            project.countryName = country.name;
        }
    }

    mergeOperations() {
        _.forEach(this.projectList, project => {
            this.findCountryName(project);
            project.organisation = {
                id: project.organisation,
                name: project.organisation_name
            };
        });
        this.projectList = _.sortBy(this.projectList, ['id']);
    }

    retrieveUserProfile() {
        const vm = this;
        vm.get(`userprofiles/${vm.userProfileId}/`).then(_userprofile => {
            vm.userProfile = _userprofile;
            if (vm.userProfile) {
                vm.userProfile.email = vm.storage.get('user').username;
                vm.userProfile.organisation = {
                    id: _userprofile.organisation,
                    name: _userprofile.organisation_name
                };
            }
            this.loadingProgress('user-profile');
        });
    }

    async retrieveMemberAndViewer() {
        const userProfile = await this.get(`userprofiles/${this.userProfileId}/`);
        this.userProfile.member = userProfile.member;
        this.userProfile.viewer = userProfile.viewer;
        return {
            member: userProfile.member,
            viewer: userProfile.viewer
        };
    }

    getUsersProfiles() {
        const vm = this;
        vm.get('userprofiles/').then(data => {
            vm.usersProfiles = _.filter(data, item => {
                return item.name !== null && item.name !== '';
            });
            vm.loadingProgress('users-profiles');
        });
    }

    populateProjectList() {
        const promiseArray = [];
        this.get('projects/member-of/')
          .then((projects) => {
              this.projectList = projects;
              _.forEach(projects, project => {
                  if (project) {
                      this.getProjectDetail(project);
                      promiseArray.push(project.detailPromise);
                  }
              });

              Promise.all(promiseArray)
                .then(() => {
                    this.loadingProgress('list');
                }, () => {
                    this.promiseReject();
                });
          }, () => {
              // if the user has no user profile the loading should still go on!
              console.warn('the user has no user profile');
              this.loadingProgress('list');
          });
    }

    populateProjectStructure() {
        this.get('projects/structure/')
          .then(structure => {
              this.projectStructure = structure;
              this.loadingProgress('structure');
          })
          .catch(() => {
              this.loadingProgress('structure');
              this.promiseReject();
          });
    }

    getProjectDetail(project) {
        project.detailPromise = this.get(`projects/${project.id}/`);
        project.detailPromise.then(data => {
            _.merge(project, data);
        });
    }


    fetchSingleProjectData(resolve, _id) {
        const vm = this;
        if (vm.publicProject[_id]) {
            resolve(vm.publicProject[_id]);
        }
        else {
            const project = {
                id: _id
            };
            vm.getProjectDetail(project);
            Promise.all([project.detailPromise])
              .then(() => {
                  vm.findCountryName(project);
                  vm.publicProject[_id] = project;
                  resolve(project);
              });
        }
    }

    getProjectData(_id) {
        const vm = this;
        return new Promise((resolve) => {
            const id = parseInt(_id, 10);
            const last = _.find(this.projectList, { id });
            if (last && last.country) {
                resolve(last);
            }
            else {
                vm.fetchSingleProjectData(resolve, _id);
            }

        });
    }

    updateProject(project, unsavedProject) {
        const id = parseInt(unsavedProject.id, 10);
        project.organisation = {
            id: unsavedProject.organisation,
            name: unsavedProject.organisation_name
        };
        const last = _.find(this.projectList, { id });
        Object.assign(last, project);
    }

    addProjectToCache(newProject, unsavedProject) {
        newProject = Object.assign({}, newProject);
        newProject.organisation = {
            id: unsavedProject.organisation,
            name: unsavedProject.organisation_name
        };
        this.projectList.push(newProject);
    }

    isViewer(project) {
        return this.userProfile && this.userProfile.viewer.indexOf(project.id) > -1 && ! this.isMember(project);
    }

    isMember(project) {
        return this.userProfile && this.userProfile.member.indexOf(project.id) > -1;
    }

    addMember(project) {
        if (!this.isMember(project)) {
            this.userProfile.member.push(project.id);
        }
    }

    hasProfile() {
        return this.userProfile && this.userProfile.name !== '' && !_.isNull(this.userProfile.name);
    }

    calculateHeight() {
        const contentHeight = window.innerHeight - 48;
        return contentHeight + 'px';
    }

    purge() {
        this[singleton] = undefined;
    }

    static commonServiceFactory() {
        if (!this[singleton]) {
            this[singleton] = new CommonServices(singletonEnforcer);
            const event = new CustomEvent('singletonRegistered', { detail: this[singleton].purge.bind(this) });
            window.dispatchEvent(event);
        }
        return this[singleton];
    }
}

export default CommonServices.commonServiceFactory();
