
class ReportDeleteButtonController {

    constructor() {
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        this.cs = require('../CmsService');
        this.isDelete = this.type && this.type === 'delete';
        this.status = this.item.state === 2 && !this.isDelete ? 'reported' : 'close';
    }

    open() {
        this.status = 'active';
    }

    close() {
        this.status = 'close';
    }

    doReport() {
        if (this.item.user) {
            this.cs.reportComment(this.item);
        }
        else {
            this.cs.reportContent(this.item);
        }
        this.status = 'reported';
    }

    doDelete() {
        if (this.item.user) {
            this.cs.deleteComment(this.item);
        }
        else {
            this.cs.deleteContent(this.item);
        }
    }

    doAction() {
        this.isDelete ? this.doDelete() : this.doReport();
    }

    static factory() {
        require('./ReportDeleteButton.scss');
        function reportButton() {
            return new ReportDeleteButtonController();
        }
        reportButton.$inject = [];
        return reportButton;
    }
}

export default ReportDeleteButtonController;
