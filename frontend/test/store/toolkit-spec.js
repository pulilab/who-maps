import * as ToolkitModule from '../../src/store/modules/toolkit';
import * as ProjectModule from '../../src/store/modules/projects';
import * as SystemModule from '../../src/store/modules/system';
import { A, defaultAxiosSuccess, dispatch, getState } from '../testUtilities';
import axios from '../../src/plugins/axios';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise, console */

describe('TOOLKIT Store Module', () => {
  describe('GETTERS', () => {
    it('getToolkitData', () => {
      const state = {
        toolkit: {
          toolkitData: []
        }
      };
      const result = ToolkitModule.getToolkitData(state);
      expect(result).toEqual([]);
      expect(result).not.toBe(state.toolkit.toolkitData);
    });

    it('getStructure', () => {
      const state = {};
      spyOn(SystemModule, 'getAxis').and.returnValue([{ id: 1 }]);
      spyOn(SystemModule, 'getDomains').and.returnValue([{ axis: 1, id: 1 }]);
      spyOn(SystemModule, 'getQuestions').and.returnValue([{ domain: 1, question_id: 'a' }]);
      const result = ToolkitModule.getStructure(state);
      expect(result[0].domains[0].id).toBe(1);
    });

    it('getDomainStructure', () => {
      const state = {};
      const spy = spyOn(ToolkitModule, 'getStructure');
      let result = ToolkitModule.getDomainStructure(state, 0, 0);
      expect(result).toEqual({});

      spy.and.returnValue([{ domains: [{ id: 1 }] }]);
      result = ToolkitModule.getDomainStructure(state, 0, 0);
      expect(result.id).toBe(1);
    });

    it('getAxisDetail', () => {
      spyOn(SystemModule, 'getAxis').and.returnValue([{ id: 1, a: 1, c: 3 }]);
      spyOn(SystemModule, 'getDomains').and.returnValue([{ id: 1, a: 1, c: 1 }]);
      spyOn(ToolkitModule, 'getToolkitData')
        .and.returnValue([{ id: 1, a: 2, domains: [{ id: 1, b: 2, c: 3 }] }]);
      const result = ToolkitModule.getAxisDetail({}, 1);
      expect(result.a).toBe(2);
      expect(result.c).toBe(3);
      expect(result.domains[0].id).toBe(1);
      expect(result.domains[0].a).toBe(1);
      expect(result.domains[0].b).toBe(2);
      expect(result.domains[0].c).toBe(1);
      expect(SystemModule.getAxis).toHaveBeenCalled();
      expect(SystemModule.getDomains).toHaveBeenCalled();
      expect(ToolkitModule.getToolkitData).toHaveBeenCalled();
    });
  });

  describe('ACTIONS', () => {
    it('loadToolkitData', A(async () => {
      dispatch.calls.reset();
      spyOn(axios, 'get').and.returnValue(defaultAxiosSuccess);
      const state = {
        projects: {
          currentProject: null
        }
      };
      await ToolkitModule.loadToolkitData()(dispatch, getState(state));
      expect(dispatch).not.toHaveBeenCalled();

      state.projects.currentProject = 1;
      await ToolkitModule.loadToolkitData()(dispatch, getState(state));
      expect(axios.get).toHaveBeenCalledWith('/api/projects/1/toolkit/data/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_TOOLKIT_DATA', data: 1 });

      try {
        await ToolkitModule.loadToolkitData()(dispatch, getState({}));
      } catch (e) {
        expect(e).toEqual(jasmine.any(Error));
      }
    }));

    it('saveAnswer', A(async () => {
      dispatch.calls.reset();
      spyOn(axios, 'post').and.returnValue(defaultAxiosSuccess);
      const state = {
        projects: {
          currentProject: null
        }
      };

      await ToolkitModule.saveAnswer(1)(dispatch, getState(state));
      expect(dispatch).not.toHaveBeenCalled();

      state.projects.currentProject = 1;
      await ToolkitModule.saveAnswer(1)(dispatch, getState(state));
      expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_TOOLKIT_DATA', data: 1 });
      expect(axios.post).toHaveBeenCalledWith('/api/projects/1/toolkit/score/', 1);

      try {
        await ToolkitModule.saveAnswer(1)(dispatch, getState({}));
      } catch (e) {
        expect(e).toEqual(jasmine.any(Error));
      }
    }));
  });

  describe('REDUCERS', () => {
    it('SET_TOOLKIT_DATA', () => {
      let state = {};
      const action = { type: 'SET_TOOLKIT_DATA', data: 1 };
      state = ToolkitModule.default(state, action);
      expect(state.toolkitData).toBe(1);
    });

    it('UPDATE_TOOLKIT_DATA', () => {
      let state = {
        toolkitData: [
          {
            domains: [
              {
                questions: [
                  {
                    answers: []
                  }
                ]
              }
            ]
          }
        ]
      };
      const action = { type: 'UPDATE_TOOLKIT_DATA',
        data: { axis: 0, domain: 0, question: 0, answer: 0, value: 1 } };
      state = ToolkitModule.default(state, action);
      expect(state.toolkitData[0].domains[0].questions[0].answers[0]).toBe(1);
    });

    it('CLEAR_TOOLKIT_DATA', () => {
      let state = {
        toolkitData: 1
      };
      const action = { type: 'CLEAR_TOOLKIT_DATA', data: 1 };
      state = ToolkitModule.default(state, action);
      expect(state.toolkitData).toEqual([]);
    });
  });
});
