import { format, differenceInCalendarDays } from 'date-fns'
import qs from 'qs'

export const state = () => ({
  loading: true,
  dialog: false,
  document: {},
  documents: [],
})

export const getters = {
  getLoading: state => state.loading,
  getDialog: state => state.dialog,
  getDocument: state => state.document,
  getDocuments: state => state.documents,
}

export const actions = {
  async loadRegistry ({ commit, rootGetters }, filter) {
    try {
      commit('setValue', { type: 'loading', value: true})
      const { data } = await this.$axios({
        method: 'get',
        url: '/api/document-search/',
        params: filter,
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat', encodeValuesOnly: true }),
        progress: false
      })

      const now = new Date()
      const countries = rootGetters['countries/getCountries']
      const policyRegistry = rootGetters['system/getPolicyRegistry']

      const docs = data.map(doc => {
        const until = doc.valid_until ? new Date(doc.valid_until) : new Date()
        return {
          ...doc,
          country: countries.find(c => c.id == doc.country),
          language: policyRegistry.languages.find(l => l.id == doc.language),
          types: doc.types.map(typeId => policyRegistry.types.find(t => t.id == typeId)),
          validFromDisplay: format(doc.valid_from, 'DD/MM/YYYY'),
          validUntilDisplay: doc.valid_until ? format(doc.valid_until, 'DD/MM/YYYY') : '',
          expired: differenceInCalendarDays(until, now) < 0,
        }
      })
      commit('setValue', { type: 'documents', value: docs})
      commit('setValue', { type: 'loading', value: false})
    } catch (error) {
      console.log("🚀 ~ file: PolicyRegistryAdmin.vue:241 ~ loadDocuments ~ error:", error)
      commit('setValue', { type: 'loading', value: false})
    }
  },
  setDialog({ commit }, value) {
    commit('setValue', { type: 'dialog', value})
  },
  openPolicyDocumentDialog({ commit }, document) {
    commit('setValue', { type: 'document', value: document})
    commit('setValue', { type: 'dialog', value: true})
  },
  closePolicyDocumentDialog({ commit }) {
    commit('setValue', { type: 'document', value: {}})
    commit('setValue', { type: 'dialog', value: false})
  },
}

export const mutations = {
  setValue: (state, { type, value }) => {
    state[type] = value
  }
}