import { prettifyDate } from '../utilities';

class CommentWidgetController {

    constructor() {
        this.prettifyDate = prettifyDate;
        this.$onInit = this.onInit.bind(this);
    }
    onInit() {
        this.expanded = false;
    }

    readMore() {
        this.expanded = !this.expanded;
    }

    static factory() {
        require('./CommentWidget.scss');
        function commentWidget() {
            return new CommentWidgetController();
        }
        commentWidget().$inject = [];
        return commentWidget;
    }
}

export default CommentWidgetController;
