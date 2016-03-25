class HssModuleController {

    constructor(introJs) {
        this.EE = window.EE;
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
