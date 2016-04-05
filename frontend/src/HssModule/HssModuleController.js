class HssModuleController {

    constructor(introJs) {
        this.EE = window.EE;
        this.introJsSource = introJs;
        this.editMode = false;

        this.columnHasContent = [];

        this.EE.on('hssColumnContents', this.reFresh.bind(this));

        this.EE.on('hssHasColumnContent', this.onAskIfColumnGotContent.bind(this));

        this.EE.on('hssHasColumnContentLastTwo', this.onLastTwoContentAsked.bind(this));

        this.EE.on('hssPleaseActivateColumn', this.askedToActivateColumn.bind(this));

        this.EE.on('hssEditMode', this.handleEditMode.bind(this));

    }

    handleEditMode(value) {
        this.editMode = value;
    }

    reFresh(columnContentsArray) {
        this.columnHasContent = columnContentsArray;
    }

    onAskIfColumnGotContent(id) {
        this.EE.emit('hssGuysActivateColumn', {
            columnId: id,
            activated: this.columnHasContent[id]
        });
    }

    onLastTwoContentAsked() {
        this.EE.emit('hssHasContentLastTwo', {
            five: this.columnHasContent[5],
            six: this.columnHasContent[6]
        });
    }

    askedToActivateColumn(obj) {
        this.EE.emit('hssGuysActivateColumn', obj);
    }

    static hssControllerFactory() {
        function hssController() {
            const introJs = require('./resources/introJsSource.json');
            return new HssModuleController(introJs);
        }

        hssController.$inject = [];

        return hssController;
    }

}

export default HssModuleController;
