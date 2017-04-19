import { prettifyDate } from '../utilities';

class ListElementController {

    constructor() {
        this.$onInit = this.onInit.bind(this);
        this.prettifyDate = prettifyDate;
    }

    onInit() {
    }

    itemType() {
        if (this.item) {
            const typeLib = ['Lessons & Tips', 'Resources', 'Experiences'];
            return typeLib[this.item.type - 1];
        }
        return '';
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
