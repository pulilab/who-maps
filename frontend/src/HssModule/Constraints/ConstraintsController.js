import { taxonomyLib } from '../hssMockData';
import _ from 'lodash';
class ConstraintsController {

    constructor() {
        const vm = this;
        vm.EE = window.EE;
        vm.editMode = false;
        vm.EE.on('hssEditMode', this.handleEditMode.bind(this));
        this.constraints = _.keys(taxonomyLib);
        this.constraintsToggle = _.map(this.constraints, (value) => {
            return {
                name: value,
                icon: taxonomyLib[value].icon,
                toggled: false
            };
        });
    }

    handleEditMode(value) {
        this.editMode = value;
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
