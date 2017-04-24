import { prettifyDate, itemType, axisAndDomainName } from '../utilities';

class ListElementController {

    constructor() {
        this.$onInit = this.onInit.bind(this);
        this.prettifyDate = prettifyDate;
        this.itemType = itemType;
    }

    onInit() {
    }

    showAxisAndDomain() {
        const result = axisAndDomainName(this.item.domain);
        return `${result.axisName} - ${result.domainName}`;
    }

    axisAndDomainClass() {
        const result = axisAndDomainName(this.item.domain);
        result.domainName = result.domainName.split(' ').join('-').toLowerCase();
        result.axisName = result.axisName.split(' ').join('-').toLowerCase();
        return `axis-${result.axisName} domain-${result.domainName}`;
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
