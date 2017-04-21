import { prettifyDate, itemType } from '../utilities';

class ListElementController {

    constructor() {
        this.$onInit = this.onInit.bind(this);
        this.prettifyDate = prettifyDate;
        this.itemType = itemType;
    }

    onInit() {
    }

    static factory() {
        require('./ListElement.scss');
        function listElement() {
            return new ListElementController();
        }
        listElement.$inject = [];
        return listElement;
    }
}

export default ListElementController;
