import get from 'lodash/get';
export const coverageMapper = collection => {
  const coverage = [];
  const coverageData = {};
  collection = collection || [];
  if (Array.isArray(collection)) {
    collection.forEach(c => {
      coverage.push(c.district);
      coverageData[c.district] = {
        clients: c.clients,
        facilities: c.facilities_list ? c.facilities_list.length : c.facilities,
        health_workers: c.health_workers,
        facilities_list: c.facilities_list
      };
    });
  } else {
    console.warn('Invalid or malformed input passed to api/coverageMapper');
  }
  return [coverage, coverageData];
};

export const interoperabilityLinksMapper = links => {
  const result = {};
  links = links || [];
  if (Array.isArray(links)) {
    links.forEach(l => {
      result[l.id] = {
        link: l.link,
        selected: l.selected
      };
    });
  } else {
    console.warn('Invalid or malformed input passed to api/interoperabilityLinksMapper');
  }
  return result;
};

export const platformsMapper = collection => {
  const platforms = [];
  const digitalHealthInterventions = [];
  collection = collection || [];
  if (Array.isArray(collection)) {
    collection.forEach(p => {
      platforms.push(p.id);
      if (p.strategies && Array.isArray(p.strategies)) {
        digitalHealthInterventions.push(...p.strategies.map(s => ({ id: s, platform: p.id })));
      }
    });
  } else {
    console.warn('Invalid or malformed input passed to api/platformsMapper');
  }
  return [platforms, digitalHealthInterventions];
};

export const countryCustomFieldMapper = collection => {
  const customAnswers = [];
  if (typeof collection === 'object' && collection) {
    for (const key in collection) {
      customAnswers.push({ question_id: +key, answer: collection[key] });
    }
  } else {
    console.warn('Invalid or malformed input passed to api/countryCustomFieldMapper');
  }
  return customAnswers;
};

export const donorCustomFieldMapper = collection => {
  const customAnswers = [];
  if (typeof collection === 'object' && !Array.isArray(collection) && collection) {
    for (const donor in collection) {
      if (typeof collection[donor] === 'object' && !Array.isArray(collection) && collection) {
        for (const key in collection[donor]) {
          customAnswers.push({ question_id: +key, answer: collection[donor][key], donor_id: +donor });
        }
      } else {
        console.warn('Malformed input passed to api/countryCustomFieldMapper');
      }
    }
  } else {
    console.warn('Invalid or malformed input passed to api/countryCustomFieldMapper');
  }
  return customAnswers;
};

export const dateParser = date => {
  if (date) {
    return new Date(date);
  }
  return null;
};

export const apiReadParser = p => {
  const [coverage, coverageDataFirstLevel] = lib.coverageMapper(p.coverage);
  const [coverage_second_level, coverageDataSecondLevelLevel] = lib.coverageMapper(p.coverage_second_level);
  const coverageData = { ...coverageDataFirstLevel, ...coverageDataSecondLevelLevel };
  const interoperability_links = lib.interoperabilityLinksMapper(p.interoperability_links);
  const [platforms, digitalHealthInterventions] = lib.platformsMapper(p.platforms);
  const coverageType = coverage === undefined || coverage.length === 0 ? 2 : 1;
  p = lib.parseCustomAnswers(p);
  const country_custom_answers = lib.countryCustomFieldMapper(p.country_answers);
  const donor_custom_answers = lib.donorCustomFieldMapper(p.donor_answers);
  return { ...p,
    implementation_dates: dateParser(p.implementation_dates),
    start_date: dateParser(p.start_date),
    end_date: dateParser(p.end_date),
    coverage,
    coverage_second_level,
    coverageData,
    coverageType,
    interoperability_links,
    platforms,
    digitalHealthInterventions,
    country_custom_answers,
    donor_custom_answers
  };
};

export const isNullUndefinedOrEmptyString = value => value === null || value === undefined || value === '';

export const isEmpty = (value) => {
  if (Array.isArray(value)) {
    return false;
  } else if (value instanceof Date) {
    return !value.toJSON();
  } else if (value instanceof Object && value !== null) {
    return Object.keys(value).length === 0;
  }
  return lib.isNullUndefinedOrEmptyString(value);
};

export const dataCleaner = value => {
  if (Array.isArray(value)) {
    const result = value.filter(v => !lib.isNullUndefinedOrEmptyString(v));
    return result;
  }
  return value;
};

export const interoperabilityLinkWriteParser = links => {
  const result = [];
  for (const link in links) {
    const value = { ...links[link] };
    value.selected = value.selected ? true : undefined;
    value.link = !value.selected || lib.isNullUndefinedOrEmptyString(value.link) ? undefined : value.link;
    const item = { id: link, ...value };
    result.push(item);
  }
  return result.sort((a, b) => a.index - b.index).map(r => ({ ...r, index: undefined }));
};

export const platformsWriteParser = (platforms, digitalHealthInterventions) => {
  return platforms.map(p => {
    const strategies = [...digitalHealthInterventions.filter(dhi => dhi.platform === p).map(f => f.id)];
    return { id: p, strategies: strategies || [] };
  });
};

export const coverageWriteParser = (coverage, coverageData) => {
  return coverage.map(district => {
    const data = coverageData[district];
    return {
      district,
      ...data,
      clients: get(data, 'clients', 0),
      health_workers: get(data, 'health_workers', 0),
      facilities: get(data, 'facilities', 0)
    };
  });
};

export const customCountryAnswerParser = (customAnswers = []) => {
  return customAnswers.map(c => ({
    ...c,
    answer: c.answer[0] ? c.answer : []
  }));
};

export const customDonorAnswerParser = (customAnswers = [], donors = []) => {
  const result = donors.reduce((a, c) => {
    a[c] = [];
    return a;
  }, {});
  customAnswers.forEach(a => {
    const donor = a.donor_id;
    if (!result[donor]) {
      result[donor] = [];
    }
    result[donor].push({
      ...a,
      answer: a.answer[0] ? a.answer : [],
      donor_id: undefined });
  });
  return result;
};

export const apiWriteParser = (p, countryCustomAnswers, donorsCustomAnswers) => {
  const result = {};
  for (const key in p) {
    const value = dataCleaner(p[key]);
    result[key] = isEmpty(value) ? undefined : value;
  }
  const interoperability_links = interoperabilityLinkWriteParser(p.interoperability_links);
  const platforms = platformsWriteParser(p.platforms, p.digitalHealthInterventions);
  let coverage = [];
  let coverage_second_level = [];
  let national_level_deployment = null;
  if (p.coverageType === 1) {
    coverage = coverageWriteParser(p.coverage, p.coverageData);
    coverage_second_level = coverageWriteParser(p.coverage_second_level, p.coverageData);
    national_level_deployment = null;
  } else {
    coverage = [];
    coverage_second_level = [];
    national_level_deployment = {
      clients: get(p, 'national_level_deployment.clients', 0),
      health_workers: get(p, 'national_level_deployment.health_workers', 0),
      facilities: get(p, 'national_level_deployment.facilities', 0)
    };
  }
  const country_custom_answers = customCountryAnswerParser(countryCustomAnswers);
  const donor_custom_answers = customDonorAnswerParser(donorsCustomAnswers, p.donors);
  return {
    project: {
      ...result,
      interoperability_links,
      platforms,
      coverage,
      coverage_second_level,
      national_level_deployment,
      digitalHealthInterventions: undefined,
      coverageData: undefined,
      country_answers: undefined,
      donors_answers: undefined,
      modified: undefined
    },
    country_custom_answers,
    donor_custom_answers
  };
};

export const intArrayFromQs = item => {
  return item ? Array.isArray(item) ? item.map(i => +i) : [+item] : [];
};

export const strArrayFromQs = item => {
  return item ? Array.isArray(item) ? item : [item] : [];
};

export const queryStringComparisonParser = collection => {
  const result = {};
  for (const key in collection) {
    const item = collection[key];
    if (item === null) {
      result[key] = null;
    } else if (item && !Array.isArray(item)) {
      result[key] = '' + item;
    } else if (item && Array.isArray(item) && item.length > 0) {
      result[key] = item;
    }
  }
  return result;
};

export const questionWriteParser = (question, type, parent) => {
  return {
    is_active: question.is_active,
    type: +question.type,
    question: question.question,
    options: question.type > 3 ? question.options : [],
    private: question.is_private,
    required: question.required,
    [type]: parent.id
  };
};

export const customColumnsMapper = (columns, prefix) => {
  return columns.map(c => ({
    originalId: c.id,
    id: `${prefix}_${c.id}`,
    label: c.question,
    type: c.type,
    donorId: c.donor
  }));
};

export const parseCustomAnswers = r => {
  const donor_answers = {};
  if (r.donors) {
    r.donors.forEach(d => {
      donor_answers[d] = {
        ...(r.donor_custom_answers ? r.donor_custom_answers[d] : null),
        ...(r.donor_custom_answers_private ? r.donor_custom_answers_private[d] : null)
      };
    });
  }
  return {
    ...r,
    country_answers: {
      ...r.country_custom_answers,
      ...r.country_custom_answers_private
    },
    donor_answers,
    country_custom_answers: undefined,
    country_custom_answers_private: undefined,
    donor_custom_answers: undefined,
    donor_custom_answers_private: undefined
  };
};

export const APIError = (field, message) => {
  const error = new Error('APIError');
  error.response = {
    data: {
      project: {
        [field]: [message]
      }
    }
  };
  return error;
};

export const lib = {
  coverageMapper,
  platformsMapper,
  interoperabilityLinksMapper,
  parseCustomAnswers,
  countryCustomFieldMapper,
  donorCustomFieldMapper,
  isNullUndefinedOrEmptyString
};
