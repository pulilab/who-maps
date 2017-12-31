import ProjectController from '../../src/Project/ProjectController';
import { $state, $scope, toast, $ngRedux, dialog, $timeout, EE, A } from '../testUtilities';
import * as ProjectModule from '../../src/store/modules/projects';
import * as UserModule from '../../src/store/modules/user';
import * as SystemModule from '../../src/store/modules/system';
import * as CountryModule from '../../src/store/modules/countries';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let sc = {
    project: {}
};

const scope = $scope(sc);


describe('ProjectController', () => {

    beforeEach(() => {
        sc = new ProjectController(scope, $state(), toast, $timeout, dialog, $ngRedux);
        sc.newProjectForm = {
            $valid: true,
            $setValidity: jasmine.createSpy('$setValidity')
        };
        sc.EE = EE;
        sc.$onInit();
    });

    it('should have a factory  fn.', () => {
        expect(ProjectController.newProjectFactory).toBeDefined();
        const onSpot = ProjectController.newProjectFactory()($scope(sc), $state(), toast, $timeout, dialog, $ngRedux);
        expect(onSpot.constructor.name).toBe(sc.constructor.name);
    });

    it('mapData fn', () => {
        const profileSpy = spyOn(UserModule, 'getProfile').and.returnValue({ id: 1 });
        spyOn(ProjectModule, 'getLastVersion').and.returnValue(1);
        spyOn(ProjectModule, 'getVanillaProject').and.returnValue('vanilla');
        spyOn(ProjectModule, 'getCurrentPublished').and.returnValue('cps');
        const currentDraftForEditing =
          spyOn(ProjectModule, 'getCurrentDraftProjectForEditing').and.returnValue('gcdpfe');
        spyOn(ProjectModule, 'getTeam').and.returnValue(['gt']);
        spyOn(ProjectModule, 'getViewers').and.returnValue(['gv']);
        spyOn(ProjectModule, 'getEmptyProject').and.returnValue('gep');
        spyOn(ProjectModule, 'getCurrentDraftInViewMode').and.returnValue('gcdivm');
        spyOn(ProjectModule, 'getProjectStructure').and.returnValue('gps');
        spyOn(ProjectModule, 'getPublishedProjects').and.returnValue('gpps');
        spyOn(SystemModule, 'getUserProfiles').and.returnValue('gups');

        sc.lastVersion = 1;
        sc.project = 1;
        sc.team = [{ id: 1 }];
        sc.viewers = [{ id: 1 }];
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

        expect(result.project).toBe('vanilla');
        expect(result.team[0].id).toBe(2);
        expect(result.viewers.length).toBe(0);


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
    });

    it('onInit fn', () => {
        spyOn(sc, 'eventListeners');
        spyOn(sc, 'watchers');
        spyOn(sc, 'createDialogs');
        spyOn(ProjectModule, 'clearSimilarNameList').and.returnValue(() => {});
        spyOn(ProjectModule, 'setCurrentProject').and.returnValue(() => {});
        sc.activateValidation = undefined;
        sc.districtList = undefined;
        sc.unsubcribe = undefined;
        sc.onInit();

        expect(sc.eventListeners).toHaveBeenCalled();
        expect(sc.watchers).toHaveBeenCalled();
        expect(sc.createDialogs).toHaveBeenCalled();
        expect(sc.$ngRedux.dispatch).toHaveBeenCalled();
        expect(ProjectModule.clearSimilarNameList).toHaveBeenCalled();
        expect(sc.$ngRedux.connect).toHaveBeenCalled();

        expect(sc.activateValidation).toBe(false);
        expect(Array.isArray(sc.districtList)).toBe(true);
        expect(sc.unsubscribe).toBeDefined();
        expect(sc.unsubscribe()).toBe('unsubscribeFn');

        sc.state.current.name = 'newProject';
        sc.onInit();
        expect(ProjectModule.setCurrentProject).toHaveBeenCalled();
    });

    it('onDestroy fn.', () => {
        sc.unsubscribe = jasmine.createSpy('unsubscribe');
        sc.onDestroy();
        expect(sc.EE.removeAllListeners).toHaveBeenCalledWith('projectDiscardDraft', jasmine.any(Function));
        expect(sc.EE.removeAllListeners).toHaveBeenCalledWith('projectScrollTo', jasmine.any(Function));
        expect(sc.EE.removeAllListeners).toHaveBeenCalledWith('projectSaveDraft', jasmine.any(Function));
        expect(sc.unsubscribe).toHaveBeenCalled();
    });

    it('has a eventListeners fn', () => {
        sc.eventListeners();
        expect(sc.EE.on).toHaveBeenCalledWith('projectScrollTo', jasmine.any(Function), jasmine.anything());
        expect(sc.EE.on).toHaveBeenCalledWith('projectSaveDraft', jasmine.any(Function), jasmine.anything());
        expect(sc.EE.on).toHaveBeenCalledWith('projectDiscardDraft', jasmine.any(Function), jasmine.anything());
    });

    it('createDialogs fn.', () => {
        sc.createDialogs();
        expect(sc.$mdDialog.confirm).toHaveBeenCalledWith(jasmine.any(Object));
        expect(sc.$mdDialog.alert).toHaveBeenCalledWith(jasmine.any(Object));
        expect(sc.confirmDraftDiscard.type).toBe('confirm');
        expect(sc.publishAlert.type).toBe('alert');
    });

    it('watchers fn', () => {
        spyOn(sc, 'getCountryFields');
        sc.watchers();
        expect(sc.getCountryFields).toHaveBeenCalled();
    });

    it('getCountryFields fn.', A(async () => {
        spyOn(CountryModule, 'setCurrentCountry').and.returnValue(() => Promise.resolve());
        await sc.getCountryFields();
        expect(CountryModule.setCurrentCountry).not.toHaveBeenCalled();

        await sc.getCountryFields(1);
        expect(CountryModule.setCurrentCountry).toHaveBeenCalled();
    }));

    it('scrollToFieldSet fn.', () => {
        const a = document.createElement('div');
        const mainElement = document.createElement('div');
        mainElement.setAttribute('class', 'main-content');
        mainElement.height = 50000;
        a.setAttribute('id', 'a');
        window.document.body.appendChild(a);
        window.document.body.appendChild(mainElement);

        sc.EE.emit.calls.reset();
        sc.scrollToFieldSet();
        expect(sc.EE.emit).not.toHaveBeenCalled();

        sc.scrollToFieldSet('a');
        expect(sc.EE.emit).toHaveBeenCalled();
    });

    it('clearCustomErrors fn.', () => {
        const formItem = {};
        sc.form = [formItem];
        sc.clearCustomErrors();
        formItem.$setValidity = jasmine.createSpy('setValidity');
        expect(formItem.$setValidity).not.toHaveBeenCalled();

        formItem.customError = [];
        sc.clearCustomErrors();
        expect(formItem.$setValidity).not.toHaveBeenCalled();

        formItem.customError = [1];
        sc.clearCustomErrors();
        expect(formItem.customError).toEqual([]);
        expect(formItem.$setValidity).toHaveBeenCalledWith('custom', true);
    });


    it('publishProject async fn.', A(async () => {
        spyOn(sc, 'clearCustomErrors');
        spyOn(sc, 'focusInvalidField');
        spyOn(sc, 'postPublishAction');
        spyOn(sc, 'handleResponse');
        sc.publish =  jasmine.createSpy('publish').and.returnValue(Promise.resolve());
        sc.form = {
            $valid: false
        };
        await sc.publishProject();
        expect(sc.clearCustomErrors).toHaveBeenCalledTimes(1);
        expect(sc.focusInvalidField).toHaveBeenCalledTimes(1);
        expect(sc.$mdDialog.show).toHaveBeenCalled();

        sc.form.$valid = true;
        await sc.publishProject();
        expect(sc.clearCustomErrors).toHaveBeenCalledTimes(2);
        expect(sc.publish).toHaveBeenCalledTimes(1);
        expect(sc.postPublishAction).toHaveBeenCalledTimes(1);

        sc.publish.and.returnValue(Promise.reject({ response: {} }));
        await sc.publishProject();
        expect(sc.clearCustomErrors).toHaveBeenCalledTimes(3);
        expect(sc.publish).toHaveBeenCalledTimes(2);
        expect(sc.handleResponse).toHaveBeenCalledTimes(1);
        expect(sc.postPublishAction).toHaveBeenCalledTimes(1);
        expect(sc.$mdDialog.show).toHaveBeenCalled();

    }));

    it('saveDraftHandler fn.', A(async () => {
        sc.saveDraft = jasmine.createSpy('saveDraft').and.returnValue(Promise.resolve({ id: 1 }));
        spyOn(sc, 'showToast');
        spyOn(sc, 'handleResponse');
        sc.newProject = false;
        sc.form = {
            $valid: false
        };
        await sc.saveDraftHandler();
        expect(sc.saveDraft).not.toHaveBeenCalled();

        sc.form.$valid = true;
        await sc.saveDraftHandler();
        expect(sc.saveDraft).toHaveBeenCalled();
        expect(sc.showToast).toHaveBeenCalled();
        expect(sc.state.go).not.toHaveBeenCalled();

        sc.newProject = true;
        await sc.saveDraftHandler();
        expect(sc.saveDraft).toHaveBeenCalledTimes(2);
        expect(sc.showToast).toHaveBeenCalledTimes(2);
        expect(sc.state.go).toHaveBeenCalledWith('editProject', jasmine.any(Object), jasmine.any(Object));

        sc.saveDraft.and.returnValue(Promise.reject({ response: 1 }));
        await sc.saveDraftHandler();
        expect(sc.handleResponse).toHaveBeenCalledWith(1);

    }));

    it('discardDraftHandler fn.', A(async () => {
        sc.discardDraft = jasmine.createSpy('disacrdDraft§').and.returnValue(Promise.resolve());
        spyOn(sc, 'showToast');
        await sc.discardDraftHandler();
        expect(sc.$mdDialog.show).toHaveBeenCalled();
        expect(sc.discardDraft).toHaveBeenCalled();
        expect(sc.showToast).toHaveBeenCalledWith('Draft discarded');

        sc.discardDraft.and.returnValue(Promise.reject(1));
        await sc.discardDraftHandler();
        expect(sc.showToast).toHaveBeenCalledWith('Discard draft process canceled');
    }));

    it('focusInvalidField fn.', () => {
        const a = document.createElement('div');
        a.setAttribute('id', 'npf');
        window.document.body.appendChild(a);
        const errorDom = document.createElement('div');
        errorDom.setAttribute('class', 'ng-invalid');
        errorDom.focus = jasmine.createSpy('focus');
        sc.focusInvalidField();

        a.appendChild(errorDom);
        sc.focusInvalidField();
        expect(errorDom.focus).toHaveBeenCalled();
        window.document.body.removeChild(a);
    });

    it('should have a function that open a simple toast', () => {
        sc.showToast('a');
        expect(sc.toast.show).toHaveBeenCalled();
    });

    it('showToast fn.', () => {
        sc.showToast();
        expect(sc.toast.show).toHaveBeenCalled();
    });

    it('postPublishAction', () => {
        spyOn(sc, 'showToast');
        sc.postPublishAction({ id: 1 });
        expect(sc.showToast).toHaveBeenCalled();
        expect(sc.state.go).toHaveBeenCalledWith('editProject', jasmine.any(Object), jasmine.any(Object));
    });

    it('addErrorArray fn. ', ()=> {
        sc.form = {
            a: {
                customError: null,
                $setValidity: jasmine.createSpy('setValidity')
            }
        };
        sc.addErrorArray(1, 'b');
        expect(sc.form.a.$setValidity).not.toHaveBeenCalled();

        sc.addErrorArray(1, 'a');
        expect(sc.form.a.$setValidity).toHaveBeenCalled();
        expect(sc.form.a.customError).toBe(1);
    });

    it('handleResponse fn', () => {
        spyOn(console, 'error');
        const errorSpy = spyOn(sc, 'addErrorArray');
        spyOn(sc, 'focusInvalidField');
        const response = {
            status: 500
        };
        sc.handleResponse(response);
        expect(console.error).toHaveBeenCalled();

        response.status = 400;
        response.data = {
            a: {
                b: 1
            }
        };

        sc.handleResponse(response);
        expect(sc.addErrorArray).toHaveBeenCalledWith(1, 'a.b');
        response.data = {
            a : [{
                b: 1
            }]
        };
        sc.handleResponse(response);
        expect(sc.addErrorArray).toHaveBeenCalledWith(1, 'a_0.b');

        response.data.a = 1;
        sc.handleResponse(response);
        expect(sc.addErrorArray).toHaveBeenCalledWith(1, 'a');

        errorSpy.and.throwError();
        sc.handleResponse(response);
        expect(console.error).toHaveBeenCalledTimes(2);
    });

});
