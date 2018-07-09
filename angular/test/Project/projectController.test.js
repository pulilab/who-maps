import ProjectController from '../../src/Project/ProjectController';
import { $state, $scope, toast, $ngRedux, dialog, $timeout, EE, A, gettextCatalog } from '../testUtilities';
import * as ProjectModule from '../../src/store/modules/projects';
import * as UserModule from '../../src/store/modules/user';
import * as SystemModule from '../../src/store/modules/system';
import * as CountryModule from '../../src/store/modules/countries';

let sc = {
  project: {}
};

const scope = $scope(sc);

describe('ProjectController', () => {
  beforeEach(() => {
    sc = new ProjectController(scope, $state(), toast, $timeout, dialog, $ngRedux, gettextCatalog);
    sc.newProjectForm = {
      $valid: true,
      $setValidity: jest.fn()
    };
    sc.EE = EE;
    jest.spyOn(ProjectModule, 'clearSimilarNameList').mockReturnValue(() => {});
    sc.$onInit();
  });

  test('should have a factory  fn.', () => {
    expect(ProjectController.newProjectFactory).toBeDefined();
    const onSpot = ProjectController.newProjectFactory()($scope(sc), $state(), toast, $timeout, dialog, $ngRedux);
    expect(onSpot.constructor.name).toBe(sc.constructor.name);
  });

  test('mapData fn', () => {
    const profileSpy = jest.spyOn(UserModule, 'getProfile').mockReturnValue({ id: 1 });
    jest.spyOn(ProjectModule, 'getVanillaProject').mockReturnValue({ name: 'vanilla', organisation: { id: 1 } });
    jest.spyOn(ProjectModule, 'getCurrentPublished').mockReturnValue({ name: 'cps', organisation: { id: 1 } });
    jest.spyOn(ProjectModule, 'getCurrentDraftProjectForEditing').mockReturnValue({ name: 'gcdpfe', organisation: { id: 1 } });
    const teamSpy = jest.spyOn(ProjectModule, 'getTeam').mockReturnValue(['gt']);
    jest.spyOn(ProjectModule, 'getCurrentEdits').mockReturnValue({ ce: 1 });
    const viewersSpy = jest.spyOn(ProjectModule, 'getViewers').mockReturnValue(['gv']);
    jest.spyOn(ProjectModule, 'getEmptyProject').mockReturnValue({ name: 'gep', organisation: { id: 1 } });
    jest.spyOn(ProjectModule, 'getCurrentDraftInViewMode').mockReturnValue({ name: 'gcdivm', organisation: { id: 1 } });
    jest.spyOn(ProjectModule, 'getProjectStructure').mockReturnValue('gps');
    jest.spyOn(ProjectModule, 'getPublishedProjects').mockReturnValue('gpps');
    jest.spyOn(SystemModule, 'getUserProfiles').mockReturnValue('gups');
    jest.spyOn(ProjectModule, 'getCurrentPublicProjectDetails').mockReturnValue('gcppd');

    sc.project = { organisation: { id: 1 } };
    teamSpy.mockReturnValue([{ id: 1 }]);
    viewersSpy.mockReturnValue([{ id: 1 }]);
    sc.state.current.name = 'newProject';
    sc.state.params.editMode = 'draft';

    let result = sc.mapData({});
    expect(UserModule.getProfile).toHaveBeenCalledTimes(1);
    expect(SystemModule.getUserProfiles).toHaveBeenCalledTimes(1);
    expect(ProjectModule.getProjectStructure).toHaveBeenCalledTimes(1);
    expect(ProjectModule.getPublishedProjects).toHaveBeenCalledTimes(1);

    expect(result.newProject).toBe(true);
    expect(result.publishMode).toBe(false);
    expect(result.readOnlyMode).toBe(false);
    expect(result.project).toEqual({ organisation: { id: 1 }, ce: 1, name: 'vanilla' });
    expect(result.team[0].id).toBe(1);
    expect(result.viewers).toEqual([]);
    expect(result.structure).toBe('gps');
    expect(result.users).toBe('gups');
    expect(result.userProfile.id).toBe(1);
    expect(result.userProjects).toBe('gpps');

    sc.state.current.name = 'editProject';
    profileSpy.mockReturnValue({ id: 2 });
    viewersSpy.mockReturnValue([{ id: 2 }]);
    sc.state.params.editMode = 'draft';
    result = sc.mapData({});

    expect(UserModule.getProfile).toHaveBeenCalledTimes(2);
    expect(SystemModule.getUserProfiles).toHaveBeenCalledTimes(2);
    expect(ProjectModule.getProjectStructure).toHaveBeenCalledTimes(2);
    expect(ProjectModule.getPublishedProjects).toHaveBeenCalledTimes(2);
    expect(ProjectModule.getCurrentDraftInViewMode).toHaveBeenCalledTimes(1);

    expect(result.project).toEqual({ name: 'gcdivm', organisation: { id: 1 } });

    profileSpy.mockReturnValue({ id: 1 });
    sc.state.current.name = 'newProject';
    result = sc.mapData({});

    expect(UserModule.getProfile).toHaveBeenCalledTimes(3);
    expect(ProjectModule.getVanillaProject).toHaveBeenCalledTimes(2);

    expect(result.project).toEqual({ name: 'vanilla', organisation: { id: 1 }, ce: 1 });
    expect(result.team[0].id).toBe(1);
    expect(result.viewers.length).toBe(0);

    sc.state.current.name = 'editMode';
    sc.state.params.editMode = 'publish';
    profileSpy.mockReturnValue({ id: 10 });

    result = sc.mapData({});

    expect(UserModule.getProfile).toHaveBeenCalledTimes(4);
    expect(ProjectModule.getTeam).toHaveBeenCalledTimes(2);
    expect(ProjectModule.getViewers).toHaveBeenCalledTimes(2);

    expect(result.project).toEqual('gcppd');
    expect(result.team[0]).toEqual({ id: 1 });
    expect(result.viewers[0]).toEqual({ id: 2 });

    sc.state.params.editMode = 'draft';

    result = sc.mapData({});

    expect(UserModule.getProfile).toHaveBeenCalledTimes(5);
    expect(ProjectModule.getTeam).toHaveBeenCalledTimes(3);
    expect(ProjectModule.getViewers).toHaveBeenCalledTimes(3);

    expect(result.project).toEqual('gcppd');
    expect(result.team[0]).toEqual({ id: 1 });
    expect(result.viewers[0]).toEqual({ id: 2 });

    profileSpy.mockReturnValue({ id: 1 });
    result = sc.mapData({});
    expect(ProjectModule.getCurrentDraftProjectForEditing).toHaveBeenCalledTimes(1);
  });

  test('onInit fn', () => {
    jest.spyOn(sc, 'eventListeners');
    jest.spyOn(sc, 'watchers');
    jest.spyOn(sc, 'createDialogs');
    jest.spyOn(ProjectModule, 'clearSimilarNameList').mockReturnValue(() => {});
    jest.spyOn(ProjectModule, 'setCurrentProject').mockReturnValue(() => {});
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

  test('onDestroy fn.', () => {
    sc.unsubscribe = jest.fn();
    jest.spyOn(ProjectModule, 'resetEditedProject').mockReturnValue(() => {});
    sc.onDestroy();
    expect(sc.EE.removeAllListeners).toHaveBeenCalledWith('projectDiscardDraft', expect.any(Function));
    expect(sc.EE.removeAllListeners).toHaveBeenCalledWith('projectScrollTo', expect.any(Function));
    expect(sc.EE.removeAllListeners).toHaveBeenCalledWith('projectSaveDraft', expect.any(Function));
    expect(sc.unsubscribe).toHaveBeenCalled();
    expect(ProjectModule.resetEditedProject).toHaveBeenCalled();
  });

  test('has a eventListeners fn', () => {
    sc.eventListeners();
    expect(sc.EE.on).toHaveBeenCalledWith('projectScrollTo', expect.any(Function), expect.anything());
    expect(sc.EE.on).toHaveBeenCalledWith('projectSaveDraft', expect.any(Function), expect.anything());
    expect(sc.EE.on).toHaveBeenCalledWith('projectDiscardDraft', expect.any(Function), expect.anything());
  });

  test('createDialogs fn.', () => {
    sc.createDialogs();
    expect(sc.$mdDialog.confirm).toHaveBeenCalledWith(expect.any(Object));
    expect(sc.$mdDialog.alert).toHaveBeenCalledWith(expect.any(Object));
    expect(sc.confirmDraftDiscard.type).toBe('confirm');
    expect(sc.publishAlert.type).toBe('alert');
    expect(sc.savingError.type).toBe('alert');
    expect(sc.draftCongratulation.type).toBe('alert');
    expect(sc.draftDiscardCongratulation.type).toBe('alert');
    expect(sc.publishCongratulation.type).toBe('alert');
  });

  test('watchers fn', () => {
    jest.spyOn(sc, 'getCountryFields');
    sc.watchers();
    expect(sc.getCountryFields).toHaveBeenCalled();
  });

  test('getCountryFields fn.', async (done) => {
    jest.spyOn(CountryModule, 'setCurrentCountry').mockReturnValue(() => Promise.resolve());
    await sc.getCountryFields();
    expect(CountryModule.setCurrentCountry).not.toHaveBeenCalled();

    await sc.getCountryFields(1);
    expect(CountryModule.setCurrentCountry).toHaveBeenCalled();
    done();
  });

  test('scrollToFieldSet fn.', () => {
    const a = document.createElement('div');
    const mainElement = document.createElement('div');
    mainElement.setAttribute('class', 'main-content');
    mainElement.height = 50000;
    a.setAttribute('id', 'a');
    window.document.body.appendChild(a);
    window.document.body.appendChild(mainElement);

    sc.EE.emit.mockClear();
    sc.scrollToFieldSet();
    expect(sc.EE.emit).not.toHaveBeenCalled();

    sc.scrollToFieldSet('a');
    expect(sc.EE.emit).toHaveBeenCalled();
  });

  test('clearCustomErrors fn.', () => {
    const formItem = {};
    sc.form = [formItem];
    sc.clearCustomErrors();
    formItem.$setValidity = jest.fn();
    expect(formItem.$setValidity).not.toHaveBeenCalled();

    formItem.customError = [];
    sc.clearCustomErrors();
    expect(formItem.$setValidity).not.toHaveBeenCalled();

    formItem.customError = [1];
    sc.clearCustomErrors();
    expect(formItem.customError).toEqual([]);
    expect(formItem.$setValidity).toHaveBeenCalledWith('custom', true);
  });

  test('publishProject', () => {
    jest.spyOn(sc, 'clearCustomErrors').mockReturnValue(undefined);
    jest.spyOn(sc, 'doPublishProject').mockReturnValue(undefined);
    sc.publishProject();

    expect(sc.activateValidation).toEqual(true);
    expect(sc.clearCustomErrors).toHaveBeenCalled();
    expect(sc.doPublishProject).toHaveBeenCalled();
  });

  test('doPublishProject', async (done) => {
    jest.spyOn(sc, 'focusInvalidField').mockReturnValue(undefined);
    jest.spyOn(sc, 'postPublishAction').mockReturnValue(undefined);
    jest.spyOn(sc, 'handleResponse').mockReturnValue(undefined);
    jest.spyOn(sc, 'saveOrganisationIfNeeded').mockReturnValue(Promise.resolve(1));

    sc.publish = jest.fn().mockReturnValue(Promise.resolve(1));
    sc.form = {
      $valid: false
    };

    await sc.doPublishProject();

    expect(sc.focusInvalidField).toHaveBeenCalledTimes(1);
    expect(sc.$mdDialog.show).toHaveBeenCalled();

    sc.form.$valid = true;
    await sc.doPublishProject();

    expect(sc.publish).toHaveBeenCalledTimes(1);
    expect(sc.postPublishAction).toHaveBeenCalledTimes(1);

    const error = new Error({response: {}});
    sc.publish.mockReturnValue(Promise.reject(error));
    await sc.doPublishProject();

    expect(sc.publish).toHaveBeenCalledTimes(2);
    expect(sc.handleResponse).toHaveBeenCalledTimes(1);
    expect(sc.postPublishAction).toHaveBeenCalledTimes(1);
    expect(sc.$mdDialog.show).toHaveBeenCalled();
    done();
  });

  test('saveDraftHandler', () => {
    jest.spyOn(sc, 'clearCustomErrors').mockReturnValue(undefined);
    jest.spyOn(sc, 'doSaveDraftHandler').mockReturnValue(undefined);
    sc.saveDraftHandler();

    expect(sc.activateValidation).toEqual(false);
    expect(sc.clearCustomErrors).toHaveBeenCalled();
    expect(sc.doSaveDraftHandler).toHaveBeenCalled();
  });

  test('doSaveDraftHandler', async done => {
    jest.spyOn(sc, 'focusInvalidField').mockReturnValue(undefined);
    sc.saveDraft = jest.fn().mockReturnValue(Promise.resolve({ id: 1 }));
    sc.saveOrganisationIfNeeded = jest.fn().mockReturnValue(Promise.resolve());
    jest.spyOn(sc, 'handleResponse').mockReturnValue(undefined);
    sc.newProject = false;
    sc.form = {
      $valid: false
    };
    await sc.doSaveDraftHandler();
    expect(sc.saveDraft).not.toHaveBeenCalled();

    sc.form.$valid = true;
    await sc.doSaveDraftHandler();
    expect(sc.saveDraft).toHaveBeenCalled();
    expect(sc.state.go).not.toHaveBeenCalled();

    sc.newProject = true;
    await sc.doSaveDraftHandler();
    expect(sc.saveDraft).toHaveBeenCalledTimes(2);
    expect(sc.state.go).toHaveBeenCalledWith('editProject', expect.any(Object), expect.any(Object));
    const error = new Error();
    error.response = 1;

    jest.spyOn(console, 'log').mockImplementation(() => {});
    sc.saveDraft.mockReturnValue(Promise.reject(error));
    await sc.doSaveDraftHandler();
    expect(sc.handleResponse).toHaveBeenCalledWith(1);
    done();
  });

  test('discardDraftHandler fn.', async (done) => {
    sc.discardDraft = jest.fn().mockReturnValue(Promise.resolve());
    await sc.discardDraftHandler();
    expect(sc.$mdDialog.show).toHaveBeenCalled();
    expect(sc.discardDraft).toHaveBeenCalled();
    const error = new Error(1);
    jest.spyOn(console, 'log').mockImplementation(() => {});
    sc.discardDraft.mockReturnValue(Promise.reject(error));
    await sc.discardDraftHandler();
    done()
  });

  test('focusInvalidField fn.', () => {
    const a = document.createElement('div');
    a.setAttribute('id', 'npf');
    window.document.body.appendChild(a);
    const errorDom = document.createElement('div');
    errorDom.setAttribute('class', 'ng-invalid');
    errorDom.focus = jest.fn();
    sc.focusInvalidField();

    a.appendChild(errorDom);
    sc.focusInvalidField();
    expect(errorDom.focus).toHaveBeenCalled();
    window.document.body.removeChild(a);
  });

  test('postPublishAction', () => {
    sc.postPublishAction({ id: 1 });
    expect(sc.state.go).toHaveBeenCalledWith('editProject', expect.any(Object), expect.any(Object));
  });

  test('addErrorArray fn. ', () => {
    sc.form = {
      a: {
        customError: null,
        $setValidity: jest.fn()
      }
    };
    sc.addErrorArray(1, 'b');
    expect(sc.form.a.$setValidity).not.toHaveBeenCalled();

    sc.addErrorArray(1, 'a');
    expect(sc.form.a.$setValidity).toHaveBeenCalled();
    expect(sc.form.a.customError).toBe(1);
  });

  test('handleResponse fn', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const errorSpy = jest.spyOn(sc, 'addErrorArray').mockReturnValue(undefined);
    jest.spyOn(sc, 'focusInvalidField').mockReturnValue(undefined);
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
      a: [{
        b: 1
      }]
    };
    sc.handleResponse(response);
    expect(sc.addErrorArray).toHaveBeenCalledWith(1, 'a_0.b');

    response.data.a = 1;
    sc.handleResponse(response);
    expect(sc.addErrorArray).toHaveBeenCalledWith(1, 'a');

    const error = new Error('custom crafter error');
    errorSpy.mockReturnValue(Promise.reject(error));
    sc.handleResponse(response);
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
