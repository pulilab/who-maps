
class ReportButtonController {

    constructor() {
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        this.cs = require('../CmsService');
        this.reportStatus = this.item.state === 2 ? 'reported' : 'close';
    }

    openReport() {
        this.reportStatus = 'active';
    }

    closeReport() {
        this.reportStatus = 'close';
    }

    doReport() {
        if (this.item.user) {
            this.cs.reportComment(this.item);
        }
        else {
            this.cs.reportContent(this.item);
        }
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
