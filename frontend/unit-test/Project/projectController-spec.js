import ProjectController from '../../src/Project/ProjectController';
import { $state, $scope, toast, $ngRedux, dialog } from '../testUtilities';
import * as ProjectModule from '../../src/store/modules/projects';
import * as UserModule from '../../src/store/modules/user';
import * as SystemModule from '../../src/store/modules/system';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let sc = {
    project: {}
};

const scope = $scope(sc);
const mockData = {
    countries: [{
        id: 1,
        name: 'asd'
    }]
};

const getGroupMock = {
    then: (toCall) => {
        toCall({
            data: {
                team: ['a'],
                viewers: ['b']
            }
        });
    }
};


const upload = {};

const timeout = toCall => {
    toCall();
};


fdescribe('ProjectController', () => {

    beforeEach(() => {
        sc = new ProjectController(scope, $state, toast, timeout, dialog, $ngRedux);
        sc.newProjectForm = {
            $valid: true,
            $setValidity: jasmine.createSpy('$setValidity')
        };
        sc.$onInit();
    });

    fit('mapData fn', () => {
        const profileSpy = spyOn(UserModule, 'getProfile').and.returnValue({ id: 1 });
        spyOn(ProjectModule, 'getLastVersion').and.returnValue(1);
        spyOn(ProjectModule, 'getVanillaProject').and.returnValue('vanilla');
        spyOn(ProjectModule, 'getCurrentPublished').and.returnValue('cps');
        const currentDraftForEditing =
          spyOn(ProjectModule, 'getCurrentDraftProjectForEditing').and.returnValue('gcdpfe');
        spyOn(ProjectModule, 'getTeam').and.returnValue(['gt']);
        spyOn(ProjectModule, 'getViewers').and.returnValue(['gv']);
        spyOn(ProjectModule, 'getProjectCountryFields').and.returnValue(() => 'gpcf');
        spyOn(ProjectModule, 'getEmptyProject').and.returnValue('gep');
        spyOn(ProjectModule, 'getCurrentDraftInViewMode').and.returnValue('gcdivm');
        spyOn(ProjectModule, 'getProjectStructure').and.returnValue('gps');
        spyOn(ProjectModule, 'getPublishedProjects').and.returnValue('gpps');
        spyOn(SystemModule, 'getUserProfiles').and.returnValue('gups');

        sc.lastVersion = 1;
        sc.project = 1;
        sc.team = [{ id: 1 }];
        sc.viewers = [{ id: 1 }];
        sc.countryFields = 1;
        sc.state.current.name = 'newProject';
        sc.state.params.editMode = 'draft';

        let result = sc.mapData({});

        expect(UserModule.getProfile).toHaveBeenCalledTimes(1);
        expect(SystemModule.getUserProfiles).toHaveBeenCalledTimes(1);
        expect(ProjectModule.getLastVersion).toHaveBeenCalledTimes(1);
        expect(ProjectModule.getProjectStructure).toHaveBeenCalledTimes(1);
        expect(ProjectModule.getPublishedProjects).toHaveBeenCalledTimes(1);

        expect(result.newProject).toBe(true);
        expect(result.publishMode).toBe(false);
        expect(result.readOnlyMode).toBe(false);
        expect(result.lastVersion).toBe(1);
        expect(result.project).toBe(1);
        expect(result.team[0].id).toBe(1);
        expect(result.viewers[0].id).toBe(1);
        expect(result.structure).toBe('gps');
        expect(result.users).toBe('gups');
        expect(result.userProfile.id).toBe(1);
        expect(result.userProjects).toBe('gpps');
        expect(result.countryFields).toBe(1);

        profileSpy.and.returnValue({ id : 2 });
        sc.viewers = [{ id: 2 }];
        sc.state.params.editMode = 'draft';
        result = sc.mapData({});

        expect(UserModule.getProfile).toHaveBeenCalledTimes(2);
        expect(SystemModule.getUserProfiles).toHaveBeenCalledTimes(2);
        expect(ProjectModule.getLastVersion).toHaveBeenCalledTimes(2);
        expect(ProjectModule.getProjectStructure).toHaveBeenCalledTimes(2);
        expect(ProjectModule.getPublishedProjects).toHaveBeenCalledTimes(2);
        expect(ProjectModule.getCurrentDraftInViewMode).toHaveBeenCalledTimes(1);

        expect(result.project).toBe('gcdivm');

        sc.lastVersion = 2;
        result = sc.mapData({});

        expect(UserModule.getProfile).toHaveBeenCalledTimes(3);
        expect(ProjectModule.getLastVersion).toHaveBeenCalledTimes(3);
        expect(ProjectModule.getVanillaProject).toHaveBeenCalledTimes(1);
        expect(ProjectModule.getProjectCountryFields).toHaveBeenCalledTimes(1);

        expect(result.project).toBe('vanilla');
        expect(result.team[0].id).toBe(2);
        expect(result.viewers.length).toBe(0);
        expect(result.countryFields).toBe('gpcf');


        sc.state.current.name = 'editMode';
        sc.state.params.editMode = 'publish';

        result = sc.mapData({});

        expect(UserModule.getProfile).toHaveBeenCalledTimes(4);
        expect(ProjectModule.getLastVersion).toHaveBeenCalledTimes(4);
        expect(ProjectModule.getTeam).toHaveBeenCalledTimes(1);
        expect(ProjectModule.getViewers).toHaveBeenCalledTimes(1);
        expect(ProjectModule.getCurrentPublished).toHaveBeenCalledTimes(1);

        expect(result.project).toBe('cps');
        expect(result.team[0]).toBe('gt');
        expect(result.viewers[0]).toBe('gv');
        expect(result.countryFields).toBe('gpcf');


        sc.state.params.editMode = 'draft';

        result = sc.mapData({});

        expect(UserModule.getProfile).toHaveBeenCalledTimes(5);
        expect(ProjectModule.getLastVersion).toHaveBeenCalledTimes(5);
        expect(ProjectModule.getTeam).toHaveBeenCalledTimes(2);
        expect(ProjectModule.getViewers).toHaveBeenCalledTimes(2);
        expect(ProjectModule.getCurrentPublished).toHaveBeenCalledTimes(1);
        expect(ProjectModule.getCurrentDraftProjectForEditing).toHaveBeenCalledTimes(1);

        expect(result.project).toBe('gcdpfe');
        expect(result.team[0]).toBe('gt');
        expect(result.viewers[0]).toBe('gv');
        expect(result.countryFields).toBe('gpcf');

        currentDraftForEditing.and.returnValue(undefined);
        result = sc.mapData({});
        expect(ProjectModule.getEmptyProject).toHaveBeenCalledTimes(1);

        expect(result.project).toBe('gep');


    });

    it('save fn.', () => {
        const e = document.createElement('div');
        e.setAttribute('id', 'npf');
        document.body.appendChild(e);
        spyOn(sc, 'clearCustomErrors');
        spyOn(sc, 'createDateFields').and.returnValue({});
        spyOn(sc, 'mergeCustomAndDefault').and.returnValue({});
        spyOn(sc, 'convertObjectArrayToStringArray').and.returnValue({});
        spyOn(sc, 'removeEmptyChildObjects').and.returnValue({});
        spyOn(sc, 'removeKeysWithoutValues').and.returnValue({});
        spyOn(sc, 'showToast');
        spyOn(sc, 'saveForm');
        spyOn(sc, 'updateForm');
        spyOn(sc, 'putGroups');
        spyOn(sc.ns, 'newProject').and.returnValue(Promise.resolve());
        sc.form = {
            $valid: true
        };
        sc.project = {
            organisation: {
                id: 1
            },
            interoperability_links: {}
        };
        sc.save();
        sc.form.$valid = false;
        sc.save();
        expect(sc.clearCustomErrors).toHaveBeenCalled();
        expect(sc.createDateFields).toHaveBeenCalledTimes(1);
        expect(sc.mergeCustomAndDefault).toHaveBeenCalledTimes(1);
        expect(sc.convertObjectArrayToStringArray).toHaveBeenCalled();
        expect(sc.removeEmptyChildObjects).toHaveBeenCalled();
        expect(sc.removeKeysWithoutValues).toHaveBeenCalled();
        expect(sc.saveForm).toHaveBeenCalled();
        sc.form.$valid = true;
        sc.editMode = true;
        sc.save();
        expect(sc.updateForm).toHaveBeenCalled();
    });

    describe('save new form function', () => {
        it('should try to save and call handleResponse if the saving fails', async (done) => {
            spyOn(sc, 'handleResponse');
            spyOn(sc.ns, 'newProject').and.returnValue(Promise.resolve({ success: false }));
            await sc.saveForm(sc.project);
            expect(sc.ns.newProject).toHaveBeenCalled();
            expect(sc.handleResponse).toHaveBeenCalled();
            done();

        });

        it('should call the appropriate function after saving succeed', async (done) => {
            spyOn(sc, 'showToast');
            spyOn(sc, 'ownershipCheck');
            spyOn(sc, 'postPublishAction');
            spyOn(sc, 'putGroups').and.returnValue(Promise.resolve({}));
            spyOn(sc, 'saveCountryFields').and.returnValue(Promise.resolve({}));


            spyOn(sc.ns, 'newProject').and.returnValue(Promise.resolve({ success: true, data: {} }));
            await sc.saveForm(sc.project);
            expect(sc.ownershipCheck).toHaveBeenCalled();
            expect(sc.cs.addProjectToCache).toHaveBeenCalled();
            expect(sc.putGroups).toHaveBeenCalled();
            expect(sc.postPublishAction).toHaveBeenCalled();
            expect(sc.showToast).toHaveBeenCalled();
            done();
        });
    });


    it('should have a function that update an existing form', async (done) => {
        spyOn(sc, 'showToast');
        spyOn(sc, 'handleResponse');
        spyOn(sc, 'postUpdateActions');
        spyOn(sc, 'putGroups').and.returnValue(Promise.resolve());
        spyOn(sc, 'saveCountryFields').and.returnValue(Promise.resolve({}));
        const spy = spyOn(sc.ns, 'updateProject');
        spy.and.returnValue(Promise.resolve({ success: false }));
        sc.editMode = true;
        await sc.updateForm(sc.project);
        expect(sc.ns.updateProject).toHaveBeenCalled();
        expect(sc.handleResponse).toHaveBeenCalled();
        spy.and.returnValue(Promise.resolve({ success: true }));
        await sc.updateForm(sc.project);
        expect(sc.cs.updateProject).toHaveBeenCalled();
        expect(sc.showToast).toHaveBeenCalled();
        expect(sc.postUpdateActions).toHaveBeenCalled();
        done();
    });

    it('should have some utility function', () => {
        expect(sc.concatCustom).toBeDefined();
    });


    it('should have a function that add an event handler if is not already present', () => {
        let a = 0;
        sc.registerEventIfNotPresent('a', () => { a += 1; });
        expect(sc.EE.listeners('a', true)).toBe(true);
        sc.registerEventIfNotPresent('a', () => { a += 1; });
        sc.EE.emit('a');
        expect(a).toBe(1);
    });

    it('should have a function that emit a scroll event', () => {
        spyOn(sc.EE, 'emit');
        window.location.hash = '#a';
        sc.automaticScroll('a');
        sc.automaticScroll('b');
        expect(sc.EE.emit).toHaveBeenCalledTimes(1);
    });

    it('should have a function that scroll the view ', () => {
        spyOn(sc.EE, 'emit');
        const a = document.createElement('div');
        const mainElement = document.createElement('div');
        mainElement.setAttribute('class', 'main-content');
        mainElement.height = 50000;
        a.setAttribute('id', 'a');
        window.document.body.appendChild(a);
        window.document.body.appendChild(mainElement);
        sc.scrollToFieldSet('a');
        expect(sc.EE.emit).toHaveBeenCalled();
    });

    it('should have a function to change the hash of the page url', ()=> {
        const hash = 'a';
        sc.changeHash(hash);
        expect(window.location.hash).toBe('#' + hash);
    });

    it('should have functions that returns if the user is member or viewer of the project', ()=> {
        sc.isViewer({});
        expect(sc.cs.isViewer).toHaveBeenCalled();
        sc.isMember();
        expect(sc.cs.isMember).toHaveBeenCalled();
    });

    it('should have a function that handle the structure loaded from the server', () => {
        sc.handleStructureLoad(mockData);
        expect(sc.dataLoaded).toBe(true);
        expect(sc.structure).toBe(mockData);
        expect(sc.scope.$evalAsync).toHaveBeenCalled();
    });

    it('should have a function that handle the data loaded from the server', () => {
        const result = {
            fields: []
        };
        spyOn(sc.ccs, 'getCountryDistricts').and.returnValue(Promise.resolve({}));
        spyOn(sc, 'convertArrayToStandardCustomObj').and.returnValue(result);
        spyOn(sc, 'convertStringArrayToObjectArray').and.returnValue(result);
        spyOn(sc, 'fillEmptyCollectionsWithDefault').and.returnValue(result);
        spyOn(sc, 'convertCountryFieldsAnswer');
        spyOn(sc, 'getCountryFields');

        sc.handleStructureLoad(mockData);
        sc.handleDataLoad(result);
        expect(sc.convertArrayToStandardCustomObj).toHaveBeenCalled();
        expect(sc.convertStringArrayToObjectArray).toHaveBeenCalled();
        expect(sc.fillEmptyCollectionsWithDefault).toHaveBeenCalled();


        result.fields.push({});
        sc.handleDataLoad(result);
        expect(sc.convertCountryFieldsAnswer).toHaveBeenCalled();
        expect(sc.getCountryFields).toHaveBeenCalledTimes(1);

    });

    it('should have a function to convertIncomingCountry fields', () => {
        const data = {
            fields: [
                { type: 1, answer: 'a' },
                { type: 2, answer: '3' },
                { type: 3, answer: 'true' }
            ]
        };
        const result = sc.convertCountryFieldsAnswer(data);
        expect(result[0].answer).toBe('a');
        expect(result[1].answer).toBe(3);
        expect(result[2].answer).toBe(true);
    });

    it('should have a function that convert a string to a date', () => {
        const date =  new Date();
        const result = sc.convertDate(date.toJSON());
        expect(result.getTime()).toBe(date.getTime());
    });

    it('should have a function that convert an array in a custom-standard object', ()=> {
        const input = {
            licenses: [1, 2, 3]
        };
        sc.structure = {
            licenses: ['a']
        };
        sc.convertArrayToStandardCustomObj(input);
        expect(input.licenses.standard[0]).toBe(1);
        expect(sc.structure.licenses).toContain(1);

    });

    it('fetches all users, team members and viewers if in edit mode', () => {
        sc.editMode = true;
        spyOn(sc, 'handleStructureLoad');
        spyOn(sc, 'handleDataLoad');
        spyOn(sc.ns, 'getGroups').and.callFake(() => { return { then: () => {} }; });
        sc.onInit();
        expect(sc.ns.getGroups).toHaveBeenCalled();
    });


    it('has a function, that saves team members and users to the API', () => {
        const spy = spyOn(sc.ns, 'putGroups');
        sc.putGroups();
        expect(sc.ns.putGroups).toHaveBeenCalled();
        spy.calls.reset();
        sc.putGroups({ id: 1 });
        expect(sc.ns.putGroups).toHaveBeenCalledWith(1, [undefined], []);
    });

    it('should have a postSave function that handles the route change', () => {
        spyOn(sc, 'navigate');
        sc.isAddAnother = true;
        sc.projectId = 1;
        const expectation = {
            state: 'newProject',
            appName : 1
        };
        sc.postPublishAction({ member: [1] });
        expect(sc.navigate).toHaveBeenCalledWith(expectation);
        sc.isAddAnother = false;
        expectation.state = 'editProject';
        sc.postPublishAction({ member: [1] });
        expect(sc.navigate).toHaveBeenCalledWith(expectation);
    });

    it('should have a postUpdate function that handles the route change and the refresh', () => {
        spyOn(sc, 'navigate');
        spyOn(sc.EE, 'emit');
        sc.isAddAnother = true;
        sc.projectId = 1;
        const expectation = {
            state: 'newProject',
            appName : 1
        };
        sc.postUpdateActions({ member: [1] });
        expect(sc.navigate).toHaveBeenCalledWith(expectation);
        sc.isAddAnother = false;
        sc.postUpdateActions({ member: [1] });
        expect(sc.navigate).toHaveBeenCalledTimes(1);
        expect(sc.EE.emit).toHaveBeenCalledTimes(2);
    });

    it('should have a function that open a simple toast', () => {
        sc.showToast('a');
        expect(sc.toast.show).toHaveBeenCalled();
        expect(sc.toast.simple).toHaveBeenCalled();
    });

    it('should have a function that issue a state change', () => {
        sc.navigate({});
        expect(sc.state.go).toHaveBeenCalled();
    });

    it('should have a function that remove empty objects', () => {
        spyOn(sc, 'deleteUndefinedAndDoubleDollarKeys').and.callThrough();
        const form = {
            coverage: [
                {
                },
                {
                    b: undefined
                }
            ],
            platforms: [
                {
                    d: 'something',
                    available: true
                }
            ]
        };
        const result = sc.removeEmptyChildObjects(form);
        expect(result.coverage.length).toBe(0);
        expect(result.platforms.length).toBe(1);
        expect(sc.deleteUndefinedAndDoubleDollarKeys).toHaveBeenCalled();
    });

    it('REGRESSION: it should have a function that clear undefined object keys', () => {
        expect(sc.deleteUndefinedAndDoubleDollarKeys).toBeDefined();
        const itm = {
            a: 'a',
            b: undefined
        };
        const result = sc.deleteUndefinedAndDoubleDollarKeys(itm);
        expect(result.hasOwnProperty('b')).toBe(false);
    });

});
