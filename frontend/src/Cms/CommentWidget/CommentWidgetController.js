class CommentWidgetController {

    constructor() {
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
