
class ReportButtonController {

    constructor() {
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        this.reportStatus = this.item.reported ? 'reported' : 'close';
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
