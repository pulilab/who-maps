import * as ProjectModule from '../../src/store/modules/projects';
import * as UserModule from '../../src/store/modules/user';
import * as CountryModule from '../../src/store/modules/countries';
import * as SystemModule from '../../src/store/modules/system';
import * as ToolkitModule from '../../src/store/modules/toolkit';
import * as ProjectUtils from '../../src/store/project_utils';
import { project_definition } from '../../src/store/static_data/project_definition';
import { A, defaultAxiosSuccess, dispatch, getState } from '../testUtilities';
import axios from '../../src/plugins/axios';

describe('Project Store Module', () => {
  describe('GETTERS', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    test('isMemberOrViewer', () => {
      const spy = jest.spyOn(UserModule, 'getProfile').mockReturnValue({});
      let result = ProjectModule.isMemberOrViewer({}, 1);
      expect(UserModule.getProfile).toHaveBeenCalled();
      expect(result.isMember).toBe(false);
      expect(result.isViewer).toBe(false);
      expect(result.isTeam).toBe(false);

      spy.mockReturnValue({ member: [] });
      result = ProjectModule.isMemberOrViewer({}, { id: 1 });
      expect(UserModule.getProfile).toHaveBeenCalled();
      expect(result.isMember).toBe(false);
      expect(result.isViewer).toBe(false);
      expect(result.isTeam).toBe(false);

      spy.mockReturnValue({ member: [], viewer: [] });
      result = ProjectModule.isMemberOrViewer({}, { id: 1 });
      expect(UserModule.getProfile).toHaveBeenCalled();
      expect(result.isMember).toBe(false);
      expect(result.isViewer).toBe(false);
      expect(result.isTeam).toBe(false);

      spy.mockReturnValue({ member: [1], viewer: [] });
      result = ProjectModule.isMemberOrViewer({}, { id: 1 });
      expect(UserModule.getProfile).toHaveBeenCalled();
      expect(result.isMember).toBe(true);
      expect(result.isViewer).toBe(false);
      expect(result.isTeam).toBe(true);

      spy.mockReturnValue({ member: [0], viewer: [1] });
      result = ProjectModule.isMemberOrViewer({}, { id: 1 });
      expect(UserModule.getProfile).toHaveBeenCalled();
      expect(result.isMember).toBe(false);
      expect(result.isViewer).toBe(true);
      expect(result.isTeam).toBe(true);
    });

    test('getCurrentProjectId', () => {
      const state = {
        projects: {
          currentProject: 1
        }
      };
      const result = ProjectModule.getCurrentProjectId(state);
      expect(result).toBe(1);
    });

    test('getSavedProjectList', () => {
      jest.spyOn(ProjectModule, 'getVanillaProject').mockReturnValue({ vanillaProp: 1 });
      const state = {
        projects: {}
      };

      let result = ProjectModule.getSavedProjectList(state);
      expect(result).toBe(undefined);

      state.projects.list = [{ id: -1 }, { id: 1 }];
      result = ProjectModule.getSavedProjectList({ ...state });
      expect(result).toEqual([{ id: 1, draft: { donors: [], implementing_partners: [], vanillaProp: 1 } }]);
      expect(ProjectModule.getVanillaProject).toHaveBeenCalled();
    });

    test('getPublishedProjects', () => {
      const list = [{ published: { id: 2 } }, { published: { id: 1 } }];
      jest.spyOn(ProjectModule, 'getSavedProjectList').mockReturnValue(list);
      jest.spyOn(ProjectModule, 'isMemberOrViewer').mockReturnValue(undefined);
      const state = {
        projects: {}
      };
      let result = ProjectModule.getPublishedProjects(state);
      expect(result).toEqual([]);

      state.projects.list = list;
      result = ProjectModule.getPublishedProjects(state);
      expect(ProjectModule.getSavedProjectList).toHaveBeenCalled();
      expect(ProjectModule.isMemberOrViewer).toHaveBeenCalledTimes(2);

      expect(result[0].id).toBe(2);
    });

    test('getDraftedProjects', () => {
      const list = [{ draft: { id: 2 } }, { draft: { id: 1 } }];
      jest.spyOn(ProjectModule, 'getSavedProjectList').mockReturnValue(list);
      ProjectModule.isMemberOrViewer = jest.fn();
      const state = {
        projects: {}
      };
      let result = ProjectModule.getDraftedProjects(state);
      expect(result).toEqual([]);

      state.projects.list = list;
      result = ProjectModule.getDraftedProjects(state);
      expect(ProjectModule.getSavedProjectList).toHaveBeenCalled();
      expect(ProjectModule.isMemberOrViewer).toHaveBeenCalledTimes(2);

      expect(result[0].id).toBe(2);
    });

    test('getFlatProjectStructure', () => {
      const state = {
        projects: {}
      };
      let result = ProjectModule.getFlatProjectStructure(state);
      expect(result).toEqual({});

      state.projects.structure = {
        strategies: [
          {
            subGroups: [
              {
                strategies: [{ id: 1 }, { id: 2 }]
              },
              {
                strategies: [{ id: 3 }, { id: 4 }]
              }
            ]
          }
        ],
        health_focus_areas: [
          {
            health_focus_areas: [1, 2]
          },
          {
            health_focus_areas: [3, 4]
          }
        ],
        hsc_challenges: [
          {
            challenges: [1, 2]
          },
          {
            challenges: [3, 4]
          }
        ]
      };
      result = ProjectModule.getFlatProjectStructure(state);
      expect(result.strategies).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
      expect(result.health_focus_areas).toEqual([1, 2, 3, 4]);
      expect(result.hsc_challenges).toEqual([1, 2, 3, 4]);
    });

    test('getProjectStructure', () => {
      const state = {
        projects: {
          structure: {
            id: 1
          }
        }
      };

      const result = ProjectModule.getProjectStructure(state);
      expect(result).toEqual(state.projects.structure);
    });

    test('getUserProjects', () => {
      const list = [{ draft: { id: 1 } }, { published: { id: 2 }, public_id: 1 }];
      jest.spyOn(ProjectModule, 'getFlatProjectStructure').mockReturnValue(undefined);
      jest.spyOn(ProjectModule, 'getSavedProjectList').mockReturnValue(list);
      jest.spyOn(ProjectModule, 'isMemberOrViewer').mockReturnValue(list);
      jest.spyOn(ProjectUtils, 'convertIdArrayToObjectArray').mockReturnValue(undefined);
      jest.spyOn(CountryModule, 'getCountry').mockReturnValue({ name: 1 });
      const state = {
        projects: {}
      };

      ProjectModule.isMemberOrViewer.mockClear();

      let result = ProjectModule.getUserProjects(state);
      expect(result).toEqual([]);

      state.projects.list = list;
      result = ProjectModule.getUserProjects(state);
      expect(ProjectModule.getFlatProjectStructure).toHaveBeenCalled();
      expect(CountryModule.getCountry).toHaveBeenCalled();
      expect(ProjectModule.getSavedProjectList).toHaveBeenCalled();
      expect(ProjectModule.isMemberOrViewer).toHaveBeenCalledTimes(2);
      expect(ProjectUtils.convertIdArrayToObjectArray).toHaveBeenCalledTimes(2);

      expect(result[0].isPublished).toEqual(false);
      expect(result[0].public_id).toEqual(undefined);

      expect(result[1].isPublished).toEqual(true);
      expect(result[1].public_id).toEqual(1);
    });

    test('getUserDefaultProject', () => {
      const state = {};
      let result = ProjectModule.getUserDefaultProject();
      expect(result).toEqual(null);

      result = ProjectModule.getUserDefaultProject(state);
      expect(result).toEqual(null);

      state.projects = {};
      result = ProjectModule.getUserDefaultProject(state);
      expect(result).toEqual(null);

      state.projects.list = [];
      result = ProjectModule.getUserDefaultProject(state);
      expect(result).toEqual(null);

      state.projects.list.push({ id: -1 });
      result = ProjectModule.getUserDefaultProject(state);
      expect(result).toEqual(null);

      state.projects.list = [{ id: 1 }];
      result = ProjectModule.getUserDefaultProject(state);
      expect(result).toEqual('1');
    });

    test('getEmptyProject', () => {
      const result = ProjectModule.getEmptyProject();
      expect(result).toEqual(project_definition);
      expect(result).not.toBe(project_definition);
    });

    test('getVanillaProject', () => {
      jest.spyOn(ProjectModule, 'getEmptyProject').mockReturnValue({ id: 1 });
      const structureSpy = jest.spyOn(ProjectModule, 'getProjectStructure').mockReturnValue(undefined);
      const profileSpy = jest.spyOn(UserModule, 'getProfile').mockReturnValue(undefined);
      let result = ProjectModule.getVanillaProject({});
      expect(result).toEqual({ id: 1 });

      profileSpy.mockReturnValue({ country: { id: 1 } });
      result = ProjectModule.getVanillaProject({});
      expect(result).toEqual({ id: 1, organisation: null, country: 1 });

      structureSpy.mockReturnValue({ interoperability_links: 1 });
      result = ProjectModule.getVanillaProject({});
      expect(result).toEqual({ id: 1, organisation: null, country: 1, interoperability_links: 1 });

      profileSpy.mockReturnValue({ organisation: 1, country: { id: 1 } });
      result = ProjectModule.getVanillaProject({});
      expect(result).toEqual({ id: 1, organisation: 1, country: 1, interoperability_links: 1 });
    });

    test('getCurrentProjectIfExist', () => {
      jest.spyOn(ProjectModule, 'getUserProjects').mockReturnValue([{ id: 1 }, { id: 2 }]);
      const state = {
        projects: {
          currentProject: 1
        }
      };
      const result = ProjectModule.getCurrentProjectIfExist(state);
      expect(result.id).toBe(1);
    });

    test('getCurrentProject', () => {
      const currentSpy = jest.spyOn(ProjectModule, 'getCurrentProjectIfExist').mockReturnValue(undefined);
      const currentPublicSpy = jest.spyOn(ProjectModule, 'getCurrentPublicProject').mockReturnValue(undefined);
      jest.spyOn(ProjectModule, 'getVanillaProject').mockReturnValue({ id: 1 });
      let result = ProjectModule.getCurrentProject({});
      expect(result).toEqual({ id: 1 });
      expect(ProjectModule.getCurrentPublicProject).toHaveBeenCalled();
      expect(ProjectModule.getVanillaProject).toHaveBeenCalled();
      expect(ProjectModule.getCurrentProjectIfExist).toHaveBeenCalled();
      ProjectModule.getVanillaProject.mockClear();

      currentPublicSpy.mockReturnValue({ id: 3 });
      result = ProjectModule.getCurrentProject({});
      expect(result).toEqual({ id: 3 });
      expect(ProjectModule.getCurrentPublicProject).toHaveBeenCalled();
      expect(ProjectModule.getVanillaProject).not.toHaveBeenCalled();
      expect(ProjectModule.getCurrentProjectIfExist).toHaveBeenCalled();
      ProjectModule.getVanillaProject.mockClear();
      ProjectModule.getCurrentPublicProject.mockClear();

      currentSpy.mockReturnValue({ id: 2 });
      result = ProjectModule.getCurrentProject({});
      expect(result).toEqual({ id: 2 });
      expect(ProjectModule.getVanillaProject).not.toHaveBeenCalled();
      expect(ProjectModule.getCurrentPublicProject).not.toHaveBeenCalled();
      expect(ProjectModule.getCurrentProjectIfExist).toHaveBeenCalled();
    });

    test('getCurrentPublicProject', () => {
      jest.spyOn(CountryModule, 'getCountry').mockReturnValue({ name: 1 });
      const state = {
        projects: {
        }
      };
      let result = ProjectModule.getCurrentPublicProject(state);
      expect(result).toEqual({ country_name: undefined, isPublic: true });

      state.projects.currentPublicProject = {
        id: 1,
        published: {
          id: 1,
          name: 'a',
          country: 1
        }
      };

      result = ProjectModule.getCurrentPublicProject(state);
      expect(result).toEqual({ id: 1, country_name: 1, country: 1, isPublic: true, name: 'a' });
      expect(result).not.toBe(state.projects.currentPublicProject.published);
    });

    test('getCurrentPublicProjectDetails', () => {
      jest.spyOn(ProjectModule, 'parseProjectForViewMode').mockReturnValue({ id: 1 });
      jest.spyOn(ProjectModule, 'getVanillaProject').mockReturnValue({ id: 1 });
      const state = {
        projects: {}
      };

      let result = ProjectModule.getCurrentPublicProjectDetails(state);
      expect(result).toEqual({ id: 1 });
      expect(ProjectModule.getVanillaProject).toHaveBeenCalled();
      expect(ProjectModule.parseProjectForViewMode).not.toHaveBeenCalled();

      state.projects.currentPublicProject = {
        published: {}
      };

      ProjectModule.getVanillaProject.mockClear();

      result = ProjectModule.getCurrentPublicProjectDetails(state);
      expect(result).toEqual({ id: 1 });
      expect(ProjectModule.getVanillaProject).not.toHaveBeenCalled();
      expect(ProjectModule.parseProjectForViewMode).toHaveBeenCalledWith(state, { hasPublishedVersion: false, disableDraft: true });
    });

    test('convertCountryFieldsAnswer', () => {
      const toStringify = {
        id: 1
      };
      const answers = [
        { type: 2, answer: '10' },
        { type: 3, answer: 'true' },
        { type: 5, answer: JSON.stringify(toStringify) }
      ];
      const result = ProjectModule.convertCountryFieldsAnswer(answers);
      expect(result).toEqual([
        { type: 2, answer: 10 },
        { type: 3, answer: true },
        { type: 5, answer: toStringify }
      ]);
    });

    test('parseProjectForViewMode', () => {
      jest.spyOn(ProjectModule, 'getFlatProjectStructure').mockReturnValue(undefined);
      jest.spyOn(CountryModule, 'getCountry').mockReturnValue(undefined);
      jest.spyOn(ProjectUtils, 'convertIdArrayToObjectArray').mockReturnValue(undefined);
      jest.spyOn(ProjectUtils, 'setCoverageType').mockReturnValue(undefined);
      const result = ProjectModule.parseProjectForViewMode({}, {});
      expect(ProjectModule.getFlatProjectStructure).toHaveBeenCalled();
      expect(CountryModule.getCountry).toHaveBeenCalled();
      expect(ProjectUtils.convertIdArrayToObjectArray).toHaveBeenCalledTimes(2);
      expect(ProjectUtils.setCoverageType).toHaveBeenCalledTimes(1);
      expect(result.hasPublishedVersion).toBe(true);
    });

    test('getCurrentPublished', () => {
      jest.spyOn(ProjectModule, 'getPublishedProjects').mockReturnValue([{ id: 1 }]);
      jest.spyOn(ProjectModule, 'parseProjectForViewMode').mockReturnValue(1);
      const state = {
        projects: {
          currentProject: 2
        }
      };

      let result = ProjectModule.getCurrentPublished(state);
      expect(ProjectModule.getPublishedProjects).toHaveBeenCalled();
      expect(ProjectModule.parseProjectForViewMode).not.toHaveBeenCalled();
      expect(result).toEqual(undefined);

      state.projects.currentProject = 1;
      result = ProjectModule.getCurrentPublished(state);
      expect(ProjectModule.getPublishedProjects).toHaveBeenCalled();
      expect(ProjectModule.parseProjectForViewMode).toHaveBeenCalled();
      expect(result).toEqual(1);
    });

    test('getCurrentDraft', () => {
      jest.spyOn(ProjectModule, 'getDraftedProjects').mockReturnValue([{ id: 1 }]);
      jest.spyOn(ProjectModule, 'getPublishedProjects').mockReturnValue([{ id: 1 }]);
      const state = {
        projects: {
          currentProject: 2
        }
      };
      let result = ProjectModule.getCurrentDraft(state);
      expect(ProjectModule.getDraftedProjects).toHaveBeenCalled();
      expect(ProjectModule.getPublishedProjects).not.toHaveBeenCalled();
      expect(result).toEqual(undefined);

      state.projects.currentProject = 1;
      result = ProjectModule.getCurrentDraft(state);
      expect(ProjectModule.getDraftedProjects).toHaveBeenCalled();
      expect(ProjectModule.getPublishedProjects).toHaveBeenCalled();

      expect(result).toEqual({ id: 1, hasPublishedVersion: true });
    });

    test('getCurrentDraftInViewMode', () => {
      const draftSpy = jest.spyOn(ProjectModule, 'getCurrentDraft').mockReturnValue(undefined);
      jest.spyOn(ProjectModule, 'parseProjectForViewMode').mockReturnValue(1);

      let result = ProjectModule.getCurrentDraftInViewMode({});
      expect(ProjectModule.getCurrentDraft).toHaveBeenCalled();
      expect(ProjectModule.parseProjectForViewMode).not.toHaveBeenCalled();
      expect(result).toEqual(undefined);

      draftSpy.mockReturnValue([{ id: 1 }]);

      result = ProjectModule.getCurrentDraftInViewMode({});
      expect(ProjectModule.getCurrentDraft).toHaveBeenCalled();
      expect(ProjectModule.parseProjectForViewMode).toHaveBeenCalled();
      expect(result).toEqual(1);
    });

    test('getStoredCountryFields', () => {
      const draftSpy = jest.spyOn(ProjectModule, 'getCurrentDraft').mockReturnValue({ fields: 1 });
      jest.spyOn(ProjectModule, 'getCurrentPublished').mockReturnValue({ fields: 1 });
      const state = {
        projects: {
          list: [{ id: -1, draft: { fields: 2 } }]
        }
      };

      let result = ProjectModule.getStoredCountryFields(state)(true);
      expect(result).toEqual(1);
      expect(ProjectModule.getCurrentDraft).toHaveBeenCalled();
      expect(ProjectModule.getCurrentPublished).not.toHaveBeenCalled();

      ProjectModule.getCurrentDraft.mockClear();

      result = ProjectModule.getStoredCountryFields(state)(false);
      expect(result).toEqual(1);
      expect(ProjectModule.getCurrentDraft).not.toHaveBeenCalled();
      expect(ProjectModule.getCurrentPublished).toHaveBeenCalled();

      ProjectModule.getCurrentPublished.mockClear();

      draftSpy.mockReturnValue(undefined);
      result = ProjectModule.getStoredCountryFields(state)(true);
      expect(result).toEqual(2);
      expect(ProjectModule.getCurrentDraft).toHaveBeenCalled();
      expect(ProjectModule.getCurrentPublished).not.toHaveBeenCalled();
    });

    test('getProjectCountryFields', () => {
      jest.spyOn(CountryModule, 'getCountryFields').mockReturnValue([{ id: 1, answer: 1 }, { id: 2, answer: 1 }]);
      jest.spyOn(ProjectModule, 'convertCountryFieldsAnswer').mockReturnValue([{ schema_id: 1, answer: 2 }]);
      jest.spyOn(ProjectModule, 'getStoredCountryFields').mockReturnValue(() => {});

      const result = ProjectModule.getProjectCountryFields({})(true);
      expect(CountryModule.getCountryFields).toHaveBeenCalled();
      expect(ProjectModule.convertCountryFieldsAnswer).toHaveBeenCalled();
      expect(ProjectModule.getStoredCountryFields).toHaveBeenCalled();

      expect(result).toEqual([{ id: 1, answer: 2 }, { id: 2, answer: 1 }]);
    });

    test('getCurrentProjectForEditing', () => {
      const data = {
        start_date: 1,
        end_date: 1,
        implementation_dates: 1,
        organisation: 1,
        organisation_name: 2
      };
      jest.spyOn(ProjectModule, 'getFlatProjectStructure').mockReturnValue(undefined);
      jest.spyOn(ProjectModule, 'getVanillaProject').mockReturnValue(data);
      jest.spyOn(ProjectModule, 'isMemberOrViewer').mockReturnValue(undefined);
      jest.spyOn(ProjectUtils, 'convertDate').mockReturnValue(undefined);
      jest.spyOn(ProjectUtils, 'convertStringArrayToObjectArray').mockReturnValue(undefined);
      jest.spyOn(ProjectUtils, 'fillEmptyCollectionsWithDefault').mockReturnValue(data);
      jest.spyOn(ProjectUtils, 'convertIdArrayToObjectArray').mockReturnValue(data);
      jest.spyOn(ProjectUtils, 'handleInteroperabilityLinks').mockReturnValue(undefined);
      jest.spyOn(ProjectUtils, 'setCoverageType').mockReturnValue(undefined);

      let result = ProjectModule.getCurrentProjectForEditing({}, data);
      expect(ProjectModule.getFlatProjectStructure).toHaveBeenCalled();
      expect(ProjectModule.getVanillaProject).not.toHaveBeenCalled();
      expect(ProjectUtils.convertDate).toHaveBeenCalled();
      expect(ProjectUtils.convertStringArrayToObjectArray).toHaveBeenCalled();
      expect(ProjectUtils.fillEmptyCollectionsWithDefault).toHaveBeenCalled();
      expect(ProjectUtils.convertIdArrayToObjectArray).toHaveBeenCalled();
      expect(ProjectUtils.handleInteroperabilityLinks).toHaveBeenCalled();
      expect(result).toEqual({ ...project_definition, ...data, coverageType: undefined });

      result = ProjectModule.getCurrentProjectForEditing({});
      expect(ProjectModule.getFlatProjectStructure).toHaveBeenCalled();
      expect(ProjectModule.getVanillaProject).toHaveBeenCalled();
      expect(ProjectUtils.convertDate).toHaveBeenCalled();
      expect(ProjectUtils.convertStringArrayToObjectArray).toHaveBeenCalled();
      expect(ProjectUtils.fillEmptyCollectionsWithDefault).toHaveBeenCalled();
      expect(ProjectUtils.convertIdArrayToObjectArray).toHaveBeenCalled();
      expect(ProjectUtils.handleInteroperabilityLinks).toHaveBeenCalled();
      expect(result).toEqual({ ...project_definition, ...data, coverageType: undefined });
    });

    test('getCurrentPublishedProjectForEditing', () => {
      jest.spyOn(ProjectModule, 'getPublishedProjects').mockReturnValue([{ id: 1 }]);
      jest.spyOn(ProjectModule, 'getCurrentProjectForEditing').mockReturnValue(1);
      const state = {
        projects: {
          currentProject: 2
        }
      };

      let result = ProjectModule.getCurrentPublishedProjectForEditing(state);
      expect(ProjectModule.getPublishedProjects).toHaveBeenCalled();
      expect(ProjectModule.getCurrentProjectForEditing).not.toHaveBeenCalled();
      expect(result).toEqual(undefined);

      state.projects.currentProject = 1;

      result = ProjectModule.getCurrentPublishedProjectForEditing(state);
      expect(ProjectModule.getPublishedProjects).toHaveBeenCalled();
      expect(ProjectModule.getCurrentProjectForEditing).toHaveBeenCalledWith(state, { id: 1 });
      expect(result).toEqual(1);
    });

    test('getCurrentDraftProjectForEditing', () => {
      jest.spyOn(ProjectModule, 'getCurrentProjectForEditing').mockReturnValue(1);
      jest.spyOn(ProjectModule, 'getCurrentDraft').mockReturnValue(1);
      jest.spyOn(ProjectModule, 'getCurrentEdits').mockReturnValue({});
      const result = ProjectModule.getCurrentDraftProjectForEditing({});
      expect(result).toEqual(1);
      expect(ProjectModule.getCurrentDraft).toHaveBeenCalled();
      expect(ProjectModule.getCurrentProjectForEditing).toHaveBeenCalledWith({}, {});
    });

    test('getTeam', () => {
      const state = {
        projects: {
          teamViewers: {
            team: [1]
          }
        },
        system: {
          profiles: [{ id: 1, name: 2 }]
        }
      };
      let result = ProjectModule.getTeam(state);
      expect(result).toEqual([{ id: 1, name: 2 }]);

      state.projects = {};
      result = ProjectModule.getTeam(state);
      expect(result).toEqual([]);
    });

    test('getViewers', () => {
      const state = {
        projects: {
          teamViewers: {
            viewers: [1]
          }
        },
        system: {
          profiles: [{ id: 1, name: 2 }]
        }
      };
      let result = ProjectModule.getViewers(state);
      expect(result).toEqual([{ id: 1, name: 2 }]);

      state.projects = {};
      result = ProjectModule.getViewers(state);
      expect(result).toEqual([]);
    });

    test('getToolkitVersion', () => {
      const state = {
        projects: {
          toolkitVersions: [1]
        }
      };
      let result = ProjectModule.getToolkitVersion(state);
      expect(result).toEqual(state.projects.toolkitVersions);
      expect(result).not.toBe(state.projects.toolkitVersions);

      state.projects = {};
      result = ProjectModule.getToolkitVersion(state);
      expect(result).toEqual([]);
    });
    test('getCoverageVersion', () => {
      const state = {
        projects: {
          coverageVersions: [1]
        }
      };
      let result = ProjectModule.getCoverageVersion(state);
      expect(result).toEqual(state.projects.coverageVersions);
      expect(result).not.toBe(state.projects.coverageVersions);

      state.projects = {};
      result = ProjectModule.getCoverageVersion(state);
      expect(result).toEqual([]);
    });

    test('getCurrentVersion', () => {
      const state = {
        projects: {
          toolkitVersions: [1]
        }
      };
      const result = ProjectModule.getCurrentVersion(state);
      expect(result).toBe(1);
    });

    test('getCurrentVersionDate', () => {
      const spy = jest.spyOn(ProjectModule, 'getToolkitVersion').mockReturnValue([]);

      let result = ProjectModule.getCurrentVersionDate({});
      expect(result).toEqual(null);

      spy.mockReturnValue([{ modified: 1 }, { modified: 2 }]);

      result = ProjectModule.getCurrentVersionDate({});
      expect(result).toEqual(2);
    });

    test('getMapsAxisData', () => {
      jest.spyOn(SystemModule, 'getAxis').mockReturnValue([{ name: 'ax' }]);
      const tv = jest.spyOn(ProjectModule, 'getToolkitVersion').mockReturnValue([]);
      const td = jest.spyOn(ToolkitModule, 'getToolkitData').mockReturnValue([]);
      jest.spyOn(ProjectUtils, 'getTodayString').mockReturnValue(1);
      const data = [
        { axis_score: 100 },
        { axis_score: 90 },
        { axis_score: 80 },
        { axis_score: 70 },
        { axis_score: 60 },
        { axis_score: 50 }
      ];

      let result = ProjectModule.getMapsAxisData({});
      expect(result).toEqual({ labels: ['ax'], data: [] });

      expect(SystemModule.getAxis).toHaveBeenCalled();
      expect(ProjectModule.getToolkitVersion).toHaveBeenCalled();
      expect(ToolkitModule.getToolkitData).toHaveBeenCalled();
      expect(ProjectUtils.getTodayString).toHaveBeenCalled();

      tv.mockReturnValue([{
        modified: '1T2',
        data
      }]);

      result = ProjectModule.getMapsAxisData({});
      expect(SystemModule.getAxis).toHaveBeenCalled();
      expect(ProjectModule.getToolkitVersion).toHaveBeenCalled();
      expect(ToolkitModule.getToolkitData).toHaveBeenCalled();
      expect(ProjectUtils.getTodayString).toHaveBeenCalled();
      expect(result).toEqual({ labels: ['ax'],
        data: [
          {
            date: '1',
            axis1: 1,
            axis2: 0.9,
            axis3: 0.8,
            axis4: 0.7,
            axis5: 0.6,
            axis6: 0.5
          }
        ] });

      tv.mockReturnValue([]);
      td.mockReturnValue(data);
      result = ProjectModule.getMapsAxisData({});
      expect(SystemModule.getAxis).toHaveBeenCalled();
      expect(ProjectModule.getToolkitVersion).toHaveBeenCalled();
      expect(ToolkitModule.getToolkitData).toHaveBeenCalled();
      expect(ProjectUtils.getTodayString).toHaveBeenCalled();
      expect(result).toEqual({ labels: ['ax'],
        data: [
          {
            date: 1,
            axis1: 1,
            axis2: 0.9,
            axis3: 0.8,
            axis4: 0.7,
            axis5: 0.6,
            axis6: 0.5
          }
        ] });
    });

    test('getMapsDomainData', () => {
      jest.spyOn(SystemModule, 'getAxis').mockReturnValue([{ name: 'ax', id: 1 }]);
      jest.spyOn(SystemModule, 'getDomains').mockReturnValue([{ name: 'dm', axis: 1 }]);
      const tv = jest.spyOn(ProjectModule, 'getToolkitVersion').mockReturnValue([]);
      const td = jest.spyOn(ToolkitModule, 'getToolkitData').mockReturnValue([]);
      jest.spyOn(ProjectUtils, 'getTodayString').mockReturnValue(1);

      const data = [
        { domain_percentage: 100 },
        { domain_percentage: 90 },
        { domain_percentage: 80 },
        { domain_percentage: 70 },
        { domain_percentage: 60 },
        { domain_percentage: 50 }
      ];

      let result = ProjectModule.getMapsDomainData({});
      expect(SystemModule.getAxis).toHaveBeenCalled();
      expect(SystemModule.getDomains).toHaveBeenCalled();
      expect(ProjectModule.getToolkitVersion).toHaveBeenCalled();
      expect(ToolkitModule.getToolkitData).toHaveBeenCalled();
      expect(ProjectUtils.getTodayString).toHaveBeenCalled();

      expect(result).toEqual({
        labels: ['ax'],
        ax: {
          data: [],
          labels: ['dm']
        }
      });

      tv.mockReturnValue([
        {
          modified: '1T2',
          data: [
            {
              domains: data

            }
          ]
        }
      ]);

      result = ProjectModule.getMapsDomainData({});
      expect(SystemModule.getAxis).toHaveBeenCalled();
      expect(SystemModule.getDomains).toHaveBeenCalled();
      expect(ProjectModule.getToolkitVersion).toHaveBeenCalled();
      expect(ToolkitModule.getToolkitData).toHaveBeenCalled();
      expect(ProjectUtils.getTodayString).toHaveBeenCalled();

      expect(result).toEqual({
        labels: ['ax'],
        ax: {
          data: [{
            date: '1',
            axis1: 1,
            axis2: 0.9,
            axis3: 0.8,
            axis4: 0.7,
            axis5: 0.6,
            axis6: 0.5
          }],
          labels: ['dm']
        }
      });

      tv.mockReturnValue([]);
      td.mockReturnValue([
        {
          domains: data
        }
      ]);

      result = ProjectModule.getMapsDomainData({});
      expect(SystemModule.getAxis).toHaveBeenCalled();
      expect(SystemModule.getDomains).toHaveBeenCalled();
      expect(ProjectModule.getToolkitVersion).toHaveBeenCalled();
      expect(ToolkitModule.getToolkitData).toHaveBeenCalled();
      expect(ProjectUtils.getTodayString).toHaveBeenCalled();

      expect(result).toEqual({
        labels: ['ax'],
        ax: {
          data: [{
            date: 1,
            axis1: 1,
            axis2: 0.9,
            axis3: 0.8,
            axis4: 0.7,
            axis5: 0.6,
            axis6: 0.5
          }],
          labels: ['dm']
        }
      });
    });

    test('getCoverageData', () => {
      jest.spyOn(ProjectModule, 'getCoverageVersion').mockReturnValue([{
        data: [
          {
            clients: 1
          }
        ]
      }
      ]);
      jest.spyOn(ProjectModule, 'getCurrentProject').mockReturnValue({ national_level_deployment: {} });
      jest.spyOn(ProjectUtils, 'getTodayString').mockReturnValue(1);
      const result = ProjectModule.getCoverageData({});
      expect(result).toEqual({ labels: [], data: [{ date: 1, axis1: 1 }, { date: 1 }] });
    });

    test('getSimilarProject', () => {
      jest.spyOn(ProjectModule, 'getPublishedProjects').mockReturnValue([{ id: 1 }]);
      const state = {
        projects: {
          similarProjectNames: undefined
        }
      };

      let result = ProjectModule.getSimilarProject(state);
      expect(result).toEqual([]);

      state.projects.similarProjectNames = [{ id: 1, name: 1 }, { id: 2, name: 2 }];
      result = ProjectModule.getSimilarProject(state);
      expect(result).toEqual([{ id: 1, name: 1, isOwn: true }, { id: 2, name: 2, isOwn: false }]);
    });

    test('checkCurrentProjectValidity', () => {
      const state = {
        projects: {}
      };
      let result = ProjectModule.checkCurrentProjectValidity(state);
      expect(result.isValid).toBe(true);

      state.projects.currentPublicProject = {};
      result = ProjectModule.checkCurrentProjectValidity(state);
      expect(result.isValid).toBe(true);

      state.projects.currentPublicProject.public_id = '';
      result = ProjectModule.checkCurrentProjectValidity(state);
      expect(result.isValid).toBe(true);

      state.projects.currentPublicProject.draft = '';
      result = ProjectModule.checkCurrentProjectValidity(state);
      expect(result.isValid).toBe(true);

      state.projects.currentPublicProject.draft = null;
      state.projects.currentPublicProject.id = 1;
      result = ProjectModule.checkCurrentProjectValidity(state);
      expect(result).toEqual({ isValid: false, id: 1 });
    });
  });

  describe('ACTIONS', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    test('loadUserProjects', A(async () => {
      const spy = jest.spyOn(ProjectModule, 'getSavedProjectList').mockReturnValue([]);

      jest.spyOn(axios, 'get').mockReturnValue({ data: [{ id: 1 }, { id: 2 }] });
      const state = {
        user: {
        }
      };
      await ProjectModule.loadUserProjects()(dispatch, getState(state));
      expect(ProjectModule.getSavedProjectList).not.toHaveBeenCalled();
      expect(axios.get).not.toHaveBeenCalled();

      state.user.profile = {};
      await ProjectModule.loadUserProjects()(dispatch, getState(state));
      expect(ProjectModule.getSavedProjectList).toHaveBeenCalled();
      expect(axios.get).not.toHaveBeenCalled();

      spy.mockReturnValue(undefined);
      await ProjectModule.loadUserProjects()(dispatch, getState(state));
      expect(ProjectModule.getSavedProjectList).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith('/api/projects/member-of/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PROJECT_LIST', projects: [{ id: 2 }, { id: 1 }] });

      spy.mockImplementation(() => {
        throw new Error('error');
      });
      jest.spyOn(console, 'log').mockImplementation(() => {});

      try {
        await ProjectModule.loadUserProjects()(dispatch, getState(state));
      } catch (e) {
        expect(console.log).toHaveBeenCalledWith(e);
        expect('' + e).toBe('Error: error');
      }
    }));

    test('loadProjectDetails', A(async () => {
      const spy = jest.spyOn(axios, 'get').mockReturnValue(defaultAxiosSuccess);
      const state = {
        projects: {
          currentProject: null
        }
      };

      dispatch.mockClear();
      spy.mockClear();

      await ProjectModule.loadProjectDetails()(dispatch, getState(state));
      expect(dispatch).not.toHaveBeenCalled();
      expect(axios.get).not.toHaveBeenCalled();

      state.projects.currentProject = -1;
      dispatch.mockClear();
      await ProjectModule.loadProjectDetails()(dispatch, getState(state));
      expect(dispatch).not.toHaveBeenCalled();
      expect(axios.get).not.toHaveBeenCalled();

      state.projects.currentProject = 2;
      await ProjectModule.loadProjectDetails()(dispatch, getState(state));
      expect(axios.get).toHaveBeenCalledWith('/api/projects/2/toolkit/versions/');
      expect(axios.get).toHaveBeenCalledWith('/api/projects/2/coverage/versions/');
      expect(axios.get).toHaveBeenCalledWith('/api/projects/2/groups/');
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SET_PROJECT_INFO',
        info: {
          toolkitVersions: 1,
          coverageVersions: 1
        }
      });
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PROJECT_TEAM_VIEWERS', teamViewers: 1 });

      spy.mockImplementation(() => { throw new Error('error'); });
      jest.spyOn(console, 'log').mockImplementation(() => {});
      try {
        await ProjectModule.loadProjectDetails()(dispatch, getState(state));
      } catch (e) {
        expect(console.log).toHaveBeenCalledWith(e);
        expect('' + e).toEqual('Error: error');
      }
    }));

    test('setCurrentProject', A(async () => {
      const state = {
        projects: {
          currentProject: 1
        }
      };
      const spy = jest.spyOn(ProjectModule, 'getCurrentProjectIfExist').mockReturnValue(undefined);
      jest.spyOn(CountryModule, 'setCurrentCountry');
      jest.spyOn(ProjectModule, 'loadProjectDetails');
      jest.spyOn(ToolkitModule, 'loadToolkitData');
      jest.spyOn(UserModule, 'getProfile').mockReturnValue({});
      jest.spyOn(axios, 'get').mockReturnValue(defaultAxiosSuccess);
      dispatch.mockClear();
      await ProjectModule.setCurrentProject()(dispatch, getState(state));
      expect(dispatch).not.toHaveBeenCalled();

      await ProjectModule.setCurrentProject(1)(dispatch, getState(state));
      expect(dispatch).not.toHaveBeenCalled();

      await ProjectModule.setCurrentProject(-1)(dispatch, getState(state));
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_CURRENT_PROJECT', id: -1 });
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PROJECT_TEAM_VIEWERS',
        teamViewers: { team: [], viewers: [] } });
      expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_SAVE_PROJECT', project: jasmine.any(Object) });

      dispatch.mockClear();
      await ProjectModule.setCurrentProject(2)(dispatch, getState(state));
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_CURRENT_PROJECT', id: 2 });
      expect(ProjectModule.getCurrentProjectIfExist).toHaveBeenCalled();
      expect(CountryModule.setCurrentCountry).not.toHaveBeenCalled();
      expect(ProjectModule.loadProjectDetails).not.toHaveBeenCalled();
      expect(ToolkitModule.loadToolkitData).not.toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith('/api/projects/2/');
      expect(axios.get).toHaveBeenCalledWith('/api/projects/2/groups/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PROJECT_TEAM_VIEWERS', teamViewers: 1 });
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_CURRENT_PUBLIC_PROJECT_DETAIL', project: 1 });

      dispatch.mockClear();
      axios.get.mockClear();
      spy.mockReturnValue(1);

      await ProjectModule.setCurrentProject(2)(dispatch, getState(state));
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_CURRENT_PROJECT', id: 2 });
      expect(ProjectModule.getCurrentProjectIfExist).toHaveBeenCalled();
      expect(CountryModule.setCurrentCountry).toHaveBeenCalled();
      expect(ProjectModule.loadProjectDetails).toHaveBeenCalled();
      expect(ToolkitModule.loadToolkitData).toHaveBeenCalled();
      expect(axios.get).not.toHaveBeenCalled();
    }));

    test('snapShotProject', A(async () => {
      jest.spyOn(ProjectModule, 'loadProjectDetails');
      jest.spyOn(axios, 'post').mockReturnValue(defaultAxiosSuccess);
      const state = {
        projects: {
          currentProject: 1
        }
      };
      dispatch.mockClear();
      await ProjectModule.snapShotProject()(dispatch, getState(state));
      expect(axios.post).toHaveBeenCalledWith('/api/projects/1/version/');
      expect(dispatch).toHaveBeenCalled();
      expect(ProjectModule.loadProjectDetails).toHaveBeenCalled();
    }));

    test('loadProjectStructure', A(async () => {
      jest.spyOn(axios, 'get').mockReturnValue(defaultAxiosSuccess);
      const spy = jest.spyOn(ProjectModule, 'getProjectStructure').mockReturnValue({ id: 1 });
      dispatch.mockClear();
      await ProjectModule.loadProjectStructure()(dispatch, getState({}));
      expect(axios.get).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();

      spy.mockReturnValue({});
      await ProjectModule.loadProjectStructure()(dispatch, getState({}));
      expect(axios.get).toHaveBeenCalledWith('/api/projects/structure/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PROJECT_STRUCTURE', structure: 1 });
    }));

    test('saveTeamViewers', A(async () => {
      jest.spyOn(axios, 'put').mockReturnValue(defaultAxiosSuccess);
      const result = await ProjectModule.saveTeamViewers({ id: 1 }, [{ id: 1 }], [{ id: 2 }]);
      expect(axios.put).toHaveBeenCalledWith('/api/projects/1/groups/', { team: [1], viewers: [2] });
      expect(result).toEqual({ team: [1], viewers: [2] });
    }));

    test('saveCountryFields', A(async () => {
      const spy = jest.spyOn(axios, 'post').mockReturnValue({ data: { fields: 1 } });
      const fields = [{ country: 1, answer: 1, type: 1, question: 1, project: 1, gibberish: 2 }];
      let result = await ProjectModule.saveCountryFields(fields, 1, 2, 'published');
      expect(result).toEqual(1);
      expect(axios.post).toHaveBeenCalledWith('/api/country-fields/1/2/publish/',
        { fields: [{ country: 1, answer: 1, type: 1, question: 1, project: 2 }] });

      result = await ProjectModule.saveCountryFields(fields, 1, 2, 'asd');
      expect(result).toEqual(1);
      expect(axios.post).toHaveBeenCalledWith('/api/country-fields/1/2/draft/',
        { fields: [{ country: 1, answer: 1, type: 1, question: 1, project: 2 }] });

      spy.mockImplementation(() => {
        throw new Error('error');
      });
      jest.spyOn(console, 'log').mockImplementation(() => {});
      result = await ProjectModule.saveCountryFields(fields, 1, 2, 'asd');
      expect(result).toEqual(false);
    }));
  });

  describe('REDUCERS', () => {
    test('SET_PROJECT_LIST', () => {
      let state = {};
      const action = { type: 'SET_PROJECT_LIST', projects: [1] };
      state = ProjectModule.default(state, action);
      expect(state.list).toEqual(action.projects);
      expect(state.list).not.toBe([action.projects]);
    });

    test('SET_SIMILAR_NAME_LIST', () => {
      let state = {};
      const action = { type: 'SET_SIMILAR_NAME_LIST', list: [1] };
      state = ProjectModule.default(state, action);
      expect(state.similarProjectNames).toEqual(action.list);
      expect(state.similarProjectNames).not.toBe([action.list]);
    });

    test('UPDATE_SAVE_PROJECT', () => {
      let state = {
        list: [{
          id: 1
        }]
      };
      const action = { type: 'UPDATE_SAVE_PROJECT', projectId: 1, project: { id: 1, name: 2 } };
      state = ProjectModule.default(state, action);
      expect(state.list).toEqual([{ id: 1, name: 2 }]);

      state.list = [{ id: 2 }];

      state = ProjectModule.default(state, action);
      expect(state.list).toEqual([{ id: 2 }, { id: 1, name: 2 }]);
    });

    test('UPDATE_COUNTRY_FIELD_ANSWER', () => {
      let state = {
        list: [{
          id: 1,
          draft: {
            fields: []
          }
        }]
      };
      let action = { type: 'UPDATE_COUNTRY_FIELD_ANSWER', countryField: { schema_id: 1 }, projectId: 1 };
      state = ProjectModule.default(state, action);
      expect(state.list).toEqual([{ id: 1, draft: { fields: [{ schema_id: 1 }] } }]);

      action = { type: 'UPDATE_COUNTRY_FIELD_ANSWER', countryField: { schema_id: 1, name: 1 }, projectId: 1 };
      state = ProjectModule.default(state, action);
      expect(state.list).toEqual([{ id: 1, draft: { fields: [{ schema_id: 1, name: 1 }] } }]);
    });

    test('SET_CURRENT_PROJECT', () => {
      let state = {};
      const action = { type: 'SET_CURRENT_PROJECT', id: 1 };
      state = ProjectModule.default(state, action);
      expect(state.currentProject).toEqual(1);
    });

    test('SET_CURRENT_PUBLIC_PROJECT_DETAIL', () => {
      let state = {};
      const action = { type: 'SET_CURRENT_PUBLIC_PROJECT_DETAIL', project: 1 };
      state = ProjectModule.default(state, action);
      expect(state.currentPublicProject).toEqual(1);
    });

    test('SET_PROJECT_STRUCTURE', () => {
      let state = {};
      const action = { type: 'SET_PROJECT_STRUCTURE', structure: 1 };
      state = ProjectModule.default(state, action);
      expect(state.structure).toEqual(1);
    });

    test('SET_PROJECT_INFO', () => {
      let state = {};
      const action = {
        type: 'SET_PROJECT_INFO',
        info: {
          toolkitVersions: 1,
          coverageVersions: 2,
          teamViewers: 3
        }
      };
      state = ProjectModule.default(state, action);
      expect(state.toolkitVersions).toEqual(1);
      expect(state.coverageVersions).toEqual(2);
      expect(state.teamViewers).toEqual(3);
    });

    test('SET_PROJECT_TEAM_VIEWERS', () => {
      let state = {};
      const action = { type: 'SET_PROJECT_TEAM_VIEWERS', teamViewers: 1 };
      state = ProjectModule.default(state, action);
      expect(state.teamViewers).toEqual(1);
    });

    test('CLEAR_USER_PROJECTS', () => {
      let state = { structure: 1, a: 2, b: 2 };
      const action = { type: 'CLEAR_USER_PROJECTS' };
      state = ProjectModule.default(state, action);
      expect(state).toEqual({ structure: 1 });
    });
  });
});
