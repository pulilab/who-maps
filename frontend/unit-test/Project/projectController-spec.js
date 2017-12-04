import ProjectController from '../../src/Project/ProjectController';
import { $state, $scope, toast, $ngRedux, dialog, $timeout } from '../testUtilities';
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
        sc = new ProjectController(scope, $state, toast, $timeout, dialog, $ngRedux);
        sc.newProjectForm = {
            $valid: true,
            $setValidity: jasmine.createSpy('$setValidity')
        };
        sc.$onInit();
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

    it('has a onInit fn', () => {
        spyOn(sc, 'eventListeners');
        spyOn(sc, 'watchers');
        spyOn(sc, 'createDialogs');
        spyOn(ProjectModule, 'clearSimilarNameList').and.returnValue(() => {});
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

        expect(sc.activateValidation).toBe(true);
        expect(Array.isArray(sc.districtList)).toBe(true);
        expect(sc.unsubscribe).toBeDefined();
        expect(sc.unsubscribe()).toBe('unsubscribeFn');
    });

    it('has a onDestroy fn.', () => {
        spyOn(sc.EE, 'removeAllListeners');
        sc.unsubscribe = jasmine.createSpy('unsubscribe');
        sc.onDestroy();
        expect(sc.EE.removeAllListeners).toHaveBeenCalledWith('projectDiscardDraft', jasmine.any(Function));
        expect(sc.EE.removeAllListeners).toHaveBeenCalledWith('projectScrollTo', jasmine.any(Function));
        expect(sc.EE.removeAllListeners).toHaveBeenCalledWith('projectSaveDraft', jasmine.any(Function));
        expect(sc.unsubscribe).toHaveBeenCalled();
    });

    it('has a eventListeners fn', () => {
        spyOn(sc.EE, 'on');
        sc.eventListeners();
        expect(sc.EE.on).toHaveBeenCalledWith('projectScrollTo', jasmine.any(Function), jasmine.any(Object));
        expect(sc.EE.on).toHaveBeenCalledWith('projectSaveDraft', jasmine.any(Function), jasmine.any(Object));
        expect(sc.EE.on).toHaveBeenCalledWith('projectDiscardDraft', jasmine.any(Function), jasmine.any(Object));
    });

    it('has a createDialogs', () => {
        sc.createDialogs();
        expect(sc.$mdDialog.confirm).toHaveBeenCalledWith(jasmine.any(Object));
        expect(sc.$mdDialog.alert).toHaveBeenCalledWith(jasmine.any(Object));
        expect(sc.confirmDraftDiscard.type).toBe('confirm');
        expect(sc.publishAlert.type).toBe('alert');
    });

    it('has a watchers fn', () => {
        spyOn(sc, 'getCountryFields');
        sc.watchers();
        expect(sc.getCountryFields).toHaveBeenCalled();
    });

    it('has a getCountryFields', async (done) => {
        spyOn(CountryModule, 'setCurrentCountry').and.returnValue( () => Promise.resolve());
        await sc.getCountryFields();
        expect(CountryModule.setCurrentCountry).not.toHaveBeenCalled();

        sc.editMode = true;
        await sc.getCountryFields(1, 2);
        expect(CountryModule.setCurrentCountry).toHaveBeenCalled();
        done();
    });

    it('save fn.', () => {
        const e = document.createElement('div');
        e.setAttribute('id', 'npf');
        document.body.appendChild(e);
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

    it('should have a function that open a simple toast', () => {
        sc.showToast('a');
        expect(sc.toast.show).toHaveBeenCalled();
    });

});
