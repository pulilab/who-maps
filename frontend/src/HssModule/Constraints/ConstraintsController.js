import { taxonomyLib } from '../hssMockData';
import _ from 'lodash';
class ConstraintsController {

    constructor() {
        const vm = this;
        vm.EE = window.EE;
        vm.editMode = false;
        vm.EE.on('hssEditMode', this.handleEditMode.bind(this));
        this.constraints = this.constraintsToggleGenerator();
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
        return _.chain(taxonomyLib)
            .keys()
            .map(value => {
                return {
                    name: value,
                    icon: taxonomyLib[value].icon,
                    active: false
                };
            })
            .value();
    }

    constraintChanged() {
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
