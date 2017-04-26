import { prettifyDate, itemType, axisAndDomainName, normalizeName } from '../utilities';

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
        result.domainName = normalizeName(result.domainName);
        result.axisName = normalizeName(result.axisName);
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
