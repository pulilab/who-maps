import * as CmsModule from '../../src/store/modules/cms';
import * as SystemModule from '../../src/store/modules/system';
import * as UserModule from '../../src/store/modules/user';
import { A, defaultAxiosSuccess, dispatch, getState } from '../testUtilities';
import axios from '../../src/plugins/axios';

describe('CMS Store Module', () => {
  describe('GETTERS', () => {
    test('getCmsData', () => {
      const state = {
        cms: {
          data: []
        }
      };
      const result = CmsModule.getCmsData(state);
      expect(result).not.toBe(state.cms.data);
      expect(result).toEqual(state.cms.data);
    });

    test('getDomainStructureForCms', () => {
      jest.spyOn(SystemModule, 'getAxis').mockReturnValue([{ id: 1 }]);
      jest.spyOn(SystemModule, 'getDomains').mockReturnValue([{ axis: 1, name: 1 }]);

      const result = CmsModule.getDomainStructureForCms({});
      expect(result[0].id).toBe(1);
      expect(result[0].domains[0].name).toBe(1);

      expect(SystemModule.getAxis).toHaveBeenCalled();
      expect(SystemModule.getDomains).toHaveBeenCalled();
    });

    test('getAxisName', () => {
      jest.spyOn(SystemModule, 'getAxis').mockReturnValue([{ id: 1, name: 'a' }]);
      const result = CmsModule.getAxisName({}, 0);
      expect(result).toBe('a');

      expect(SystemModule.getAxis).toHaveBeenCalled();
    });

    test('getDomain', () => {
      jest.spyOn(SystemModule, 'getDomains').mockReturnValue([{ axis: 1, name: 1, id: 1 }]);
      const result = CmsModule.getDomain({}, 1);
      expect(result.name).toBe(1);
      expect(SystemModule.getDomains).toHaveBeenCalled();
    });

    test('getAxisAndDomainName', () => {
      jest.spyOn(CmsModule, 'getDomain').mockReturnValue({ name: 'domain', id: 1 });
      jest.spyOn(CmsModule, 'getDomainStructureForCms')
        .mockReturnValue([{ name: 'axis', domains: [{ id: 1 }] }, { name: 'wrong', domains: [{ id: 2 }] }]);

      const result = CmsModule.getAxisAndDomainName({}, 1);
      expect(result.axisName).toBe('axis');
      expect(result.domainName).toBe('domain');

      expect(CmsModule.getDomain).toHaveBeenCalledWith({}, 1);
      expect(CmsModule.getDomainStructureForCms).toHaveBeenCalled();
    });
  });

  describe('ACTIONS', () => {
    test('loadCmsData', A(async () => {
      jest.spyOn(axios, 'get').mockReturnValue(Promise.resolve({ data: [{}] }));
      await CmsModule.loadCmsData()(dispatch);
      expect(axios.get).toHaveBeenCalledWith('/api/cms/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_CMS_DATA', data: [{ searchOccurrences: 0 }] });
    }));

    test('addContent', A(async () => {
      jest.spyOn(axios, 'post').mockReturnValue(Promise.resolve({ data: {} }));
      await CmsModule.addContent({ a: 1 })(dispatch);
      expect(axios.post).toHaveBeenCalledWith('/api/cms/', { a: 1 });
      expect(dispatch).toHaveBeenCalledWith({ type: 'ADD_CMS_ENTRY', item: { searchOccurrences: 0 } });
    }));

    test('updateContent', A(async () => {
      jest.spyOn(axios, 'put').mockReturnValue(Promise.resolve({ data: {} }));
      await CmsModule.updateContent({ a: 1 }, 1)(dispatch);
      expect(axios.put).toHaveBeenCalledWith('/api/cms/1/', { a: 1 });
      expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_CMS_ENTRY', item: { searchOccurrences: 0 } });
    }));

    test('saveOrUpdateContent', A(async () => {
      const state = getState({
        user: {
          profile: {
            id: 1
          }
        }
      });

      jest.spyOn(CmsModule, 'addContent');
      const update = jest.spyOn(CmsModule, 'updateContent');
      const profileSpy = jest.spyOn(UserModule, 'getProfile').mockReturnValue({ id: 1 });
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

      update.mockClear()
      resource.cover.type = ['image'];
      await CmsModule.saveOrUpdateContent(resource)(dispatch, state);
      expect(CmsModule.updateContent).toHaveBeenCalledWith(jasmine.any(FormData), 1);
      expect(profileSpy).toHaveBeenCalled();

      delete resource.id;
      await CmsModule.saveOrUpdateContent(resource)(dispatch, state);
      expect(CmsModule.addContent).toHaveBeenCalledWith(jasmine.any(FormData));
      expect(profileSpy).toHaveBeenCalled();
    }));

    test('deleteContent', A(async () => {
      jest.spyOn(axios, 'delete').mockReturnValue(defaultAxiosSuccess);
      await CmsModule.deleteContent({ id: 1 })(dispatch);
      expect(axios.delete).toHaveBeenCalledWith('/api/cms/1/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'DELETE_CMS_ENTRY', id: 1 });
    }));

    test('reportContent', A(async () => {
      jest.spyOn(axios, 'patch').mockReturnValue(defaultAxiosSuccess);
      await CmsModule.reportContent({ id: 1 })(dispatch);
      expect(axios.patch).toHaveBeenCalledWith('/api/cms/1/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_CMS_ENTRY', item: { id: 1, state: 2 } });
    }));

    test('reportComment', A(async () => {
      jest.spyOn(axios, 'patch').mockReturnValue(defaultAxiosSuccess);
      await CmsModule.reportComment({ id: 1 })(dispatch);
      expect(axios.patch).toHaveBeenCalledWith('/api/comment/1/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_COMMENT', comment: { id: 1, state: 2 } });
    }));

    test('deleteComment', A(async () => {
      jest.spyOn(axios, 'delete').mockReturnValue(defaultAxiosSuccess);
      await CmsModule.deleteComment({ id: 1 })(dispatch);
      expect(axios.delete).toHaveBeenCalledWith('/api/comment/1/');
      expect(dispatch).toHaveBeenCalledWith({ type: 'DELETE_COMMENT', comment: { id: 1 } });
    }));

    test('addNewComment', A(async () => {
      jest.spyOn(axios, 'post').mockReturnValue(defaultAxiosSuccess);
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

    test('updateComment', A(async () => {
      jest.spyOn(axios, 'put').mockReturnValue(defaultAxiosSuccess);
      await CmsModule.updateComment({ id: 1 })(dispatch);
      expect(axios.put).toHaveBeenCalledWith('/api/comment/1/', { id: 1 });
      expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_COMMENT', comment: 1 });
    }));
  });

  describe('REDUCERS', () => {
    test('SET_CMS_DATA', () => {
      let state = {};
      const action = { type: 'SET_CMS_DATA', data: 1 };
      state = CmsModule.default(state, action);
      expect(state.data).toBe(1);
    });

    test('ADD_CMS_ENTRY', () => {
      let state = {
        data: []
      };
      const action = { type: 'ADD_CMS_ENTRY', item: 1 };
      state = CmsModule.default(state, action);
      expect(state.data[0]).toBe(1);
    });

    test('UPDATE_CMS_ENTRY', () => {
      let state = {
        data: [{ id: 1, name: 3 }]
      };
      const action = { type: 'UPDATE_CMS_ENTRY', item: { id: 1, name: 2 } };
      state = CmsModule.default(state, action);
      expect(state.data[0].name).toBe(2);
    });

    test('DELETE_CMS_ENTRY', () => {
      let state = {
        data: [{ id: 1, name: 3 }]
      };
      const action = { type: 'DELETE_CMS_ENTRY', id: 1 };
      state = CmsModule.default(state, action);
      expect(state.data[0]).toEqual(undefined);
    });

    test('ADD_COMMENT', () => {
      let state = {
        data: [{ id: 1, comments: [] }]
      };
      const action = { type: 'ADD_COMMENT', comment: { post: 1, id: 2 } };
      state = CmsModule.default(state, action);
      expect(state.data[0].comments[0].id).toEqual(2);
    });

    test('UPDATE_COMMENT', () => {
      let state = {
        data: [{ id: 1, comments: [{ id: 2, post: 1, name: 3 }] }]
      };
      const action = { type: 'UPDATE_COMMENT', comment: { post: 1, id: 2, name: 4 } };
      state = CmsModule.default(state, action);
      expect(state.data[0].comments[0].name).toEqual(4);
    });

    test('DELETE_COMMENT', () => {
      let state = {
        data: [{ id: 1, comments: [{ id: 2, post: 1, name: 3 }] }]
      };
      const action = { type: 'DELETE_COMMENT', comment: { post: 1, id: 2, name: 4 } };
      state = CmsModule.default(state, action);
      expect(state.data[0].comments[0]).toEqual(undefined);
    });

    test('CLEAR_CMS_DATA', () => {
      let state = {
        data: [{ id: 1, comments: [{ id: 2, post: 1, name: 3 }] }]
      };
      const action = { type: 'CLEAR_CMS_DATA' };
      state = CmsModule.default(state, action);
      expect(state.data).toEqual([]);
    });
  });
});
