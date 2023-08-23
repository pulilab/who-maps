import { format, differenceInCalendarDays } from 'date-fns'

function addParam(paramString,paramKey,paramVal) {
  return paramString ? `&${paramKey}=${paramVal}` : `${paramKey}=${paramVal}`
}

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
  async loadDocuments({ commit, rootGetters }, filter) {
    try {
      commit('setValue', { type: 'loading', value: true})
      const { data } = await this.$axios({
        method: 'get',
        url: '/api/document-search/',
        params: filter,
        paramsSerializer: params => {
          let query = ''
          if (params.search) query += addParam(query,'search',params.search)
          if (params.country) query += addParam(query,'country',params.country)
          if (params.language) query += addParam(query,'language',params.language)
          if (params.document_types) query += addParam(query,'document_types',params.document_types)
          if (params.featured !== null) query += addParam(query,'featured',params.featured)
          if (params.valid !== null) query += addParam(query,'valid',params.valid)
          return query
        },
        progress: false
      })

      const now = new Date()
      const countries = rootGetters['countries/getCountries']
      const referenceDocuments = rootGetters['system/getReferenceDocuments']
      const referenceTypes = rootGetters['projects/getReferenceDocumentsTypes']

      const docs = data.map(doc => {
        const until = doc.valid_until ? new Date(doc.valid_until) : new Date()
        return {
          ...doc,
          country: countries.find(c => c.id == doc.country),
          language: referenceDocuments.languages.find(l => l.id == doc.language),
          types: doc.document_types.map(typeId => referenceTypes.find(t => t.id == typeId)),
          validFromDisplay: format(doc.valid_from, 'DD/MM/YYYY'),
          validUntilDisplay: doc.valid_until ? format(doc.valid_until, 'DD/MM/YYYY') : '',
          expired: differenceInCalendarDays(until, now) < 0,
        }
      })
      commit('setValue', { type: 'documents', value: docs})
      commit('setValue', { type: 'loading', value: false})
    } catch (error) {
      console.log("🚀 ~ file: documents.js:50 ~ loadDocuments ~ error:", error)
      commit('setValue', { type: 'loading', value: false})
    }
  },
  setDialog({ commit }, value) {
    commit('setValue', { type: 'dialog', value})
  },
  openReferenceDocumentDialog({ commit }, document) {
    commit('setValue', { type: 'document', value: document})
    commit('setValue', { type: 'dialog', value: true})
  },
  closeReferenceDocumentDialog({ commit }) {
    commit('setValue', { type: 'document', value: {}})
    commit('setValue', { type: 'dialog', value: false})
  },
}

export const mutations = {
  setValue: (state, { type, value }) => {
    state[type] = value
  }
}