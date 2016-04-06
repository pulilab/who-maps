class HintController {

    constructor() {
        this.EE = window.EE;
        this.editMode = false;
        this.layoutReady = false;
        this.EE.on('hssEditMode', this.handleEditMode.bind(this));

    }

    handleEditMode(value) {
        this.editMode = value;
        this.layoutReady = false;
    }

    layoutDone() {
        this.layoutReady = true;
    }


    static hintControllerFactory() {
        function hintController() {
            require('./Hint.scss');
            return new HintController();
        }

        hintController.$inject = [];

        return hintController;
    }

}

export default HintController;
