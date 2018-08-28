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
    dispatch('mapAdminSelections', data);
  },

  mapAdminSelections ({ commit, rootGetters }, data) {
    const profiles = rootGetters['system/getUserProfiles'];
    const userId = rootGetters['user/getProfile'].id;

    const userIdMapping = val => {
      if (typeof val !== 'object') {
        // In case of `id`
        const profile = profiles.find(prof => prof.id === val);
        const label = `${profile.name} <${profile.user_email}>`;
        return {
          key: val,
          label,
          disabled: val === userId
        };
      } else {
        // In case of { id, name, email }
        return {
          key: val.id,
          label: `${val.name} <${val.email}>`,
          disabled: val.id === userId
        };
      }
    };

    commit('SET_USER_SELECTION', [...(data.user_requests || []), ...(data.users || [])].map(userIdMapping));
    commit('SET_ADMIN_SELECTION', [...(data.admin_requests || []), ...(data.admins || [])].map(userIdMapping));
    commit('SET_SUPER_ADMIN_SELECTION', [...(data.super_admin_requests || []), ...(data.super_admins || [])].map(userIdMapping));
  },

  async saveChanges ({ dispatch }) {
    try {
      await Promise.all([
        dispatch('patchInfoStrings'),
        dispatch('patchCountryImages'),
        dispatch('synchPartnerLogos'),
        dispatch('synchAdminUserArrays'),
        dispatch('synchMapFile')
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

  async patchInfoStrings ({ getters, rootGetters }) {
    const isThereChange = ['cover_text', 'footer_title', 'footer_text'].some(key => {
      return getters.getCountry[key] !== getters.getStableCountry[key];
    });

    if (isThereChange) {
      const countryId = rootGetters['user/getProfile'].country;

      const formData = new FormData();
      ['cover_text', 'footer_title', 'footer_text'].forEach(key => {
        if (getters.getCountry[key] !== getters.getStableCountry[key]) {
          formData.append(key, getters.getCountry[key]);
        }
      });

      const config = { headers: {
        'content-type': 'multipart/form-data'
      }};

      await this.$axios.patch(`/api/countries/${countryId}/`, formData, config);
    } else {
      // console.log('No change in country info strings');
      return Promise.resolve();
    }
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

  async synchAdminUserArrays ({ rootGetters, getters }) {
    const countryId = rootGetters['user/getProfile'].country;
    const patchObj = {
      users: getters.getCountry.users,
      admins: getters.getCountry.admins
    };
    const userProfile = rootGetters['user/getProfile'];
    if (userProfile.account_type === 'SCA' || userProfile.is_superuser) {
      patchObj.super_admins = getters.getCountry.super_admins;
    }
    await this.$axios.patch(`/api/countries/${countryId}/`, patchObj);
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
  }

};

export const mutations = {
  SET_COUNTRY_DATA: (state, data) => {
    state.country = data;
  },

  SET_EDITABLE_COUNTRY_DATA: (state, data) => {
    state.editableCountry = data;
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
