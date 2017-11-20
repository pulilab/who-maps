import some from 'lodash/some';
import every from 'lodash/every';
import isNil from 'lodash/isNil';
import isNull from 'lodash/isNull';
import CollapsibleSet from '../CollapsibleSet';
import * as CountriesModule from '../../store/modules/countries';

class ImplementationOverview extends CollapsibleSet {

    constructor($scope, $element, $ngRedux) {
        super($element, $scope, 'project');
        this.$ngRedux = $ngRedux;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.setAvailableOptions = this.setAvailableOptions.bind(this);
        this.mapHealthFocusAreas = this.mapHealthFocusAreas.bind(this);
    }

    mapData(state) {
        return {
            districtList: CountriesModule.getCurrentCountryDistricts(state)
        };
    }

    onInit() {
        this.districtList = [];
        this.validateCoverage = this.validateCoverage.bind(this);
        this.defaultOnInit();
        this.unsubscribe = this.$ngRedux.connect(this.mapData, CountriesModule)(this);
        this.watchers();
        this.health_focus_areas = this.mapHealthFocusAreas(this.structure.health_focus_areas);
    }

    onDestroy() {
        this.defaultOnDestroy();
        this.unsubscribe();
    }

    watchers() {
        this.scope.$watch(() => {
            return this.project.platforms;
        }, (platform) => {
            this.setAvailableOptions(platform, this.structure.technology_platforms, 'name');
            this.addOtherOption(platform);
        }, true);

        this.scope.$watch(()=>{
            return this.project.coverage;
        }, (coverage) => {
            this.observeCoverage = {};
            this.clearDistrict(coverage);
        }, true);

        this.scope.$watchGroup([() => {
            return this.observeCoverage;
        }, () => {
            return this.districtList;
        }], ([, districts]) => {
            this.setAvailableOptions(this.project.coverage, districts, 'district');
            this.addClearOption(this.project.coverage);
        });

        this.scope.$watch(s => s.vm.districtList, this.removeUnavailableDistricts.bind(this));
    }

    addOtherOption(platform) {
        platform.forEach(p => {
            if (p.available.indexOf('Other') === -1) {
                p.available.push('Other');
            }
        });
    }

    addClearOption(districts) {
        districts.forEach(p => {
            if (p.available.indexOf('Clear selection') === -1 && p.district !== undefined) {
                p.available.unshift('Clear selection');
            }
        });
    }

    clearDistrict(coverage) {
        for (const cov of coverage) {
            if (cov.district === 'Clear selection') {
                cov.district = undefined;
                cov.health_workers = undefined;
                cov.facilities = undefined;
                cov.clients = undefined;
            }
        }
    }

    removeUnavailableDistricts(districts) {
        if (districts.length > 0) {
            this.project.coverage.forEach(cov => {
                if (districts.indexOf(cov.district) === -1) {
                    cov.district = undefined;
                }
            });
        }
    }

    mapHealthFocusAreas(healthFocusAreas) {
        const intervention = {
            name: '',
            subGroups: []
        };
        let color = 0;
        for (const grandparent of healthFocusAreas) {
            color += 1;
            for (const parent of grandparent.subGroups) {
                parent.class = `group-${color}`;
                intervention.subGroups.push(parent);
            }
        }
        return [intervention];
    }

    validateCoverage(current, item) {

        let nld;
        if (this.project.national_level_deployment) {
            nld = [
                this.project.national_level_deployment.health_workers,
                this.project.national_level_deployment.facilities,
                this.project.national_level_deployment.clients
            ];
        }
        else {
            nld = [null];
        }

        if (current === 'nld' && this.project.national_level_deployment) {
            return some(nld);
        }
        else if (current === 'dld') {
            return some([
                item.district,
                !isNil(item.health_workers),
                !isNil(item.facilities),
                !isNil(item.clients),
                every(nld, isNull)
            ]);
        }
        return false;
    }

    handleCustomError(key) {
        this.form[key].$setValidity('custom', true);
        this.form[key].customError = [];
    }

    setCustomError(key, error) {
        const errors = this.form[key].customError || [];
        if (errors.indexOf('error') === -1) {
            errors.push(error);
        }
        this.form[key].$setValidity('custom', false);
        this.form[key].customError = errors;
    }


    static factory() {
        require('./ImplementationOverview.scss');
        function implementation($scope, $element, $ngRedux) {
            return new ImplementationOverview($scope, $element, $ngRedux);
        }
        implementation.$inject = ['$scope', '$element', '$ngRedux'];
        return implementation;
    }
}

export default ImplementationOverview;
