import _ from 'lodash';
import HssModuleService from '../HssModuleService';
class ConstraintsController {

    constructor() {
        const vm = this;
        vm.EE = window.EE;
        vm.editMode = false;
        this.hs = new HssModuleService();
        vm.EE.on('hssEditMode', this.handleEditMode.bind(this));
        this.$onInit = () => {
            this.constraints = this.constraintsToggleGenerator();
            this.checkSizeAndFireCallback();
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
            .map((value, key) => {
                const _active = this.data.constraints[key] && this.data.constraints[key].active;
                return {
                    name: value,
                    icon: this.structure.taxonomies[value].icon,
                    active: _active
                };
            })
            .value();
    }

    constraintChanged(data) {
        this.hs.postConstraints([data]);
        this.EE.emit('hssConstraintsSelected', _.cloneDeep(this.constraints));
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
