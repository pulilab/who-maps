import _ from 'lodash';
import Protected from './Protected';

/* global define, Promise, DEV */

let commonServices = false;
const loadingConst = 2;

class CommonServices extends Protected {

    constructor() {
        super('');
        this.projectList = [];
        this.projectStructure = [];
        this.loadingCounter = _.cloneDeep(loadingConst);
        this.promiseResolve = void 0;
        this.promiseReject = void 0;
        this.loadedPromise = new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
            this.promiseReject = reject;
        });

        this.eventRegistrations();
        if (this.user) {
            this.loadData();
        }
        else {
            this.promiseResolve();
        }
    }

    loadData() {
        this.populateProjectList();
        this.populateProjectStructure();
    }

    eventRegistrations() {
        this.EE.on('refreshProjects', this.populateProjectList.bind(this));
        this.EE.on('projectListUpdated', this.loadingProgress.bind(this, "lol"));
        this.EE.on('projectStructureLoaded', this.loadingProgress.bind(this, "omg"));
    }

    loadingProgress(str) {
        console.log(str, this.loadingCounter);
        this.loadingCounter -= 1;
        if (this.loadingCounter === 0) {
            this.loadingCounter = loadingConst;
            this.mergeOperations();
            this.promiseResolve();
        }
    }

    mergeOperations() {
        _.forEach(this.projectList, project => {
            const country = _.find(this.projectStructure.countries, { id: project.country });
            project.countryName = country.name;
        });
    }

    populateProjectList() {
        const promiseArray = [];
        this.get('projects/')
            .then((projects) => {
                this.projectList = projects;
                _.forEach(projects, project => {
                    this.getProjectDetail(project);
                    promiseArray.push(project.detailPromise);
                });

                Promise.all(promiseArray)
                    .then(() => {
                        this.EE.emit('projectListUpdated');
                    }, () => {
                        this.promiseReject();
                    });
            });
    }

    populateProjectStructure() {
        this.get('projects/structure/')
            .then(structure => {
                this.projectStructure = structure;
                this.EE.emit('projectStructureLoaded');
            });
    }

    getProjectDetail(project) {
        project.detailPromise = this.get(`projects/${project.id}/`);
        project.detailPromise.then(data => {
            _.merge(project, data);
        });
    }

    getProjectData(_id) {
        const id = parseInt(_id, 10);
        return _.find(this.projectList, { id });
    }

    static commonServiceFactory(reset) {
        if (!commonServices || reset)  {
            commonServices = new CommonServices();
        }
        if (DEV) {
            console.log(commonServices);
        }
        return commonServices;
    }
}

export default CommonServices.commonServiceFactory();
export { CommonServices as ResetService }