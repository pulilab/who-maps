import * as CmsModule from '../../src/store/modules/cms';
import * as SystemModule from '../../src/store/modules/system';
import * as UserModule from '../../src/store/modules/user';
import { A, defaultAxiosSuccess, dispatch, getState } from '../testUtilities';
import axios from '../../src/plugins/axios';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise, FormData */

describe('CMS Store Module', () => {
  describe('GETTERS', () => {
    it('getCmsData', () => {
      const state = {
        cms: {
          data: []
        }
      };
      const result = CmsModule.getCmsData(state);
      expect(result).not.toBe(state.cms.data);
      expect(result).toEqual(state.cms.data);
    });

    it('getDomainStructureForCms', () => {
      spyOn(SystemModule, 'getAxis').and.returnValue([{ id: 1 }]);
      spyOn(SystemModule, 'getDomains').and.returnValue([{ axis: 1, name: 1 }]);

      const result = CmsModule.getDomainStructureForCms({});
      expect(result[0].id).toBe(1);
      expect(result[0].domains[0].name).toBe(1);

      expect(SystemModule.getAxis).toHaveBeenCalled();
      expect(SystemModule.getDomains).toHaveBeenCalled();
    });

    it('getAxisName', () => {
      spyOn(SystemModule, 'getAxis').and.returnValue([{ id: 1, name: 'a' }]);
      const result = CmsModule.getAxisName({}, 0);
      expect(result).toBe('a');

      expect(SystemModule.getAxis).toHaveBeenCalled();
    });

    it('getDomain', () => {
      spyOn(SystemModule, 'getDomains').and.returnValue([{ axis: 1, name: 1, id: 1 }]);
      const result = CmsModule.getDomain({}, 1);
      expect(result.name).toBe(1);
      expect(SystemModule.getDomains).toHaveBeenCalled();
    });

    it('getAxisAndDomainName', () => {
      spyOn(CmsModule, 'getDomain').and.returnValue({ name: 'domain', id: 1 });
      spyOn(CmsModule, 'getDomainStructureForCms')
        .and.returnValue([{ name: 'axis', domains: [{ id: 1 }] }, { name: 'wrong', domains: [{ id: 2 }] }]);

      const result = CmsModule.getAxisAndDomainName({}, 1);
      expect(result.axisName).toBe('axis');
      expect(result.domainName).toBe('domain');

      expect(CmsModule.getDomain).toHaveBeenCalledWith({}, 1);
      expect(CmsModule.getDomainStructureForCms).toHaveBeenCalled();
    });
  });

  describe('ACTIONS', () => {
    it('loadCmsData', A(async () => {
      spyOn(axios, 'get').and.returnValue(Promise.resolve({ data: [{}] }));
      await CmsModule.loadCmsData()(dispatch);
      expect(axios.get).toHaveBeenCalledWith('/api/cms/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_CMS_DATA', data: [{ searchOccurrences: 0 }] });
    }));

    it('addContent', A(async () => {
      spyOn(axios, 'post').and.returnValue(Promise.resolve({ data: {} }));
      await CmsModule.addContent({ a: 1 })(dispatch);
      expect(axios.post).toHaveBeenCalledWith('/api/cms/', { a: 1 });
      expect(dispatch).toHaveBeenCalledWith({ type: 'ADD_CMS_ENTRY', item: { searchOccurrences: 0 } });
    }));

    it('updateContent', A(async () => {
      spyOn(axios, 'put').and.returnValue(Promise.resolve({ data: {} }));
      await CmsModule.updateContent({ a: 1 }, 1)(dispatch);
      expect(axios.put).toHaveBeenCalledWith('/api/cms/1/', { a: 1 });
      expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_CMS_ENTRY', item: { searchOccurrences: 0 } });
    }));

    it('saveOrUpdateContent', A(async () => {
      const state = getState({
        user: {
          profile: {
            id: 1
          }
        }
      });

      spyOn(CmsModule, 'addContent');
      const update = spyOn(CmsModule, 'updateContent');
      const profileSpy = spyOn(UserModule, 'getProfile').and.returnValue({ id: 1 });
      const resource = {
        id: 1
      };
      await CmsModule.saveOrUpdateContent(resource)(dispatch, state);
      expect(CmsModule.updateContent).toHaveBeenCalledWith({ id: 1, author: 1 }, 1);
      expect(profileSpy).toHaveBeenCalled();

      resource.cover = {
        type: ['asd']
      };

      await CmsModule.saveOrUpdateContent(resource)(dispatch, state);
      expect(CmsModule.updateContent).toHaveBeenCalledWith({ id: 1, author: 1 }, 1);
      expect(profileSpy).toHaveBeenCalled();

      update.calls.reset();
      resource.cover.type = ['image'];
      await CmsModule.saveOrUpdateContent(resource)(dispatch, state);
      expect(CmsModule.updateContent).toHaveBeenCalledWith(jasmine.any(FormData), 1);
      expect(profileSpy).toHaveBeenCalled();

      delete resource.id;
      await CmsModule.saveOrUpdateContent(resource)(dispatch, state);
      expect(CmsModule.addContent).toHaveBeenCalledWith(jasmine.any(FormData));
      expect(profileSpy).toHaveBeenCalled();
    }));

    it('deleteContent', A(async () => {
      spyOn(axios, 'delete').and.returnValue(defaultAxiosSuccess);
      await CmsModule.deleteContent({ id: 1 })(dispatch);
      expect(axios.delete).toHaveBeenCalledWith('/api/cms/1/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'DELETE_CMS_ENTRY', id: 1 });
    }));

    it('reportContent', A(async () => {
      spyOn(axios, 'patch').and.returnValue(defaultAxiosSuccess);
      await CmsModule.reportContent({ id: 1 })(dispatch);
      expect(axios.patch).toHaveBeenCalledWith('/api/cms/1/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_CMS_ENTRY', item: { id: 1, state: 2 } });
    }));

    it('reportComment', A(async () => {
      spyOn(axios, 'patch').and.returnValue(defaultAxiosSuccess);
      await CmsModule.reportComment({ id: 1 })(dispatch);
      expect(axios.patch).toHaveBeenCalledWith('/api/comment/1/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_COMMENT', comment: { id: 1, state: 2 } });
    }));

    it('deleteComment', A(async () => {
      spyOn(axios, 'delete').and.returnValue(defaultAxiosSuccess);
      await CmsModule.deleteComment({ id: 1 })(dispatch);
      expect(axios.delete).toHaveBeenCalledWith('/api/comment/1/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'DELETE_COMMENT', comment: { id: 1 } });
    }));

    it('addNewComment', A(async () => {
      spyOn(axios, 'post').and.returnValue(defaultAxiosSuccess);
      const state = getState({
        user: {
          profile: {
            id: 1
          }
        }
      });
      await CmsModule.addNewComment({}, { id: 1 })(dispatch, state);
      expect(axios.post).toHaveBeenCalledWith('/api/comment/', { post: 1, user: 1 });
      expect(dispatch).toHaveBeenCalledWith({ type: 'ADD_COMMENT', comment: 1 });
    }));

    it('updateComment', A(async () => {
      spyOn(axios, 'put').and.returnValue(defaultAxiosSuccess);
      await CmsModule.updateComment({ id: 1 })(dispatch);
      expect(axios.put).toHaveBeenCalledWith('/api/comment/1/', { id: 1 });
      expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_COMMENT', comment: 1 });
    }));
  });

  describe('REDUCERS', () => {
    it('SET_CMS_DATA', () => {
      let state = {};
      const action = { type: 'SET_CMS_DATA', data: 1 };
      state = CmsModule.default(state, action);
      expect(state.data).toBe(1);
    });

    it('ADD_CMS_ENTRY', () => {
      let state = {
        data: []
      };
      const action = { type: 'ADD_CMS_ENTRY', item: 1 };
      state = CmsModule.default(state, action);
      expect(state.data[0]).toBe(1);
    });

    it('UPDATE_CMS_ENTRY', () => {
      let state = {
        data: [{ id: 1, name: 3 }]
      };
      const action = { type: 'UPDATE_CMS_ENTRY', item: { id: 1, name: 2 } };
      state = CmsModule.default(state, action);
      expect(state.data[0].name).toBe(2);
    });

    it('DELETE_CMS_ENTRY', () => {
      let state = {
        data: [{ id: 1, name: 3 }]
      };
      const action = { type: 'DELETE_CMS_ENTRY', id: 1 };
      state = CmsModule.default(state, action);
      expect(state.data[0]).toEqual(undefined);
    });

    it('ADD_COMMENT', () => {
      let state = {
        data: [{ id: 1, comments: [] }]
      };
      const action = { type: 'ADD_COMMENT', comment: { post: 1, id: 2 } };
      state = CmsModule.default(state, action);
      expect(state.data[0].comments[0].id).toEqual(2);
    });

    it('UPDATE_COMMENT', () => {
      let state = {
        data: [{ id: 1, comments: [{ id: 2, post: 1, name: 3 }] }]
      };
      const action = { type: 'UPDATE_COMMENT', comment: { post: 1, id: 2, name: 4 } };
      state = CmsModule.default(state, action);
      expect(state.data[0].comments[0].name).toEqual(4);
    });

    it('DELETE_COMMENT', () => {
      let state = {
        data: [{ id: 1, comments: [{ id: 2, post: 1, name: 3 }] }]
      };
      const action = { type: 'DELETE_COMMENT', comment: { post: 1, id: 2, name: 4 } };
      state = CmsModule.default(state, action);
      expect(state.data[0].comments[0]).toEqual(undefined);
    });

    it('CLEAR_CMS_DATA', () => {
      let state = {
        data: [{ id: 1, comments: [{ id: 2, post: 1, name: 3 }] }]
      };
      const action = { type: 'CLEAR_CMS_DATA' };
      state = CmsModule.default(state, action);
      expect(state.data).toEqual([]);
    });
  });
});
