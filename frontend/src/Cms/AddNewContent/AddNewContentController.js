class AddNewContentController {

    constructor() {
    }

    static factory() {
        require('./AddNewContent.scss');

        function addNewContent() {
            return new AddNewContentController();
        }

        addNewContent().$inject = [];
        return addNewContent;
    }
}

export default AddNewContentController;
