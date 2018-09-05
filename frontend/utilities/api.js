export const coverageMapper = collection => {
  const coverage = [];
  const coverageData = {};
  collection = collection || [];
  collection.forEach(c => {
    coverage.push(c.district);
    coverageData[c.district] = {
      clients: c.clients,
      facilities: c.facilities_list ? c.facilities_list.length : c.facilities,
      health_workers: c.health_workers,
      facilities_list: c.facilities_list
    };
  });
  return [coverage, coverageData];
};

export const interoperabilityLinksMapper = links => {
  const result = {};
  links = links || [];
  links.forEach(l => {
    result[l.id] = {
      link: l.link,
      selected: l.selected
    };
  });
  return result;
};

export const platformsMapper = collection => {
  const platforms = [];
  const digitalHealthInterventions = [];
  collection = collection || [];
  collection.forEach(p => {
    platforms.push(p.id);
    digitalHealthInterventions.push(...p.strategies.map(s => ({id: s, platform: p.id})));
  });
  return [platforms, digitalHealthInterventions];
};

export const apiReadParser = p => {
  const [ coverage, coverageDataFirstLevel ] = coverageMapper(p.coverage);
  const [ coverage_second_level, coverageDataSecondLevelLevel ] = coverageMapper(p.coverage_second_level);
  const coverageData = {...coverageDataFirstLevel, ...coverageDataSecondLevelLevel};
  const interoperability_links = interoperabilityLinksMapper(p.interoperability_links);
  const [ platforms, digitalHealthInterventions ] = platformsMapper(p.platforms);
  const coverageType = coverage === undefined || coverage.length === 0 ? 2 : 1;
  return {...p,
    coverage,
    coverage_second_level,
    coverageData,
    coverageType,
    interoperability_links,
    platforms,
    digitalHealthInterventions
  };
};

export const isNullUndefinedOrEmptyString = value => value === null || value === undefined || value === '';

export const isEmpty = (value) => {
  if (Array.isArray(value)) {
    return false;
  } else if (value instanceof Date) {
    return false;
  } else if (value instanceof Object && value !== null) {
    return Object.keys(value).length === 0;
  }
  return isNullUndefinedOrEmptyString(value);
};

export const dataCleaner = value => {
  if (Array.isArray(value)) {
    const result = value.filter(v => !isNullUndefinedOrEmptyString(v));
    return result;
  }
  return value;
};

export const interoperabilityLinkWriteParser = links => {
  const result = [];
  for (let link in links) {
    const value = {...links[link]};
    value.link = isNullUndefinedOrEmptyString(value.link) ? undefined : value.link;
    value.selected = value.selected ? true : undefined;
    if (value.link || value.selected) {
      const item = {id: link, ...value};
      result.push(item);
    }
  }
  return result;
};

export const platformsWriteParser = (platforms, digitalHealthInterventions) => {
  return platforms.map(p => {
    const strategies = [...digitalHealthInterventions.filter(dhi => dhi.platform === p).map(f => f.id)];
    return {id: p, strategies: strategies || []};
  });
};

const baseCoverage = {
  clients: 0,
  facilities: 0,
  health_workers: 0
};

export const coverageWriteParser = (coverage, coverageData) => {
  return coverage.map(district => {
    const data = coverageData[district];
    return {district, ...baseCoverage, ...data};
  });
};

export const apiWriteParser = p => {
  const result = {};
  for (let key in p) {
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
  } else {
    national_level_deployment = {...baseCoverage, ...p.national_level_deployment};
  }

  return {
    ...result,
    interoperability_links,
    platforms,
    coverage,
    coverage_second_level,
    national_level_deployment,
    digitalHealthInterventions: undefined,
    coverageData: undefined
  };
};

export const intArrayFromQs = item => {
  return item ? Array.isArray(item) ? item.map(i => +i) : [+item] : [];
};

export const queryStringComparisonParser = collection => {
  const result = {};
  for (let key in collection) {
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
