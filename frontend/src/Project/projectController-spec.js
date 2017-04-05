import NewProjectController from './ProjectController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let sc = {};

const $scope = {
    $evalAsync: jasmine.createSpy('eval').and.callFake(toCall => {
        if (toCall && typeof toCall === 'function') {
            toCall();
        }
    }),
    $$postDigest: jasmine.createSpy('digest')
};

const mockData = {
    countries: [{
        id: 1,
        name: 'asd'
    }]
};

const $state = {
    params: {

    }
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

const mockPromiseGenerator = result => {
    return {
        then: toCall=> {
            if (toCall && typeof toCall === 'function') {
                toCall(result);
            }
        }
    };
};

const cs = {
    projectStructure: mockData,
    userProfile: {
        organisation: 'asd'
    },
    populateProjectStructure: jasmine.createSpy('pps'),
    getProjectData: jasmine.createSpy('gpd').and.returnValue(Promise.resolve()),
    updateProject: jasmine.createSpy('updateProject').and.returnValue(Promise.resolve()),
    isViewer: jasmine.createSpy('isViewer').and.returnValue(true),
    isMember: jasmine.createSpy('isMember').and.returnValue(true),
    addProjectToCache: jasmine.createSpy('addProjectToCache')
};

const upload = {};

const timeout = toCall => {
    toCall();
};

const structure = require('./Resources/structure.json');

describe('ProjectController', () => {

    beforeEach(() => {
        sc = new NewProjectController($scope, $state, upload, cs, structure, timeout);
        sc.newProjectForm = {
            $valid: true,
            $setValidity: jasmine.createSpy('$setValidity')
        };
        sc.$onInit();
    });

    it('should have a function that handle the server data loading', () => {
        sc.handleStructureLoad();
        expect(sc.dataLoaded).toBeTruthy();
        expect(sc.scope.$evalAsync).toHaveBeenCalled();

    });


    it('should have a function that handle the saving process ', () => {
        const e = document.createElement('div');
        e.setAttribute('id', 'npf');
        document.body.appendChild(e);
        spyOn(sc, 'clearCustomErrors');
        spyOn(sc, 'mergeCustomAndDefault');
        spyOn(sc, 'convertObjectArrayToStringArray');
        spyOn(sc, 'removeEmptyChildObjects');
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
            }
        };
        sc.save();
        sc.form.$valid = false;
        sc.save();
        expect(sc.clearCustomErrors).toHaveBeenCalled();
        expect(sc.mergeCustomAndDefault).toHaveBeenCalledTimes(1);
        expect(sc.convertObjectArrayToStringArray).toHaveBeenCalled();
        expect(sc.removeEmptyChildObjects).toHaveBeenCalled();
        expect(sc.saveForm).toHaveBeenCalled();
        sc.form.$valid = true;
        sc.editMode = true;
        sc.save();
        expect(sc.updateForm).toHaveBeenCalled();
    });

    it('should have a function that save a new form', () => {
        spyOn(sc, 'handleResponse');
        spyOn(sc, 'confirmationToast');
        spyOn(sc, 'ownershipCheck');
        spyOn(sc, 'postSaveActions');
        spyOn(sc, 'putGroups').and.returnValue(mockPromiseGenerator({}));

        const spy = spyOn(sc.ns, 'newProject');
        spy.and.returnValue(mockPromiseGenerator({ success: false }));
        sc.saveForm(sc.project);
        expect(sc.ns.newProject).toHaveBeenCalled();
        expect(sc.handleResponse).toHaveBeenCalled();

        spy.and.returnValue(mockPromiseGenerator({ success: true }));
        sc.saveForm(sc.project);
        expect(sc.ownershipCheck).toHaveBeenCalled();
        expect(sc.cs.addProjectToCache).toHaveBeenCalled();
        expect(sc.putGroups).toHaveBeenCalled();
        expect(sc.postSaveActions).toHaveBeenCalled();
        expect(sc.confirmationToast).toHaveBeenCalled();
    });

    it('should have a function that update an existing form', () => {
        spyOn(sc, 'confirmationToast');
        spyOn(sc, 'handleResponse');
        const spy = spyOn(sc.ns, 'updateProject');
        spy.and.returnValue(mockPromiseGenerator({ success: false }));
        sc.editMode = true;
        sc.updateForm(sc.project);
        expect(sc.ns.updateProject).toHaveBeenCalled();
        expect(sc.handleResponse).toHaveBeenCalled();
        spy.and.returnValue(mockPromiseGenerator({ success: true }));
        sc.updateForm(sc.project);
        expect(sc.cs.updateProject).toHaveBeenCalled();
        expect(sc.confirmationToast).toHaveBeenCalled();
    });

    it('should have some utility function', () => {
        expect(sc.concatCustom).toBeDefined();
    });

    it('should have a function that handle the onInit when is in editMode', () => {
        spyOn(sc, 'handleStructureLoad');
        spyOn(sc.EE, 'emit');
        spyOn(sc.ns, 'getGroups').and.returnValue(getGroupMock);
        sc.editMode = true;
        sc.onInit();
        expect(sc.cs.getProjectData).toHaveBeenCalled();
        expect(sc.handleStructureLoad).toHaveBeenCalled();
        expect(sc.team[0]).toBe('a');
        sc.userProfile = undefined;
        sc.onInit();
        expect(sc.EE.emit).toHaveBeenCalled();

    });

    it('should have a function that handle the on destroy event', () => {
        spyOn(sc.EE, 'removeListener');
        sc.$onDestroy();
        expect(sc.EE.removeListener).toHaveBeenCalledTimes(3);
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
        spyOn(sc.ccs, 'getCountryDistricts').and.returnValue(Promise.resolve({}));
        spyOn(sc, 'convertArrayToStandardCustomObj');
        spyOn(sc, 'convertStringArrayToObjectArray');
        spyOn(sc, 'fillEmptyCollectionsWithDefault');
        sc.handleStructureLoad(mockData);
        sc.handleDataLoad({});
        expect(sc.convertArrayToStandardCustomObj).toHaveBeenCalled();
        expect(sc.convertStringArrayToObjectArray).toHaveBeenCalled();
        expect(sc.fillEmptyCollectionsWithDefault).toHaveBeenCalled();

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
        spyOn(sc.ns, 'putGroups');
        sc.putGroups();
        expect(sc.ns.putGroups).toHaveBeenCalled();
    });

});
