import { prettifyDate } from '../utilities';

class ListElementController {

    constructor() {
        this.$onInit = this.onInit.bind(this);
        this.prettifyDate = prettifyDate;
    }

    onInit() {
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
