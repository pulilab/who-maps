import { Message } from 'element-ui';

export const state = () => ({
  country: {},
  editableCountry: {},
  userSelection: [],
  adminSelection: [],
  superadminSelection: []
});

export const getters = {
  getStableCountry: state => state.country,
  getCountry: state => state.editableCountry,

  getCoverText: state => state.editableCountry && state.editableCountry.cover_text,
  getFooterTitle: state => state.editableCountry && state.editableCountry.footer_title,
  getFooterText: state => state.editableCountry && state.editableCountry.footer_text,
  getProjectApproval: state => state.editableCountry && state.editableCountry.project_approval,

  getUserSelection: state => state.userSelection,
  getAdminSelection: state => state.adminSelection,
  getSuperadminSelection: state => state.superadminSelection
};

export const actions = {
  async fetchData ({ commit, rootGetters, dispatch }) {
    const countryId = rootGetters['user/getProfile'].country;
    const { data } = await this.$axios.get(`/api/countries/${countryId}/`);
    // console.log('COUNTRY DATA:');
    // console.dir(data);
    commit('SET_COUNTRY_DATA', data);
    commit('SET_EDITABLE_COUNTRY_DATA', data);

    if (Object.keys(data.map_data).length) {
      dispatch('admin/map/setFacilities', data.map_data.facilities, { root: true });
      dispatch('admin/map/setFirstSubLevel', data.map_data.first_sub_level.admin_level, { root: true });
      dispatch('admin/map/setFirstSubLevelType', data.map_data.first_sub_level.name, { root: true });
      dispatch('admin/map/setSecondSubLevel', data.map_data.second_sub_level.admin_level, { root: true });
      dispatch('admin/map/setSecondSubLevelType', data.map_data.second_sub_level.name, { root: true });
      dispatch('admin/map/setCountryCenter', data.map_data.polylabel, { root: true });
      dispatch('admin/map/parseSubLevelsPolyCenters', data.map_data.first_sub_level, { root: true });
    }

    dispatch('mapAdminSelections', data);
  },

  mapAdminSelections ({ commit, rootGetters }, data) {
    const profiles = rootGetters['system/getUserProfiles'];
    const userId = rootGetters['user/getProfile'].id;
    let defaultDisable = false;

    const userIdMapping = val => {
      if (typeof val !== 'object') {
        // In case of `id`
        const profile = profiles.find(prof => prof.id === val);
        const label = `${profile.name} <${profile.user_email}>`;
        return {
          key: val,
          label,
          disabled: defaultDisable || val === userId
        };
      } else {
        // In case of { id, name, email }
        return {
          key: val.id,
          label: `${val.name} <${val.email}>`,
          disabled: defaultDisable || val.id === userId
        };
      }
    };

    commit('SET_USER_SELECTION', [...(data.user_requests || []), ...(data.users || [])].map(userIdMapping));
    commit('SET_ADMIN_SELECTION', [...(data.admin_requests || []), ...(data.admins || [])].map(userIdMapping));
    defaultDisable = rootGetters['user/getProfile'].account_type === 'CA' && !rootGetters['user/getProfile'].is_superuser;
    commit('SET_SUPER_ADMIN_SELECTION', [...(data.super_admin_requests || []), ...(data.super_admins || [])].map(userIdMapping));
  },

  async saveChanges ({ dispatch }) {
    try {
      await Promise.all([
        dispatch('patchInfoAndArrays'),
        dispatch('patchCountryImages'),
        dispatch('synchPartnerLogos'),
        dispatch('synchMapFile'),
        dispatch('admin/map/saveMapData', {}, { root: true })
      ]);
      await dispatch('fetchData');
      window.scrollTo(0, 0);
      Message({
        message: 'Country data succesfully updated',
        type: 'success',
        showClose: true
      });
    } catch (e) {
      console.error(e);
      Message({
        message: 'Country data update error',
        type: 'error',
        showClose: true
      });
    }
  },

  async patchInfoAndArrays ({ getters, rootGetters }) {
    const userProfile = rootGetters['user/getProfile'];
    const keys = ['cover_text', 'footer_title', 'footer_text', 'project_approval', 'users', 'admins'];
    if (userProfile.account_type === 'SCA' || userProfile.is_superuser) keys.push('super_admins');

    const patchObj = keys.reduce((prev, key) => {
      if (JSON.stringify(getters.getCountry[key]) !== JSON.stringify(getters.getStableCountry[key])) {
        prev[key] = getters.getCountry[key];
      }
      return prev;
    }, {});

    if (Object.keys(patchObj).length) {
      const countryId = rootGetters['user/getProfile'].country;
      await this.$axios.patch(`/api/countries/${countryId}/`, patchObj);
    } else return Promise.resolve();
  },

  async patchCountryImages ({ getters, rootGetters }) {
    const oldFilePathLogo = getters.getStableCountry.logo;
    const oldFilePathCover = getters.getStableCountry.cover;

    const uploadNewLogo = (oldFilePathLogo === null) && getters.getCountry.logo && getters.getCountry.logo.raw;
    const changeOldLogo = !!oldFilePathLogo && typeof getters.getCountry.logo !== 'string';
    const uploadNewCover = (oldFilePathCover === null) && getters.getCountry.cover && getters.getCountry.cover.raw;
    const changeOldCover = !!oldFilePathCover && typeof getters.getCountry.cover !== 'string';

    const formData = new FormData();
    if (uploadNewLogo || changeOldLogo || uploadNewCover || changeOldCover) {
      const countryId = rootGetters['user/getProfile'].country;
      if (uploadNewLogo || changeOldLogo) { formData.append('logo', (getters.getCountry.logo || '') && getters.getCountry.logo.raw); }
      if (uploadNewCover || changeOldCover) { formData.append('cover', (getters.getCountry.cover || '') && getters.getCountry.cover.raw); }

      await this.$axios.patch(`/api/country-images/${countryId}/`, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      });
    } else {
      return Promise.resolve();
    }
  },

  async synchPartnerLogos ({ getters, dispatch }) {
    const promArr = [];

    getters.getCountry.partner_logos.forEach(async logo => {
      if (logo.raw) {
        promArr.push({action: 'postPartnerLogo', data: logo.raw});
      }
    });

    getters.getStableCountry.partner_logos.forEach(async logo => {
      const isStillThere = !!getters.getCountry.partner_logos.find(newLogo => newLogo.id === logo.id);
      if (!isStillThere) {
        promArr.push({action: 'delPartnerLogo', data: logo.id});
      }
    });

    return Promise.all(promArr.map(promObj => dispatch(promObj.action, promObj.data)));
  },

  async postPartnerLogo ({ rootGetters }, img) {
    const countryId = rootGetters['user/getProfile'].country;
    const formData = new FormData();
    formData.append('country', countryId);
    formData.append('image', img);
    await this.$axios.post(`/api/country-partner-logos/`, formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    });
  },

  async delPartnerLogo (ctx, id) {
    await this.$axios.delete(`/api/country-partner-logos/${id}/`);
  },

  async synchMapFile ({ rootGetters, getters }) {
    const mapFile = getters.getCountry.map_files[0];
    if (mapFile.raw) {
      const countryId = rootGetters['user/getProfile'].country;
      const formData = new FormData();
      formData.append('country', countryId);
      formData.append('map_file', mapFile.raw);
      await this.$axios.post(`/api/map-files/`, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      });
    }
  },

  setCountryField ({ commit }, { field, data }) {
    commit('SET_COUNTRY_FIELD', {field, data});
  },

  setCoverText ({ commit }, txt) {
    commit('SET_COUNTRY_FIELD', {field: 'cover_text', data: txt});
  },

  setFooterTitle ({ commit }, txt) {
    commit('SET_COUNTRY_FIELD', {field: 'footer_title', data: txt});
  },

  setFooterText ({ commit }, txt) {
    commit('SET_COUNTRY_FIELD', {field: 'footer_text', data: txt});
  },

  setProjectApproval ({ commit }, bool) {
    commit('SET_COUNTRY_FIELD', {field: 'project_approval', data: bool});
  }

};

export const mutations = {
  SET_COUNTRY_DATA: (state, data) => {
    state.country = {...data};
  },

  SET_EDITABLE_COUNTRY_DATA: (state, data) => {
    state.editableCountry = {...data};
  },

  SET_COUNTRY_FIELD: (state, {field, data}) => {
    const valueToFill = typeof data === 'undefined' ? null : data;
    state.editableCountry[field] = valueToFill;
  },

  SET_USER_SELECTION: (state, data) => {
    state.userSelection = data;
  },

  SET_ADMIN_SELECTION: (state, data) => {
    state.adminSelection = data;
  },

  SET_SUPER_ADMIN_SELECTION: (state, data) => {
    state.superadminSelection = data;
  }
};
