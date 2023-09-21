import { Validator } from 'vee-validate'
import { format } from 'date-fns'
import { flatten } from 'lodash'

Validator.extend('isDate', {
  getMessage (field) {
    return `${field} should be a valid date, IE: 2017/01/15`
  },
  validate (value) {
    return !!(value instanceof Date && value.toJSON())
  }
})

Validator.extend('isArrayofEmails', {
  getMessage (field) {
    return `${field} should contain valid emails only`
  },
  validate (value) {
    if (!Array.isArray(value) || value.length === 0) return true
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return value.every(e => e.match(emailRegex))
  }
})

export const fetchProjectData = async (store, params, error) => {
  try {
    await store.dispatch('projects/setCurrentProject', params.id)
    await Promise.all([
      store.dispatch('project/loadProject', params.id),
      store.dispatch('projects/loadProjectStructure')
    ])
  } catch (e) {
    console.warn('loadProjectData failed')
    if (e.response) {
      error({
        statusCode: e.response.status,
        message: e.response.data.detail,
      })
    } else {
      error({
        statusCode: 400,
        message: 'Error loading page, please try again later'
      })
    }
  }
}

export const epochCheck = (date, present = true) => {
  if (date) {
    const secondsSinceEpoch = Math.round(date.getTime() / 1000)
    if (secondsSinceEpoch === 0) {
      return present ? new Date() : ''
    }
  }
  return date
}
export const newStages = draft => {
  return draft
    .filter(i => i.checked)
    .map(i => {
      return {
        id: i.id,
        note: i.note || null,
        date: formatDate(i.date)
      }
    })
}

export const formatDate = date =>
  format(date, 'YYYY-MM-DD') === 'Invalid Date'
    ? null
    : format(date, 'YYYY-MM-DD')

export const getDate = date => {
  if (date) {
    return format(date, 'DD/MM/YYYY')
  }
  return null
}
export const getList = (arr, getter, keys = ['email', 'name']) => {
  // optional keys are first, last is obligatory
  if (arr) {
    return getter
      .filter(p => arr.includes(p.id))
      .map(i => {
        let val = ''
        for (const key of keys) {
          if (i[key]) {
            val = i[key]
          }
        }
        return val
      })
  }
  return []
}
export const getNestedList = (list, key) => {
  return flatten(list.map(item => item[key]))
}

export const projectFields = () => ({
  name: null,
  organisation: null,
  country: null,
  geographic_scope: null,
  implementation_overview: null,
  research: false,
  start_date: null,
  end_date: null,
  end_date_note: null,
  contact_name: null,
  contact_email: null,
  team: [],
  viewers: [],
  software: [],
  dhis: [],
  digitalHealthInterventions: [],
  health_focus_areas: [],
  hsc_challenges: [],
  hsc_challenges_other: [],
  his_bucket: [],
  coverageType: 1,
  coverage: [],
  coverageData: {},
  coverage_second_level: [],
  national_level_deployment: {
    health_workers: null,
    clients: null,
    facilities: null
  },
  government_investor: null,
  implementing_partners: [],
  implementing_team: [],
  implementing_viewers: [],
  donors: [],
  implementation_dates: null,
  licenses: [],
  zero_cost: '',
  codebase_accessible : '',
  is_customizable: '',
  free_replication : '',
  osi_licenses : [],
  repository: null,
  mobile_application: null,
  wiki: null,
  interoperability_links: {},
  interoperability_standards: []
})

export const draftRules = () => {
  return {
    name: {
      required: true,
      min: 1,
      max: 250
    },
    organisation: {
      max: 128
    },
    country: {
      required: true
    },
    contact_name: {
      max: 256
    },
    contact_email: {
      email: true
    },
    team: {
      required: true,
      min: 1
    },
    geographic_scope: {
      max: 1024
    },
    hsc_challenges_other: {
      max: 256
    },
    implementing_partners: {
      max: 1024
    },
    implementing_team: {
      max: 64
    },
    implementing_viewers: {
      max: 64
    },
    implementation_overview: {
      max: 5000
    },
    research: {
      required: false
    },
    start_date: {
      isDate: true
    },
    end_date: {
      isDate: true
    },
    end_date_note: {},
    implementation_dates: {
      isDate: true
    },
    coverage: {},
    coverage_second_level: {},
    national_level_deployment: {
      health_workers: {},
      clients: {},
      facilities: {}
    },
    stages: {},
    repository: {
      max: 256
    },
    mobile_application: {
      max: 256
    },
    wiki: {
      max: 256
    }
  }
}
export const publishRules = () => {
  return {
    name: {
      required: true,
      min: 1,
      max: 250
    },
    organisation: {
      max: 128
    },
    country: {
      required: true
    },
    geographic_scope: {
      max: 1024
    },
    implementation_overview: {
      required: true,
      max: 5000
    },
    research: {
      required: false
    },
    start_date: {
      required: true,
      isDate: true
    },
    end_date: {
      required: false,
      isDate: true
    },
    end_date_note: {
      required: false
    },
    stages: {
      data: {
        required: true
      }
    },
    contact_name: {
      required: true,
      max: 256
    },
    contact_email: {
      email: true,
      required: true
    },
    team: {
      required: true
    },
    software: {
      required: true
    },
    dhis: {
      required: true
    },
    strategies: {
      required: true,
      min: 1
    },
    health_focus_areas: {
      required: true,
      min: 1
    },
    hsc_challenges: {
      min: 1
    },
    hsc_challenges_other: {
      max: 256
    },
    his_bucket: {},
    coverage: {
      district: {
        required: true
      },
      health_workers: {
        integer: true
      },
      clients: {
        integer: true
      },
      facilities: {
        integer: true
      },
      facilities_list: {}
    },
    coverage_second_level: {
      district: {
        required: false
      },
      health_workers: {
        required: false,
        integer: true
      },
      clients: {
        required: false,
        integer: true
      },
      facilities: {
        required: false,
        integer: true
      },
      facilities_list: {
        required: false
      }
    },
    national_level_deployment: {
      health_workers: {},
      clients: {},
      facilities: {}
    },
    government_investor: {},
    implementing_partners: {
      max: 1024
    },
    implementing_team: {
      max: 64
    },
    implementing_viewers: {
      max: 64
    },
    donors: {
      required: true
    },
    implementation_dates: {
      isDate: true
    },
    zero_cost: {},
    codebase_accessible : {},
    is_customizable: {},
    free_replication : {},
    osi_licenses : {},
    repository: {
      max: 256,
      url: {
        require_protocol: true
      }
    },
    mobile_application: {
      max: 256,
      url: {
        require_protocol: true
      }
    },
    wiki: {
      max: 256,
      url: {
        require_protocol: true
      }
    },
    interoperability_links: {
      url: {
        require_protocol: true
      }
    },
    interoperability_standards: {}
  }
}
