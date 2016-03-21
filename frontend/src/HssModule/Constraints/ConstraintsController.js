
class ConstraintsController {

    constructor($timeout) {
        const vm = this;
        $timeout(() => {
            vm.EE = window.EE;
            vm.editMode = false;
            vm.EE.on('hssEditMode', this.handleEditMode.bind(this));
        });
    }

    handleEditMode(value) {
        this.editMode = value;
    }


    static constraintsFactory() {
        require('./Constraints.scss');
        function constraints($timeout) {
            return new ConstraintsController($timeout);
        }

        constraints.$inject = ['$timeout'];

        return constraints;
    }

}

export default ConstraintsController;
