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

export const coverageMapper = collection => {
  const coverage = [];
  const coverageData = {};
  collection.forEach(c => {
    coverage.push(c.district);
    coverageData[c.district] = {
      clients: c.clients,
      facilities: c.facilities,
      health_workers: c.health_workers,
      facilities_list: c.facilities_list
    };
  });
  return [coverage, coverageData];
};

export const interoperabilityLinksMapper = links => {
  const result = {};
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
  collection.forEach(p => {
    platforms.push(p.id);
    digitalHealthInterventions.push(...p.strategies.map(s => ({id: s, platform: p.id})));
  });
  return [platforms, digitalHealthInterventions];
};
