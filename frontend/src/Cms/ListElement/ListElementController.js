class ListElementController {

    constructor() {
    }

    static factory() {
        require('./ListElement.scss');
        function listElement() {
            return new ListElementController();
        }
        listElement().$inject = [];
        return listElement;
    }
}

export default ListElementController;
