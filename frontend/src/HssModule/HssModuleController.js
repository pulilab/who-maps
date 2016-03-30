class HssModuleController {

    constructor(introJs) {
        this.EE = window.EE;
        this.introJsSource = introJs;

        this.columnHasContent = [];

        this.EE.on('hssColumnContents', this.reFresh.bind(this));

        this.EE.on('hssHasColumnContent', this.onAskIfColumnGotContent.bind(this));

        this.EE.on('hssHasColumnContentLastTwo', this.onLastTwoContentAsked.bind(this));

        this.EE.on('hssPleaseActivateColumn', this.askedToActivateColumn.bind(this));

    }

    reFresh(columnContentsArray) {
        this.columnHasContent = columnContentsArray;
    }

    onAskIfColumnGotContent() {
        this.EE.emit('hssHasContentLastTwo', {
            five: this.columnHasContent[5],
            six: this.columnHasContent[6]
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
