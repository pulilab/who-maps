import isNil from 'lodash/isNil';
import CollapsibleSet from '../CollapsibleSet';
import * as CountriesModule from '../../store/modules/countries';

class ImplementationOverview extends CollapsibleSet {
  constructor ($scope, $element, $ngRedux) {
    super($element, $scope, 'project', [], [], $ngRedux);
    this.$onInit = this.onInit.bind(this);
    this.$onDestroy = this.onDestroy.bind(this);
    this.setAvailableOptions = this.setAvailableOptions.bind(this);
    this.mapHealthFocusAreas = this.mapHealthFocusAreas.bind(this);
  }

  mapData (state) {
    const subLevelNames = CountriesModule.getCurrentCountrySubLevelNames(state);
    const facilities = CountriesModule.getCurrentCountryFacilityList(state);
    return {
      districtList: CountriesModule.getCurrentCountryFirstSubLevel(state),
      secondSubLevelList: CountriesModule.getCurrentCountrySecondSubLevel(state),
      subLevelNames,
      facilities
    };
  }

  onInit () {
    this.districtList = [];
    this.defaultOnInit();
    this.unsubscribe = this.$ngRedux.connect(this.mapData, CountriesModule)(this);
    this.watchers();
    this.health_focus_areas = this.mapHealthFocusAreas(this.structure.health_focus_areas);
    if (!this.optionValue) {
      this.optionValue = this.optionLabel;
    }
  }

  onDestroy () {
    this.defaultOnDestroy();
    this.unsubscribe();
  }

  watchers () {
    this.scope.$watch(() => {
      return this.project.platforms;
    }, (platform) => {
      this.setAvailableDictOptions(platform, this.structure.technology_platforms);
      this.dispatchChange('platforms', platform);
    }, true);

    this.scope.$watch(() => {
      return this.project.coverage;
    }, (coverage) => {
      this.observeCoverage = {};
      this.clearDistrict(coverage);
      this.dispatchChange('coverage', coverage);
    }, true);

    this.scope.$watch(() => {
      return this.project.coverage_second_level;
    }, (coverage_second_level) => {
      this.observeCoverageSecondLevel = {};
      this.clearDistrict(coverage_second_level);
      this.dispatchChange('coverage_second_level', coverage_second_level);
    }, true);

    this.scope.$watchGroup([() => {
      return this.observeCoverage;
    }, () => {
      return this.districtList;
    }], ([, districts]) => {
      this.setAvailableDictOptions(this.project.coverage, districts, 'district');
      this.initializeFacilityList(this.project.coverage);
      this.addClearOption(this.project.coverage);
    });

    this.scope.$watchGroup([() => {
      return this.observeCoverageSecondLevel;
    }, () => {
      return this.secondSubLevelList;
    }], ([, secondSubLevel]) => {
      this.setAvailableDictOptions(this.project.coverage_second_level, secondSubLevel, 'district');
      this.initializeFacilityList(this.project.coverage_second_level);
      this.addClearOption(this.project.coverage_second_level);
    });

    this.scope.$watch(s => s.vm.districtList, this.removeUnavailableDistricts.bind(this));
  }

  initializeFacilityList (collection) {
    collection.forEach(c => {
      c.facilities_list = c.facilities_list || [];
    });
  }

  updateFacilityNumber (coverage) {
    coverage.facilities = coverage.facilities_list.length;
  }

  addClearOption (districts) {
    if (districts && districts.length > 0) {
      districts.forEach(p => {
        if (p.available.indexOf('Clear selection') === -1 && p.district !== undefined) {
          p.available.unshift('Clear selection');
        }
      });
    }
  }

  clearDistrict (coverage) {
    if (coverage && coverage.length > 0) {
      for (const cov of coverage) {
        if (cov.district === 'Clear selection') {
          cov.district = undefined;
          cov.health_workers = undefined;
          cov.facilities = undefined;
          cov.clients = undefined;
        }
      }
    }
  }

  removeUnavailableDistricts (districts) {
    if (this.project.coverage && this.project.coverage.length > 0 &&
          districts && districts.length > 0) {
      this.project.coverage.forEach(cov => {
        if (districts.map(d => d.id).indexOf(cov.district) === -1) {
          if (cov.district) {
            console.warn(`The selected location: ${cov.district} is not available anymore`);
            cov.district = undefined;
          }
        }
      });
    }
  }

  mapHealthFocusAreas (healthFocusAreas) {
    const intervention = {
      name: '',
      subGroups: []
    };
    let color = 0;
    for (const grandparent of healthFocusAreas) {
      color += 1;
      grandparent.class = `group-${color}`;
      intervention.subGroups.push(grandparent);
    }
    return [intervention];
  }

  async searchFacility (name, facilities_list) {
    return this.facilities.filter(f => f.includes(name) && !facilities_list.includes(f)).slice(0, 100);
  }

  isSubLevelCoverageDistrictRequired (district) {
    return !isNil(district.health_workers) || !isNil(district.clients) || !isNil(district.facilities);
  }

  isSubLevelCoverageRequired () {
    return this.project.coverageType === 1 && this.activateValidation;
  }

  isNationalLevelCoverageRequired () {
    return this.project.coverageType === 2 && this.activateValidation;
  }

  static factory () {
    require('./ImplementationOverview.scss');
    function implementation ($scope, $element, $ngRedux) {
      return new ImplementationOverview($scope, $element, $ngRedux);
    }
    implementation.$inject = ['$scope', '$element', '$ngRedux'];
    return implementation;
  }
}

export default ImplementationOverview;
