import * as ProjectModule from '../../src/store/modules/projects';
import * as UserModule from '../../src/store/modules/user';
import * as CountryModule from '../../src/store/modules/countries';
import * as ProjectUtils from '../../src/store/project_utils';
import { project_definition } from '../../src/store/static_data/project_definition';
import { A, defaultAxiosSuccess, dispatch, getState } from '../testUtilities';
import axios from '../../src/plugins/axios';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise, FormData */

describe('Project Store Module', () => {

    describe('GETTERS', () => {

        it('isMemberOrViewer', () => {
            const spy = spyOn(UserModule, 'getProfile').and.returnValue({});
            let result = ProjectModule.isMemberOrViewer({}, 1);
            expect(UserModule.getProfile).toHaveBeenCalled();
            expect(result.isMember).toBe(false);
            expect(result.isViewer).toBe(false);
            expect(result.isTeam).toBe(false);


            spy.and.returnValue({ member: [] });
            result = ProjectModule.isMemberOrViewer({}, { id: 1 });
            expect(UserModule.getProfile).toHaveBeenCalled();
            expect(result.isMember).toBe(false);
            expect(result.isViewer).toBe(false);
            expect(result.isTeam).toBe(false);

            spy.and.returnValue({ member: [], viewer: [] });
            result = ProjectModule.isMemberOrViewer({}, { id: 1 });
            expect(UserModule.getProfile).toHaveBeenCalled();
            expect(result.isMember).toBe(false);
            expect(result.isViewer).toBe(false);
            expect(result.isTeam).toBe(false);


            spy.and.returnValue({ member: [1], viewer: [] });
            result = ProjectModule.isMemberOrViewer({}, { id: 1 });
            expect(UserModule.getProfile).toHaveBeenCalled();
            expect(result.isMember).toBe(true);
            expect(result.isViewer).toBe(false);
            expect(result.isTeam).toBe(true);


            spy.and.returnValue({ member: [0], viewer: [1] });
            result = ProjectModule.isMemberOrViewer({}, { id: 1 });
            expect(UserModule.getProfile).toHaveBeenCalled();
            expect(result.isMember).toBe(false);
            expect(result.isViewer).toBe(true);
            expect(result.isTeam).toBe(true);

        });

        it('getCurrentProjectId', () => {
            const state = {
                projects: {
                    currentProject: 1
                }
            };
            const result = ProjectModule.getCurrentProjectId(state);
            expect(result).toBe(1);
        });

        it('getLastVersion', () => {
            const state = {
                projects: {
                    lastVersion: 1
                }
            };
            const result = ProjectModule.getLastVersion(state);
            expect(result).toBe(1);
        });

        it('getSavedProjectList', () => {
            spyOn(ProjectModule, 'getVanillaProject');
            const state = {
                projects: {}
            };

            let result = ProjectModule.getSavedProjectList(state);
            expect(result).toBe(undefined);

            state.projects.list = [{ id: -1 }, { id: 1 }];
            result = ProjectModule.getSavedProjectList(state);
            expect(result).toEqual([{ id: 1, draft: { donors: [], implementing_partners: [] } }]);
            expect(ProjectModule.getVanillaProject).toHaveBeenCalled();

        });

        it('getPublishedProjects', () => {
            const list = [{ published: { id: 2 } }, { published: { id: 1 } }];
            spyOn(ProjectModule, 'getSavedProjectList').and.returnValue(list);
            spyOn(ProjectModule, 'isMemberOrViewer');
            const state = {
                projects: {}
            };
            let result = ProjectModule.getPublishedProjects(state);
            expect(result).toEqual([]);

            state.projects.list = list;
            result = ProjectModule.getPublishedProjects(state);
            expect(ProjectModule.getSavedProjectList).toHaveBeenCalled();
            expect(ProjectModule.isMemberOrViewer).toHaveBeenCalledTimes(2);

            expect(result[0].id).toBe(1);

        });

        it('getDraftedProjects', () => {
            const list = [{ draft: { id: 2 } }, { draft: { id: 1 } }];
            spyOn(ProjectModule, 'getSavedProjectList').and.returnValue(list);
            spyOn(ProjectModule, 'isMemberOrViewer');
            const state = {
                projects: {}
            };
            let result = ProjectModule.getDraftedProjects(state);
            expect(result).toEqual([]);

            state.projects.list = list;
            result = ProjectModule.getDraftedProjects(state);
            expect(ProjectModule.getSavedProjectList).toHaveBeenCalled();
            expect(ProjectModule.isMemberOrViewer).toHaveBeenCalledTimes(2);

            expect(result[0].id).toBe(1);

        });

        it('getFlatProjectStructure', () => {
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

        it('getProjectStructure', () => {
            const state = {
                projects: {
                    structure: {
                        id: 1
                    }
                }
            };

            const result = ProjectModule.getProjectStructure(state);
            expect(result).toEqual(state.projects.structure);
            expect(result).not.toBe(state.projects.structure);

        });

        it('getUserProjects', () => {
            const list = [{ draft: { id: 1 } }, { published: { id: 2 }, public_id: 1 }];
            spyOn(ProjectModule, 'getFlatProjectStructure');
            spyOn(ProjectModule, 'getSavedProjectList').and.returnValue(list);
            spyOn(ProjectModule, 'isMemberOrViewer').and.returnValue(list);
            spyOn(ProjectUtils, 'convertIdArrayToObjectArray');
            spyOn(CountryModule, 'getCountry').and.returnValue({ name : 1 });
            const state = {
                projects: {}
            };
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

        it('getUserDefaultProject', () => {
            const spy = spyOn(ProjectModule, 'getUserProjects');
            let result = ProjectModule.getUserDefaultProject();
            expect(result).toEqual(null);

            result = ProjectModule.getUserDefaultProject({});
            expect(result).toEqual(null);
            expect(ProjectModule.getUserProjects).toHaveBeenCalled();

            spy.and.returnValue([]);

            result = ProjectModule.getUserDefaultProject({});
            expect(result).toEqual(null);
            expect(ProjectModule.getUserProjects).toHaveBeenCalled();

            spy.and.returnValue([{ id: 1 }]);

            result = ProjectModule.getUserDefaultProject({});
            expect(result).toEqual('1');
            expect(ProjectModule.getUserProjects).toHaveBeenCalled();

        });

        it('getEmptyProject', () => {
            const result = ProjectModule.getEmptyProject();
            expect(result).toEqual(project_definition);
            expect(result).not.toBe(project_definition);
        });

        it('getVanillaProject', () => {
            spyOn(ProjectModule, 'getEmptyProject').and.returnValue({ id: 1 });
            const structureSpy = spyOn(ProjectModule, 'getProjectStructure');
            const countrySpy = spyOn(CountryModule, 'getUserCountry');
            const profileSpy = spyOn(UserModule, 'getProfile');

            let result = ProjectModule.getVanillaProject({});
            expect(result).toEqual({ id: 1, organisation: null });

            countrySpy.and.returnValue({ id: 1 });
            result = ProjectModule.getVanillaProject({});
            expect(result).toEqual({ id: 1, organisation: null, country: 1 });

            structureSpy.and.returnValue({ interoperability_links: 1 });
            result = ProjectModule.getVanillaProject({});
            expect(result).toEqual({ id: 1, organisation: null, country: 1, interoperability_links: 1 });

            profileSpy.and.returnValue({ organisation: 1 });
            result = ProjectModule.getVanillaProject({});
            expect(result).toEqual({ id: 1, organisation: 1, country: 1, interoperability_links: 1 });
        });

        it('getCurrentProjectIfExist', () => {
            spyOn(ProjectModule, 'getUserProjects').and.returnValue([{ id: 1 }, { id: 2 }]);
            const state = {
                projects: {
                    currentProject: 1
                }
            };
            const result = ProjectModule.getCurrentProjectIfExist(state);
            expect(result.id).toBe(1);
        });

        it('getCurrentProject', () => {
            const currentSpy = spyOn(ProjectModule, 'getCurrentProjectIfExist');
            spyOn(ProjectModule, 'getVanillaProject').and.returnValue({ id: 1 });
            let result = ProjectModule.getCurrentProject({});
            expect(result).toEqual({ id: 1 });
            expect(ProjectModule.getVanillaProject).toHaveBeenCalled();
            expect(ProjectModule.getCurrentProjectIfExist).toHaveBeenCalled();
            ProjectModule.getVanillaProject.calls.reset();

            currentSpy.and.returnValue({ id: 2 });
            result = ProjectModule.getCurrentProject({});
            expect(result).toEqual({ id: 2 });
            expect(ProjectModule.getVanillaProject).not.toHaveBeenCalled();
            expect(ProjectModule.getCurrentProjectIfExist).toHaveBeenCalled();

        });

        it('getCurrentPublicProject', () => {
            spyOn(CountryModule, 'getCountry').and.returnValue({ name : 1 });
            const state = {
                projects: {
                }
            };
            let result = ProjectModule.getCurrentPublicProject(state);
            expect(result).toEqual({ country_name: undefined });

            state.projects.currentPublicProject = {
                published: {
                    id: 1,
                    country: 1
                }
            };

            result = ProjectModule.getCurrentPublicProject(state);
            expect(result).toEqual({ id: 1, country_name: 1, country: 1 });
            expect(result).not.toBe(state.projects.currentPublicProject.published);
        });

        it('convertCountryFieldsAnswer', () => {
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

        it('parseProjectForViewMode', () => {
            spyOn(ProjectModule, 'getFlatProjectStructure');
            spyOn(CountryModule, 'getCountry');
            spyOn(ProjectUtils, 'convertIdArrayToObjectArray');
            spyOn(ProjectUtils, 'setCoverageType');
            const result = ProjectModule.parseProjectForViewMode({}, {});
            expect(ProjectModule.getFlatProjectStructure).toHaveBeenCalled();
            expect(CountryModule.getCountry).toHaveBeenCalled();
            expect(ProjectUtils.convertIdArrayToObjectArray).toHaveBeenCalledTimes(2);
            expect(ProjectUtils.setCoverageType).toHaveBeenCalledTimes(1);
            expect(result.hasPublishedVersion).toBe(true);
        });

        it('getCurrentPublished', () => {
            spyOn(ProjectModule, 'getPublishedProjects').and.returnValue([{ id: 1 }]);
            spyOn(ProjectModule, 'parseProjectForViewMode').and.returnValue(1);
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

        it('getCurrentDraft', () => {
            spyOn(ProjectModule, 'getDraftedProjects').and.returnValue([{ id: 1 }]);
            spyOn(ProjectModule, 'getPublishedProjects').and.returnValue([{ id: 1 }]);
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

        it('getCurrentDraftInViewMode', () => {
            const draftSpy = spyOn(ProjectModule, 'getCurrentDraft');
            spyOn(ProjectModule, 'parseProjectForViewMode').and.returnValue(1);

            let result = ProjectModule.getCurrentDraftInViewMode({});
            expect(ProjectModule.getCurrentDraft).toHaveBeenCalled();
            expect(ProjectModule.parseProjectForViewMode).not.toHaveBeenCalled();
            expect(result).toEqual(undefined);

            draftSpy.and.returnValue([{ id: 1 }]);

            result = ProjectModule.getCurrentDraftInViewMode({});
            expect(ProjectModule.getCurrentDraft).toHaveBeenCalled();
            expect(ProjectModule.parseProjectForViewMode).toHaveBeenCalled();
            expect(result).toEqual(1);

        });

    });

    describe('ACTIONS', () => {


    });

    describe('REDUCERS', () => {

    });

});
