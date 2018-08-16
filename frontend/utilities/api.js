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
  return {...p,
    coverage,
    coverage_second_level,
    coverageData,
    interoperability_links,
    platforms,
    digitalHealthInterventions
  };
};

export const isNullUndefinedOrEmptyString = value => value === null || value === undefined || value === '';

export const isEmpty = (value) => {
  if (Array.isArray(value)) {
    const filtered = value.filter(v => !isNullUndefinedOrEmptyString(v));
    return filtered.length === 0;
  } else if (value instanceof Date) {
    return false;
  } else if (value instanceof Object && value !== null) {
    return Object.keys(value).length === 0;
  }
  return isNullUndefinedOrEmptyString(value);
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

export const coverageWriteParser = (coverage, coverageData) => {
  return coverage.map(district => {
    const data = coverageData[district];
    return {district, ...data};
  });
};

export const apiWriteParser = p => {
  const result = {};
  for (let key in p) {
    const value = p[key];
    console.log(key, value);
    result[key] = isEmpty(value) ? undefined : value;
  }
  const interoperability_links = interoperabilityLinkWriteParser(p.interoperability_links);
  const platforms = platformsWriteParser(p.platforms, p.digitalHealthInterventions);
  const coverage = coverageWriteParser(p.coverage, p.coverageData);
  const coverage_second_level = coverageWriteParser(p.coverage_second_level, p.coverageData);
  return {
    ...result,
    interoperability_links,
    platforms,
    coverage,
    coverage_second_level,
    digitalHealthInterventions: undefined,
    coverageData: undefined
  };
};
