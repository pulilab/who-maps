import { prettifyDate } from '../utilities';

class CommentWidgetController {

    constructor() {
        this.prettifyDate = prettifyDate;
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
