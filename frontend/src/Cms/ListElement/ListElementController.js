import { prettifyDate, itemType, axisAndDomainName, normalizeName, postProcessHtml } from '../utilities';

class ListElementController {

    constructor() {
        this.prettifyDate = prettifyDate;
        this.postProcessHtml = postProcessHtml;
        this.itemType = itemType;
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
