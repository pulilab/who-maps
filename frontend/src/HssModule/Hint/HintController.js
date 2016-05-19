class HintController {

    constructor() {
        this.EE = window.EE;

        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);

    }

    onInit() {
        this.editMode = false;
        this.layoutReady = false;
        this.bindEvents();
    }

    bindEvents() {
        this.EE.on('hssEditMode', this.handleEditMode, this);
    }

    removeEvents() {
        this.EE.removeListener('hssEditMode', this.handleEditMode, this);
    }

    onDestroy() {
        this.removeEvents();
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
