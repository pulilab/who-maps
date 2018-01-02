import * as ProjectModule from '../../src/store/modules/projects';
import * as UserModule from '../../src/store/modules/user';
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
            const state = {
                projects: {}
            };
            let result = ProjectModule.getSavedProjectList(state);
            expect(result).toBe(undefined);

            state.projects.list = [{ id: -1 }, { id: 1 }];
            result = ProjectModule.getSavedProjectList(state);
            expect(result).toEqual([{ id: 1 }]);

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
            const state = {
                projects: {}
            };
            let result = ProjectModule.getUserProjects(state);
            expect(result).toEqual([]);

            state.projects.list = list;
            result = ProjectModule.getUserProjects(state);
            expect(ProjectModule.getFlatProjectStructure).toHaveBeenCalled();
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

    });

    describe('ACTIONS', () => {


    });

    describe('REDUCERS', () => {

    });

});
