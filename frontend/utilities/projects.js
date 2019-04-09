export const fetchProjectData = async (store, params, error) => {
  try {
    await store.dispatch('projects/setCurrentProject', params.id);
    await Promise.all([
      store.dispatch('project/loadProject', params.id),
      store.dispatch('projects/loadProjectStructure')
    ]);
  } catch (e) {
    console.warn('loadProjectData failed', e);
    error({
      response: {
        status: 404,
        statusText: 'This project does not exist'
      }
    });
    return Promise.reject(e);
  }
};

export const projectFields = () => ({
  name: null,
  organisation: null,
  country: null,
  geographic_scope: null,
  implementation_overview: null,
  start_date: null,
  end_date: null,
  contact_name: null,
  contact_email: null,
  team: [],
  viewers: [],
  platforms: [],
  digitalHealthInterventions: [],
  health_focus_areas: [],
  hsc_challenges: [],
  his_bucket: [],
  coverageType: 1,
  coverage: [],
  coverageData: {},
  coverage_second_level: [],
  national_level_deployment: {
    health_workers: 0,
    clients: 0,
    facilities: 0
  },
  government_investor: null,
  implementing_partners: [],
  donors: [],
  implementation_dates: null,
  licenses: [],
  repository: null,
  mobile_application: null,
  wiki: null,
  interoperability_links: {},
  interoperability_standards: []
});

export const draftRules = () => {
  return {
    name: {
      required: true,
      min: 1,
      max: 128
    },

    organisation: {
      required: true,
      max: 128
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
    implementation_overview: {
      max: 1024
    },
    coverage: {},
    coverage_second_level: {},
    repository: {
      max: 256
    },
    mobile_application: {
      max: 256
    },
    wiki: {
      max: 256
    }
  };
};
export const publishRules = () => {
  return {
    name: {
      required: true,
      min: 1,
      max: 128
    },
    organisation: {
      required: true,
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
      max: 1024
    },
    start_date: {
      required: true
    },
    end_date: {
      required: false
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
    platforms: {
      required: true
    },
    strategies: {
      required: true,
      min: 1
    },
    health_focus_areas: {
    },
    hsc_challenges: {
      required: true,
      min: 1
    },
    his_bucket: {
      required: true,
      min: 1
    },
    coverage: {
      district: {
        required: true
      },
      health_workers: {
        required: true,
        integer: true
      },
      clients: {
        required: true,
        integer: true
      },
      facilities: {
        required: true,
        integer: true
      },
      facilities_list: {
        required: true,
        min: 1
      }
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
      health_workers: {
        required: true
      },
      clients: {
        required: true
      },
      facilities: {
        required: true
      }
    },
    government_investor: {
      required: true
    },
    implementing_partners: {
      required: true
    },
    donors: {
      required: true
    },
    implementation_dates: {
      required: true
    },
    licenses: {},
    repository: {
      max: 256,
      url: true
    },
    mobile_application: {
      max: 256,
      url: true
    },
    wiki: {
      max: 256,
      url: true
    },
    interoperability_links: {
      url: {
        require_protocol: true
      }
    },
    interoperability_standards: {}
  };
};
