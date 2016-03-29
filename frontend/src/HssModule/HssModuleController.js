class HssModuleController {

    constructor(introJs) {
        this.EE = window.EE;
        this.introJsSource = introJs;

        this.columnHasContent = [];

        this.EE.on('hssColumnContents', columnContentsArray => {
            this.columnHasContent = columnContentsArray;
        });

        this.EE.on('hssHasColumnContent', id => {
            this.EE.emit('hssGuysActivateColumn', {
                columnId: id,
                activated: this.columnHasContent[id]
            });
        });
        this.EE.on('hssHasColumnContentLastTwo', () => {
            this.EE.emit('hssHasContentLastTwo', {
                five: this.columnHasContent[5],
                six: this.columnHasContent[6]
            });
        });

        this.EE.on('hssPleaseActivateColumn', obj => {
            this.EE.emit('hssGuysActivateColumn', obj);
        });
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
