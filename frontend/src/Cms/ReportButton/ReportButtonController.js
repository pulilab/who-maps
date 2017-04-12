class ReportButtonController {

    constructor() {
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        const mockData = require('../resources/mockData');
        this.currentItem = mockData[this.type].find(item => {
            return item.id === this.itemId;
        });
        this.reportStatus = this.currentItem.reported ? 'reported' : 'close';
    }

    openReport() {
        this.reportStatus = 'active';
    }

    closeReport() {
        this.reportStatus = 'close';
    }

    doReport() {
        this.reportStatus = 'reported';
    }

    static factory() {
        require('./ReportButton.scss');
        function reportButton() {
            return new ReportButtonController();
        }
        reportButton().$inject = [];
        return reportButton;
    }
}

export default ReportButtonController;
