import _ from 'lodash';

class ConstraintsController {

    constructor() {
        const vm = this;
        vm.EE = window.EE;
        vm.editMode = false;
        vm.EE.on('hssEditMode', this.handleEditMode.bind(this));
        this.$onInit = () => {
            vm.hs = vm.service;
            this.constraints = this.constraintsToggleGenerator();
            this.checkSizeAndFireCallback();
            vm.EE.on('hssTaxonomiesUpdated', this.constraintsUpdated.bind(this));
        };

    }

    handleEditMode(value) {
        this.editMode = value;
        this.checkSizeAndFireCallback();
    }

    checkSizeAndFireCallback() {
        const active = _.filter(this.constraints, { active: true });
        if (this.resizeCallback) {
            this.resizeCallback(active.length);
        }
    }

    constraintsToggleGenerator() {
        return _.chain(this.structure.taxonomies)
            .keys()
            .map((value) => {
                return {
                    name: value,
                    icon: this.structure.taxonomies[value].icon,
                    active: _.some(this.data.constraints, { name: value, active: true })
                };
            })
            .value();
    }

    constraintsUpdated() {
        this.updateConstraintsData();
        this.hs.postConstraints(this.constraints);
    }

    getConstraintCategoryFromTaxonomy(taxonomy) {
        return _.compact(_.chain(this.structure.taxonomies)
            .keys()
            .map((value) => {
                if (_.includes(this.structure.taxonomies[value].values, taxonomy)) {
                    return value;
                }
                return void 0;
            })
            .value()
        )[0];
    }

    getActiveConstraints() {
        return _.uniq(_.flatten(_.map(this.data.taxonomies, (rowData) => {
            return _.map(rowData.content, (taxonomy) => {
                return this.getConstraintCategoryFromTaxonomy(taxonomy);
            });
        })));
    }

    updateConstraintsData() {
        const activeConstraints = this.getActiveConstraints();
        _.forEach(this.constraints, (constraint) => {
            constraint.active = _.includes(activeConstraints, constraint.name);
        });
    }


    static constraintsFactory() {
        require('./Constraints.scss');
        function constraints() {
            return new ConstraintsController();
        }

        constraints.$inject = [];

        return constraints;
    }

}

export default ConstraintsController;
