import { Storage } from '../../Common/';

let singleton = false;

export default class PDFExportStorage {

    constructor() {
        this.storage = new Storage();
    }

    setData(projectList, country, countryFlag) {
        this.projectList = projectList;
        this.country = country;
        this.countryFlag = countryFlag;
        this.storage.set('pdfExport', { projectList, country, countryFlag });
    }

    getData() {
        let fromStorage = this.storage.get('pdfExport');
        if (!fromStorage) {
            fromStorage = {};
        }
        const projectList = this.projectList  = fromStorage.projectList;
        const country = this.country = fromStorage.country;
        const countryFlag = this.countryFlag = fromStorage.countryFlag;
        return { projectList, country, countryFlag };
    }

    static factory() {
        if (!singleton) {
            singleton = new PDFExportStorage();
        }
        return singleton;

    }
}
